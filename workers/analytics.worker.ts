import { calculateAnalytics } from "@/lib/dashboard-utils";
import type { Project } from "@/app/utils/types";

self.onmessage = (event: MessageEvent<Project[]>) => {
	self.postMessage(calculateAnalytics(event.data));
};
