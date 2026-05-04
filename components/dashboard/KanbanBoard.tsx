import { Project, Task, TaskStatus } from "@/app/utils/types";
import {
	DndContext,
	DragEndEvent,
	useDraggable,
	useDroppable,
} from "@dnd-kit/core";

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
type KanbanBoardProps = {
	projects: Project[];
	onMoveTask: (
		task: Task & { projectName: string },
		status: TaskStatus,
	) => void;
};
const KanbanBoard = ({ projects, onMoveTask }: KanbanBoardProps) => {
	const tasks = projects.flatMap((project) =>
		project.tasks.map((task) => ({
			...task,
			projectName: project.name,
		})),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const taskId = String(event.active.id);
		const nextStatus = event.over?.id as TaskStatus | undefined;
		if (!nextStatus) return;
		if (!columns.includes(nextStatus)) return;
		const task = tasks.find((task) => task.id === taskId);
		if (!task || task.status === nextStatus) return;
		onMoveTask(task, nextStatus);
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className='grid gap-4 md:grid-cols-3'>
				{columns.map((status) => (
					<KanbanColumn
						key={status}
						status={status}
						tasks={tasks.filter((task) => task.status === status)}
					/>
				))}
			</div>
		</DndContext>
	);
};

const KanbanColumn = ({
	status,
	tasks,
}: {
	status: TaskStatus;
	tasks: Array<Task & { projectName: string }>;
}) => {
	const { setNodeRef, isOver } = useDroppable({
		id: status,
	});
	return (
		<div
			ref={setNodeRef}
			className={`min-h-72 rounded-lg border p-4 ${
				isOver ? "bg-muted" : "bg-background"
			}`}
		>
			<div className='mb-4 flex items-center justify-between'>
				<h3 className='font-semibold'>{formatStatus(status)}</h3>
				<span className='rounded-full border px-2 py-0.5 text-xs'>
					{tasks.length}
				</span>
			</div>
			<div className='space-y-3'>
				{tasks.map((task) => (
					<KanbanTask key={task.id} task={task} />
				))}
			</div>
		</div>
	);
};
const formatStatus = (status: TaskStatus) => {
	return status.replace("_", " ");
};

const KanbanTask = ({ task }: { task: Task & { projectName: string } }) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: task.id,
		});
	const style =
		transform ?
			{
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		:	undefined;
	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`cursor-grab rounded-lg border bg-card p-3 shadow-sm ${
				isDragging ? "opacity-50" : ""
			}`}
		>
			<p className='text-sm font-medium'>{task.title}</p>
			<p className='mt-1 text-xs text-muted-foreground'>{task.projectName}</p>
		</div>
	);
};

export default KanbanBoard;
