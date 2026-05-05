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
