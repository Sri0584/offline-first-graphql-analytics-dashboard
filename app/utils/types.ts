export type Task = {
	__typename: "Task";
	id: string;
	title: string;
	status: TaskStatus;
	projectId: string;
	clientMutationId?: string | null;
};

export type Project = {
	__typename: "Project";
	id: string;
	name: string;
	status: string;
	tasks: Task[];
};
export type CreateTaskResponse = {
	createTask: Task;
};

export type TaskCreatedSubscriptionResponse = {
	taskCreated: Task;
};

export type CreateTaskVariables = {
	projectId: string;
	title: string;
	clientMutationId?: string | null;
};

export type AnalyticsObj = {
	totalProjects: number;
	totalTasks: number;
	todoTasks: number;
	inProgressTasks: number;
	completedTasks: number;
	completionRate: number;
};
export type CreateProjectResponse = {
	createProject: Project;
};

export type CreateProjectVariables = {
	name: string;
};

export type UpdateProjectNameResponse = {
	updateProjectName: Project;
};

export type UpdateProjectNameVariables = {
	projectId: string;
	name: string;
};

export type UpdateProjectStatusResponse = {
	updateProjectStatus: Project;
};

export type UpdateProjectStatusVariables = {
	projectId: string;
	status: string;
};

export type DeleteProjectResponse = {
	deleteProject: {
		__typename: "Project";
		id: string;
	};
};

export type DeleteProjectVariables = {
	projectId: string;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type CreateProjectArgs = {
	name: string;
};

export type UpdateTaskStatusArgs = {
	taskId: string;
	status: string;
};

export type CreateTaskArgs = {
	projectId: string;
	title: string;
	clientMutationId?: string | null;
};

export type ProjectStatusFilter = "ALL" | "ACTIVE" | "ARCHIVED";

export type TaskStatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "DONE";

export const projectStatusOptions: {
	label: string;
	value: ProjectStatusFilter;
}[] = [
	{ label: "All projects", value: "ALL" },
	{ label: "Active", value: "ACTIVE" },
	{ label: "Archived", value: "ARCHIVED" },
];

export const taskStatusOptions: { label: string; value: TaskStatusFilter }[] = [
	{ label: "All tasks", value: "ALL" },
	{ label: "To do", value: "TODO" },
	{ label: "In progress", value: "IN_PROGRESS" },
	{ label: "Done", value: "DONE" },
];

export const getOptionLabel = <T extends string>(
	options: { label: string; value: T }[],
	value: T,
) => options.find((option) => option.value === value)?.label ?? value;

export type LoginPageProps = {
	searchParams: Promise<{
		email?: string | string[];
	}>;
};
