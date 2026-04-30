import { CREATE_PROJECT } from "@/app/utils/gql-queries";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const CreateProject = () => {
	const [projectName, setProjectName] = useState("");
	const [createProject] = useMutation(CREATE_PROJECT, {
		refetchQueries: ["GetProjects"],
	});
	const handleCreateProject = () => {
		if (!projectName.trim()) return;

		createProject({
			variables: {
				name: projectName.trim(),
			},
		});

		setProjectName("");
	};
	return (
		<div className='flex gap-2'>
			<Input
				className='rounded border px-3 py-2'
				placeholder='New project name'
				value={projectName}
				onChange={(e) => setProjectName(e.target.value)}
			/>

			<Button
				className='rounded bg-primary px-4 py-2 text-primary-foreground'
				onClick={handleCreateProject}
			>
				Create Project
			</Button>
		</div>
	);
};

export default CreateProject;
