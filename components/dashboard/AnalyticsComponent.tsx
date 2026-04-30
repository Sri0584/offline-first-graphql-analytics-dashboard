import React from "react";
import CardComponent from "./CardComponent";
import { AnalyticsObj } from "@/app/utils/types";

const AnalyticsComponent = ({ analytics }: { analytics: AnalyticsObj }) => {
	return (
		<>
			<div>
				<h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
				<p className='text-muted-foreground'>
					GraphQL-powered project insights
				</p>
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
		</>
	);
};

export default AnalyticsComponent;
