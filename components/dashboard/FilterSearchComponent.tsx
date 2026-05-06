import {
	Dispatch,
	SetStateAction,
	startTransition,
	useEffect,
	useState,
} from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	getOptionLabel,
	ProjectStatusFilter,
	projectStatusOptions,
	TaskStatusFilter,
	taskStatusOptions,
} from "@/app/utils/types";
import { normalizeTaskSearchQuery } from "@/lib/dashboard-utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type FilterSearchComponentProps = {
	projectStatus: ProjectStatusFilter;
	setProjectStatus: Dispatch<SetStateAction<ProjectStatusFilter>>;
	taskStatusFilter: TaskStatusFilter;
	setTaskStatusFilter: Dispatch<SetStateAction<TaskStatusFilter>>;
	taskSearchQuery: string;
	setTaskSearchQuery: Dispatch<SetStateAction<string>>;
	clearFilters: () => void;
	hasActiveFilters: boolean;
};

const FilterSearchComponent = ({
	projectStatus,
	setProjectStatus,
	taskStatusFilter,
	setTaskStatusFilter,
	taskSearchQuery,
	setTaskSearchQuery,
	clearFilters,
	hasActiveFilters,
}: FilterSearchComponentProps) => {
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		if (taskSearchQuery === "") {
			setInputValue("");
		}
	}, [taskSearchQuery]);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			startTransition(() => {
				setTaskSearchQuery(normalizeTaskSearchQuery(inputValue));
			});
		}, 300);

		return () => window.clearTimeout(timeoutId);
	}, [inputValue, setTaskSearchQuery]);

	const handleTaskSelect = (val: string) => {
		startTransition(() => {
			setTaskStatusFilter(val as TaskStatusFilter);
		});
	};
	const handleProjectSelect = (val: string) => {
		startTransition(() => {
			setProjectStatus(val as ProjectStatusFilter);
		});
	};
	return (
		<div className='grid gap-3 rounded-lg border bg-muted/20 p-3 md:grid-cols-3'>
			<label className='space-y-1 text-sm font-medium'>
				<span>Project status</span>
				<Select value={projectStatus} onValueChange={handleProjectSelect}>
					<SelectTrigger>
						<SelectValue>
							{getOptionLabel(projectStatusOptions, projectStatus)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{projectStatusOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</label>
			<label className='space-y-1 text-sm font-medium'>
				<span>Task status</span>
				<Select value={taskStatusFilter} onValueChange={handleTaskSelect}>
					<SelectTrigger>
						<SelectValue>
							{getOptionLabel(taskStatusOptions, taskStatusFilter)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{taskStatusOptions.map((option) => (
							<SelectItem key={option.label} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</label>
			<label className='space-y-1 text-sm font-medium'>
				<span>Search Tasks</span>
				<Input
					className='rounded border px-2 py-1 text-sm'
					placeholder='Search Task...'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
			</label>
			<div className='space-y-1 text-sm font-medium'>
				<span>Filter actions</span>
				<Button
					type='button'
					variant='outline'
					className='h-10 w-full'
					disabled={!hasActiveFilters}
					onClick={clearFilters}
				>
					Clear filters
				</Button>
			</div>
		</div>
	);
};

export default FilterSearchComponent;
