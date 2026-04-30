import { Task } from "@/app/utils/types";
import { getDB } from "./offline-db";

export const addtoQueue = async (task: Task) => {
	const db = await getDB();
	await db.put("tasks", task);
};

export async function getQueue() {
	const db = await getDB();
	return db.getAll("tasks");
}

export async function clearQueue() {
	const db = await getDB();
	await db.clear("tasks");
}
