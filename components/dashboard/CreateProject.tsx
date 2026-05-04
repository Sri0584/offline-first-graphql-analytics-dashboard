import { CREATE_PROJECT } from "@/app/utils/gql-queries";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { gql } from "@apollo/client";
import {
	CreateProjectResponse,
	CreateProjectVariables,
} from "@/app/utils/types";
import { toast } from "sonner";

const CreateProject = () => {
	const [projectName, setProjectName] = useState("");
	const [createProject] = useMutation<
		CreateProjectResponse,
		CreateProjectVariables
	>(CREATE_PROJECT);

	const handleCreateProject = () => {
		const name = projectName.trim();
		if (!name) return;
		try {
			createProject({
				variables: {
					name,
				},
				optimisticResponse: {
					createProject: {
						__typename: "Project",
						id: `temp-project-${Date.now()}`,
						name,
						status: "ACTIVE",
						tasks: [],
					},
				},
				update(cache, { data }) {
					const newProject = data?.createProject;
					if (!newProject) return;

					cache.modify({
						fields: {
							projects(existingProjectRefs = []) {
								const newProjectRef = cache.writeFragment({
									data: newProject,
									fragment: gql`
										fragment NewProject on Project {
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
									`,
								});

								return [newProjectRef, ...existingProjectRefs];
							},
						},
					});
				},
			});
			toast.success("Project created successfully!");
		} catch (error) {
			toast.error(`Project creation failed ${error}`);
		}

		setProjectName("");
	};

	return (
		<>
			<p className='text-sm font-medium'>Create Project</p>
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
					Create
				</Button>
			</div>
		</>
	);
};

export default CreateProject;
