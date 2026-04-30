export type Task = {
	__typename: "Task";
	id: string;
	title: string;
	status: string;
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

export type CreateTaskVariables = {
	projectId: string;
	title: string;
};

export type AnalyticsObj = {
	totalProjects: number;
	totalTasks: number;
	completedTasks: number;
	completionRate: number;
};
