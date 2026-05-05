"use client";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gql } from "@apollo/client";
import { addtoQueue, clearQueue, getQueue } from "@/lib/offline-queue";
import {
	CREATE_TASK,
	GET_PROJECTS,
	TASK_CREATED_SUBSCRIPTION,
	UPDATE_TASK_STATUS,
} from "@/app/utils/gql-queries";
import {
	AnalyticsObj,
	CreateTaskResponse,
	CreateTaskVariables,
	Project,
	Task,
	TaskCreatedSubscriptionResponse,
	TaskStatus,
} from "@/app/utils/types";
import { toast } from "sonner";

import DashboardSkeleton from "./DashboardSkeleton";
import CardComponent from "@/components/dashboard/CardComponent";

const KanbanBoard = dynamic(() => import("./KanbanBoard"), {
	loading: () => (
		<div className='h-64 animate-pulse rounded-xl border bg-muted/40' />
	),
});
const AnalyticsComponent = dynamic(
	() => import("@/components/dashboard/AnalyticsComponent"),
	{
		loading: () => (
			<div className='h-48 animate-pulse rounded-xl border bg-muted/40' />
		),
	},
);
const CreateProject = dynamic(() => import("./CreateProject"), {
	loading: () => (
		<div className='h-24 animate-pulse rounded-xl border bg-muted/40' />
	),
});
const ProjectComponent = dynamic(
	() => import("@/components/dashboard/ProjectComponent"),
);

const DashboardClient = () => {
	const [isOffline, setIsOffline] = useState(false);

	const { data, loading, error } = useQuery<{ projects: Project[] }>(
		GET_PROJECTS,
		{
			fetchPolicy: "cache-and-network",
			nextFetchPolicy: "cache-first",
		},
	);
	const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
	const [analytics, setAnalytics] = useState<AnalyticsObj>({
		totalProjects: 0,
		totalTasks: 0,
		completedTasks: 0,
		completionRate: 0,
		todoTasks: 0,
		inProgressTasks: 0,
	});
	const [titles, setTitles] = useState<Record<string, string>>({});
	const [createTask] = useMutation<CreateTaskResponse, CreateTaskVariables>(
		CREATE_TASK,
	);

	useSubscription<TaskCreatedSubscriptionResponse>(TASK_CREATED_SUBSCRIPTION, {
		onData: ({ client, data }) => {
			const newTask = data.data?.taskCreated;

			if (!newTask) return;

			client.cache.modify({
				id: client.cache.identify({
					__typename: "Project",
					id: newTask.projectId,
				}),
				fields: {
					tasks(existingTaskRefs = [], { readField }) {
						const refs =
							Array.isArray(existingTaskRefs) ? existingTaskRefs : (
								[existingTaskRefs]
							);
						const alreadyExists = refs.some((taskRef) => {
							const existingClientMutationId = readField(
								"clientMutationId",
								taskRef,
							);

							return existingClientMutationId === newTask.clientMutationId;
						});
						if (alreadyExists) {
							return existingTaskRefs;
						}

						const newTaskRef = client.cache.writeFragment({
							data: newTask,
							fragment: gql`
								fragment IncomingTask on Task {
									__typename
									id
									title
									status
									projectId
								}
							`,
						});

						if (!newTaskRef) {
							return existingTaskRefs;
						}

						return [...refs, newTaskRef];
					},
				},
			});
		},
	});

	const handleMoveTask = (
		task: Task & { projectName: string },
		status: TaskStatus,
	) => {
		const { id, projectName, title } = task;
		const projectId = data?.projects.find(
			(project) => project.name === projectName,
		)?.id;
		try {
			updateTaskStatus({
				variables: {
					taskId: id,
					status: status,
				},
				optimisticResponse: {
					updateTaskStatus: {
						__typename: "Task",
						id,
						status: status,
						title,
						projectId,
					},
				},
			});
			toast.success("Task status updated");
		} catch (error) {
			toast.error(`Task status update failed ${error}`);
		}
	};
	const handleClick = async (id: string) => {
		const title = titles[id]?.trim();

		if (!title) return;
		if (isOffline) {
			await addtoQueue({
				__typename: "Task",
				id: `offline-${Date.now()}`,
				title: title,
				status: "TODO",
				projectId: Math.random().toString(),
			});
			toast.info("Saved offline. Will sync later.");
			return;
		} else {
			const clientMutationId = crypto.randomUUID();
			try {
				createTask({
					variables: {
						projectId: id,
						title: title,
					},
					optimisticResponse: {
						createTask: {
							__typename: "Task",
							id: `temp-${clientMutationId}`,
							title: title,
							status: "TODO",
							projectId: id,
							clientMutationId,
						},
					},
					update(cache, { data }) {
						const newTask = data?.createTask;
						if (!newTask) return;

						cache.modify({
							id: cache.identify({
								__typename: "Project",
								id: id,
							}),
							fields: {
								tasks(existingTaskRefs = []) {
									const newTaskRef = cache.writeFragment({
										data: newTask,
										fragment: gql`
											fragment NewTask on Task {
												__typename
												id
												title
												status
											}
										`,
									});

									return [...existingTaskRefs, newTaskRef];
								},
							},
						});
					},
				});
				toast.success("Task created Successfully");
			} catch (error) {
				toast.error(`Failed to create task ${error}`);
			}
		}

		setTitles((prev) => ({
			...prev,
			[id]: "",
		}));
	};

	useEffect(() => {
		const sync = async () => {
			if (!navigator.onLine) return;

			const queued = await getQueue();

			for (const task of queued) {
				await createTask({
					variables: {
						projectId: task.projectId,
						title: task.title,
					},
				});
			}

			if (queued.length > 0) {
				await clearQueue();
				console.log("Synced offline tasks");
			}
		};

		window.addEventListener("online", sync);

		return () => window.removeEventListener("online", sync);
	}, [createTask]);

	useEffect(() => {
		if (!data?.projects) return;

		const worker = new Worker(
			new URL("../../workers/analytics.worker.ts", import.meta.url),
		);

		worker.postMessage(data.projects);

		worker.onmessage = (event) => {
			setAnalytics(event.data);
		};

		return () => worker.terminate();
	}, [data]);

	useEffect(() => {
		const updateOnlineStatus = () => {
			setIsOffline(!navigator.onLine);
		};

		updateOnlineStatus();

		window.addEventListener("online", updateOnlineStatus);
		window.addEventListener("offline", updateOnlineStatus);

		return () => {
			window.removeEventListener("online", updateOnlineStatus);
			window.removeEventListener("offline", updateOnlineStatus);
		};
	}, []);

	if (loading) return <DashboardSkeleton />;

	if (error) {
		toast.error(error.message);

		return <main className='p-6'>Something went wrong.</main>;
	}

	return (
		<main className='min-h-screen bg-background p-6'>
			<div className='mx-auto max-w-5xl space-y-6'>
				<AnalyticsComponent
					analytics={analytics}
					projects={data?.projects ?? []}
				/>
				<KanbanBoard
					projects={data?.projects ?? []}
					onMoveTask={handleMoveTask}
				/>
				<CreateProject />
				<CardComponent title='Projects'>
					<Suspense
						fallback={
							<div className='h-24 animate-pulse rounded-md bg-muted/40' />
						}
					>
						<div className='space-y-3'>
							{data?.projects.map((project) => (
								<ProjectComponent
									key={project.id}
									project={project}
									titles={titles}
									setTitles={setTitles}
									handleClick={handleClick}
								/>
							))}
						</div>
					</Suspense>
				</CardComponent>
			</div>
		</main>
	);
};

export default DashboardClient;
