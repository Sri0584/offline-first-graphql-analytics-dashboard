import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
	query GetProjects {
		projects {
			__typename
			id
			name
			status
			tasks {
				__typename
				id
				title
				status
			}
		}
	}
`;
export const CREATE_PROJECT = gql`
	mutation CreateProject($name: String!) {
		createProject(name: $name) {
			__typename
			id
			name
			status
			tasks {
				__typename
				id
				title
				status
			}
		}
	}
`;

export const UPDATE_PROJECT_NAME = gql`
	mutation UpdateProjectName($projectId: ID!, $name: String!) {
		updateProjectName(projectId: $projectId, name: $name) {
			__typename
			id
			name
			status
			tasks {
				__typename
				id
				title
				status
			}
		}
	}
`;

export const UPDATE_PROJECT_STATUS = gql`
	mutation UpdateProjectStatus($projectId: ID!, $status: String!) {
		updateProjectStatus(projectId: $projectId, status: $status) {
			__typename
			id
			name
			status
			tasks {
				__typename
				id
				title
				status
			}
		}
	}
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
	mutation CreateTask($projectId: ID!, $title: String!) {
		createTask(projectId: $projectId, title: $title) {
			__typename
			id
			title
			status
			projectId
		}
	}
`;
export const UPDATE_TASK_STATUS = gql`
	mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
		updateTaskStatus(taskId: $taskId, status: $status) {
			__typename
			id
			title
			status
			projectId
		}
	}
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
			__typename
			id
			title
			status
			projectId
		}
	}
`;
