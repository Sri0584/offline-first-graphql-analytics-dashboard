import {
	DELETE_PROJECT,
	UPDATE_PROJECT_NAME,
	UPDATE_PROJECT_STATUS,
} from "@/app/utils/gql-queries";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ProjectCRUD = ({
	id,
	status,
	name,
}: {
	id: string;
	status: string;
	name: string;
}) => {
	const [editingProjectId, setEditingProjectId] = useState<string | null>("");
	const [editProjectName, setEditProjectName] = useState(name);
	const [updateProjectName] = useMutation(UPDATE_PROJECT_NAME, {
		refetchQueries: ["GetProjects"],
	});
	const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS, {
		refetchQueries: ["GetProjects"],
	});
	const [deleteProject] = useMutation(DELETE_PROJECT, {
		refetchQueries: ["GetProjects"],
	});

	const handleUpdateProject = () => {
		updateProjectStatus({
			variables: {
				projectId: id,
				status: status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED",
			},
		});
	};

	const handleDeleteProject = () => {
		deleteProject({
			variables: {
				projectId: id,
			},
		});
	};
	const handleSave = () => {
		updateProjectName({
			variables: {
				projectId: id,
				name: editProjectName.trim(),
			},
		});

		setEditingProjectId(null);
	};

	const handleRename = () => {
		setEditingProjectId(id);
		setEditProjectName(name);
	};
	return (
		<>
			<div className='font-medium'>{name}</div>
			{editingProjectId === id ?
				<div className='flex gap-2'>
					<Input
						className='rounded border px-2 py-1'
						value={editProjectName}
						onChange={(e) => setEditProjectName(e.target.value)}
					/>

					<button
						className='rounded bg-primary px-3 text-sm text-primary-foreground'
						onClick={handleSave}
					>
						Save
					</button>
				</div>
			:	<div className='flex items-center gap-2'>
					<span>{name}</span>
					<button
						className='rounded bg-primary px-3 text-sm text-primary-foreground'
						onClick={handleRename}
					>
						Rename
					</button>
				</div>
			}
			<div className='text-sm text-muted-foreground'>Status: {status}</div>
			<Button
				className='rounded border px-3 py-1 text-sm'
				onClick={handleUpdateProject}
			>
				{status === "ARCHIVED" ? "Restore" : "Archive"}
			</Button>
			<Button
				className='rounded bg-destructive px-3 py-1 text-sm text-destructive-foreground'
				onClick={handleDeleteProject}
			>
				Delete
			</Button>
		</>
	);
};

export default ProjectCRUD;
