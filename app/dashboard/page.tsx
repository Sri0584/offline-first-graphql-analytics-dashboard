"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gql } from "@apollo/client/core";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

const GET_PROJECTS = gql`
	query GetProjects {
		projects {
			id
			name
			status
			tasks {
				id
				title
				status
			}
		}
	}
`;
const CREATE_TASK = gql`
	mutation CreateTask($projectId: ID!, $title: String!) {
		createTask(projectId: $projectId, title: $title) {
			id
			title
			status
		}
	}
`;
const UPDATE_TASK_STATUS = gql`
	mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
		updateTaskStatus(taskId: $taskId, status: $status) {
			id
			status
		}
	}
`;
const DELETE_TASK = gql`
	mutation deleteTask($taskId: ID!) {
		deleteTask(taskId: $taskId) {
			id
		}
	}
`;
type Task = {
	id: string;
	title: string;
	status: string;
};

type Project = {
	id: string;
	name: string;
	status: string;
	tasks: Task[];
};

const DashboardPage = () => {
	const { data, loading, error } = useQuery<{ projects: Project[] }>(
		GET_PROJECTS,
	);
	const [titles, setTitles] = useState<Record<string, string>>({});

	const [createTask] = useMutation(CREATE_TASK, {
		refetchQueries: ["GetProjects"],
	});
	const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
		refetchQueries: ["GetProjects"],
	});
	const [deleteTask] = useMutation(DELETE_TASK, {
		refetchQueries: ["GetProjects"],
	});
	const handleClick = (id: string) => {
		const title = titles[id];

		if (!title?.trim()) return;

		createTask({
			variables: {
				projectId: id,
				title: title.trim(),
			},
		});

		setTitles((prev) => ({
			...prev,
			[id]: "",
		}));
	};
	if (loading) return <main className='p-6'>Loading dashboard...</main>;
	if (error) return <main className='p-6'>Error: {error.message}</main>;
	return (
		<main className='min-h-screen bg-background p-6'>
			<div className='mx-auto max-w-5xl space-y-6'>
				<div>
					<h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
					<p className='text-muted-foreground'>
						GraphQL-powered project insights
					</p>
				</div>

				<div className='grid gap-4 md:grid-cols-3'>
					<Card>
						<CardHeader>
							<CardTitle>Total Projects</CardTitle>
						</CardHeader>
						<CardContent className='text-3xl font-bold'>
							{data?.projects.length ?? 0}
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{data?.projects.map((project) => (
								<div key={project.id} className='rounded-lg border p-4'>
									<div className='font-medium'>{project.name}</div>

									<div className='text-sm text-muted-foreground'>
										Status: {project.status}
									</div>

									<div className='mt-4 space-y-2'>
										<p className='text-sm font-medium'>Tasks</p>

										{project.tasks.length === 0 ?
											<p className='text-sm text-muted-foreground'>
												No tasks yet
											</p>
										:	project.tasks.map((task) => (
												<div
													key={task.id}
													className='rounded-md border p-2 text-sm flex justify-between'
												>
													<div>
														<span
															className={
																task.status === "DONE" ?
																	"line-through text-muted-foreground"
																:	""
															}
														>
															{task.title}
														</span>
													</div>
													<div className='flex justify-between gap-1'>
														<button
															className='text-xs bg-secondary px-2 py-1 rounded'
															onClick={() => {
																updateTaskStatus({
																	variables: {
																		taskId: task.id,
																		status:
																			task.status === "DONE" ? "TODO" : "DONE",
																	},
																});
															}}
														>
															{task.status === "DONE" ? "Undo" : "Done"}
														</button>
														<button
															className='rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground'
															onClick={() => {
																deleteTask({
																	variables: {
																		taskId: task.id,
																	},
																});
															}}
														>
															Delete
														</button>
													</div>
												</div>
											))
										}
									</div>

									<div className='mt-3 flex gap-2'>
										<input
											className='rounded border px-2 py-1 text-sm'
											placeholder='New task...'
											value={titles[project.id] || ""}
											onChange={(e) =>
												setTitles((prev) => ({
													...prev,
													[project.id]: e.target.value,
												}))
											}
										/>

										<button
											className='rounded bg-primary px-3 text-sm text-primary-foreground'
											onClick={() => handleClick(project.id)}
										>
											Add
										</button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};

export default DashboardPage;
