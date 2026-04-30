import { type Task, type Project } from "@/app/utils/types";
import TaskComponent from "./TaskComponent";

type ProjectComponentProps = {
	project: Project;
	titles: Record<string, string>;
	setTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	handleClick: (id: string) => void;
};
const ProjectComponent = ({
	project,
	handleClick,
	titles,
	setTitles,
}: ProjectComponentProps) => {
	const { id, name, status } = project;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitles((prev) => ({
			...prev,
			[id]: e.target.value,
		}));
	};

	return (
		<div key={project.id} className='rounded-lg border p-4'>
			<div className='font-medium'>{name}</div>

			<div className='text-sm text-muted-foreground'>Status: {status}</div>

			<div className='mt-4 space-y-2'>
				<p className='text-sm font-medium'>Tasks</p>

				{project.tasks.length === 0 ?
					<p className='text-sm text-muted-foreground'>No tasks yet</p>
				:	project.tasks.map((task: Task) => (
						<TaskComponent task={task} key={task.id} project={project} />
					))
				}
			</div>

			<div className='mt-3 flex gap-2'>
				<input
					className='rounded border px-2 py-1 text-sm'
					placeholder='New task...'
					value={titles[id] || ""}
					onChange={handleChange}
				/>

				<button
					className='rounded bg-primary px-3 text-sm text-primary-foreground'
					onClick={() => handleClick(id)}
				>
					Add
				</button>
			</div>
		</div>
	);
};

export default ProjectComponent;
