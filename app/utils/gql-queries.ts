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
export const CREATE_TASK = gql`
	mutation CreateTask($projectId: ID!, $title: String!) {
		createTask(projectId: $projectId, title: $title) {
			__typename
			id
			title
			status
		}
	}
`;
export const UPDATE_TASK_STATUS = gql`
	mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
		updateTaskStatus(taskId: $taskId, status: $status) {
			__typename
			id
			status
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
