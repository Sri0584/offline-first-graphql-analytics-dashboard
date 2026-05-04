import { AnalyticsObj, Project } from "@/app/utils/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import React, { lazy, Suspense } from "react";

const ChartsComponent = lazy(() => import("./ChartsComponent"));
const CardComponent = React.lazy(
	() => import("@/components/dashboard/CardComponent"),
);
const AnalyticsComponent = ({
	analytics,
	projects,
}: {
	analytics: AnalyticsObj;
	projects: Project[];
}) => {
	const router = useRouter();

	const handleSignout = () => {
		router.push("/login");
	};

	return (
		<>
			<div className='flex justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
					<p className='text-muted-foreground'>
						GraphQL-powered project insights
					</p>
				</div>
				<Button onClick={handleSignout}>Sign Out</Button>
			</div>

			<div className='grid gap-3 md:grid-cols-4'>
				<CardComponent
					title='Total Projects'
					contentClassName='text-3xl font-bold'
				>
					{analytics.totalProjects}
				</CardComponent>
				<CardComponent
					title='Total Tasks'
					contentClassName='text-3xl font-bold'
				>
					{analytics.totalTasks}
				</CardComponent>
				<CardComponent
					title='Completed Tasks'
					contentClassName='text-3xl font-bold'
				>
					{analytics.completedTasks}
				</CardComponent>
				<CardComponent
					title='Completion %'
					contentClassName='text-3xl font-bold'
				>
					{analytics.completionRate}
				</CardComponent>
			</div>
			<Suspense fallback={<div>Loading Charts Component..</div>}>
				<ChartsComponent analytics={analytics} projects={projects} />
			</Suspense>
		</>
	);
};

export default AnalyticsComponent;
