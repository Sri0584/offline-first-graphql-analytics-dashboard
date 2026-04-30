import { Project, Task } from "@/app/utils/types";

self.onmessage = (event) => {
	const projects = event.data;

	const totalProjects = projects.length;

	const totalTasks = projects.reduce(
		(acc: number, p: Project) => acc + p.tasks.length,
		0,
	);

	const completedTasks = projects.reduce(
		(acc: number, p: Project) =>
			acc + p.tasks.filter((t: Task) => t.status === "DONE").length,
		0,
	);

	const completionRate =
		totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

	self.postMessage({
		totalProjects,
		totalTasks,
		completedTasks,
		completionRate,
	});
};
