"use client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";

import CardComponent from "@/components/dashboard/CardComponent";
import ProjectComponent from "@/components/dashboard/ProjectComponent";
import { gql } from "@apollo/client";
import { addtoQueue, clearQueue, getQueue } from "@/lib/offline-queue";
import AnalyticsComponent from "@/components/dashboard/AnalyticsComponent";
import {
	CREATE_PROJECT,
	CREATE_TASK,
	GET_PROJECTS,
} from "@/app/utils/gql-queries";
import {
	AnalyticsObj,
	CreateTaskResponse,
	CreateTaskVariables,
	Project,
} from "@/app/utils/types";
import CreateProject from "./CreateProject";

const DashboardClient = () => {
	const [isOffline, setIsOffline] = useState(false);

	const { data, loading, error } = useQuery<{ projects: Project[] }>(
		GET_PROJECTS,
	);
	const [analytics, setAnalytics] = useState<AnalyticsObj>({
		totalProjects: 0,
		totalTasks: 0,
		completedTasks: 0,
		completionRate: 0,
	});
	const [titles, setTitles] = useState<Record<string, string>>({});
	const [createTask] = useMutation<CreateTaskResponse, CreateTaskVariables>(
		CREATE_TASK,
	);

	const handleClick = async (id: string) => {
		const title = titles[id]?.trim();

		if (!title) return;
		if (isOffline) {
			await addtoQueue({
				__typename: "Task",
				id: `offline-${Date.now()}`,
				title: title,
				status: "TODO",
			});

			alert("Saved offline. Will sync later.");
			return;
		} else {
			createTask({
				variables: {
					projectId: id,
					title: title,
				},
				optimisticResponse: {
					createTask: {
						__typename: "Task",
						id: `temp-${Date.now()}`,
						title: title,
						status: "TODO",
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

	if (loading) return <main className='p-6'>Loading dashboard...</main>;

	if (error) return <main className='p-6'>Error: {error.message}</main>;

	return (
		<main className='min-h-screen bg-background p-6'>
			<div className='mx-auto max-w-5xl space-y-6'>
				<AnalyticsComponent analytics={analytics} />
				<CreateProject />
				<CardComponent title='Projects'>
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
				</CardComponent>
			</div>
		</main>
	);
};

export default DashboardClient;
