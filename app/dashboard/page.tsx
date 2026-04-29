"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_PROJECTS = gql`
	query GetProjects {
		projects {
			id
			name
			status
			createdAt
		}
	}
`;
type Project = {
	id: string;
	name: string;
	status: string;
	createdAt: string;
};

const DashboardPage = () => {
	const { data, loading, error } = useQuery<{ projects: Project[] }>(
		GET_PROJECTS,
	);
	if (loading) return <main className='p-6'>Loading dashboard...</main>;
	if (error) return <main className='p-6'>Error: {error.message}</main>;
	return (
		<main className='min-h-screen bg-background p-6'>
			{" "}
			<div className='mx-auto max-w-5xl space-y-6'>
				{" "}
				<div>
					<h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
					<p className='text-muted-foreground'>
						GraphQL-powered project insights
					</p>
				</div>
			</div>
			<div className='grid gap-4 md:grid-cols-3'>
				<Card>
					<CardHeader>
						<CardTitle>Total Projects</CardTitle>
					</CardHeader>
					<CardContent className='text-3xl font-bold'>
						{data?.projects.length ?? 0}
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Projects</CardTitle>
				</CardHeader>
				<CardContent>
					{" "}
					<div className='space-y-3'>
						{data?.projects.map((project) => (
							<div key={project.id} className='rounded-lg border p-4'>
								<div className='font-medium'>{project.name}</div>
								<div className='text-sm text-muted-foreground'>
									Status: {project.status}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</main>
	);
};

export default DashboardPage;
