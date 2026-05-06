import { gql } from "@apollo/client";
// Added projectId and clientMutationId to task selections, including the taskCreated subscription,
// so tab 2 receives enough data to normalize and deduplicate the created task in Apollo cache.
export const TASK_FRAGMENT = gql`
	fragment CachedTask on Task {
		__typename
		id
		title
		status
		projectId
		clientMutationId
	}
`;

export const PROJECT_FRAGMENT = gql`
	fragment CachedProject on Project {
		__typename
		id
		name
		status
		tasks {
			...CachedTask
		}
	}
	${TASK_FRAGMENT}
`;

export const GET_PROJECTS = gql`
	query GetProjects {
		projects {
			...CachedProject
		}
	}
	${PROJECT_FRAGMENT}
`;
export const CREATE_PROJECT = gql`
	mutation CreateProject($name: String!) {
		createProject(name: $name) {
			...CachedProject
		}
	}
	${PROJECT_FRAGMENT}
`;

export const UPDATE_PROJECT_NAME = gql`
	mutation UpdateProjectName($projectId: ID!, $name: String!) {
		updateProjectName(projectId: $projectId, name: $name) {
			...CachedProject
		}
	}
	${PROJECT_FRAGMENT}
`;

export const UPDATE_PROJECT_STATUS = gql`
	mutation UpdateProjectStatus($projectId: ID!, $status: String!) {
		updateProjectStatus(projectId: $projectId, status: $status) {
			...CachedProject
		}
	}
	${PROJECT_FRAGMENT}
`;

export const DELETE_PROJECT = gql`
	mutation DeleteProject($projectId: ID!) {
		deleteProject(projectId: $projectId) {
			__typename
			id
		}
	}
`;
export const CREATE_TASK = gql`
	mutation CreateTask(
		$projectId: ID!
		$title: String!
		$clientMutationId: String
	) {
		createTask(
			projectId: $projectId
			title: $title
			clientMutationId: $clientMutationId
		) {
			...CachedTask
		}
	}
	${TASK_FRAGMENT}
`;
export const UPDATE_TASK_STATUS = gql`
	mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
		updateTaskStatus(taskId: $taskId, status: $status) {
			...CachedTask
		}
	}
	${TASK_FRAGMENT}
`;
export const DELETE_TASK = gql`
	mutation deleteTask($taskId: ID!) {
		deleteTask(taskId: $taskId) {
			__typename
			id
		}
	}
`;

export const TASK_CREATED_SUBSCRIPTION = gql`
	subscription TaskCreated {
		taskCreated {
			...CachedTask
		}
	}
	${TASK_FRAGMENT}
`;
