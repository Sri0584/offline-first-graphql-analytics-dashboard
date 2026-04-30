import { DELETE_TASK, UPDATE_TASK_STATUS } from "@/app/utils/gql-queries";
import { type Task } from "@/app/utils/types";
import type { Reference } from "@apollo/client/cache";
import { useMutation } from "@apollo/client/react";
import { Button } from "../ui/button";

type TaskComponentProps = {
	task: Task;
	projectId: string;
};
const TaskComponent = ({ task, projectId }: TaskComponentProps) => {
	const { id, status, title } = task;

	const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
	const [deleteTask] = useMutation(DELETE_TASK);
	const nextStatus = status === "DONE" ? "TODO" : "DONE";
	return (
		<>
			<div
				key={id}
				className='rounded-md border p-2 text-sm flex justify-between'
			>
				<div>
					<span
						className={
							status === "DONE" ? "line-through text-muted-foreground" : ""
						}
					>
						{title}
					</span>
				</div>
				<div className='flex justify-between gap-1'>
					<Button
						className='text-xs bg-secondary px-2 py-1 rounded text-black'
						onClick={() => {
							updateTaskStatus({
								variables: {
									taskId: id,
									status: nextStatus,
								},
								optimisticResponse: {
									updateTaskStatus: {
										__typename: "Task",
										id: id,
										status: nextStatus,
									},
								},
							});
						}}
					>
						{status === "DONE" ? "Undo" : "Done"}
					</Button>
					<Button
						className='rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground'
						onClick={() => {
							deleteTask({
								variables: {
									taskId: id,
								},
								optimisticResponse: {
									deleteTask: {
										__typename: "Task",
										id: id,
									},
								},
								update(cache) {
									cache.modify({
										id: cache.identify({
											__typename: "Project",
											id: projectId,
										}),
										fields: {
											tasks(
												existingTaskRefs: readonly Reference[] = [],
												{ readField },
											) {
												return existingTaskRefs.filter(
													(taskRef) => readField("id", taskRef) !== id,
												);
											},
										},
									});
								},
							});
						}}
					>
						Delete
					</Button>
				</div>
			</div>
		</>
	);
};

export default TaskComponent;
