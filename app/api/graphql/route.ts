import { CreateTaskArgs, UpdateTaskStatusArgs } from "@/app/utils/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pubsub, TASK_CREATED } from "@/lib/subpub";
import { createSchema, createYoga } from "graphql-yoga";
import { getServerSession, Session } from "next-auth";

export type GraphQLContext = {
	session: Session | null;
};
const typeDefs = /* GraphQL */ `
	type Project {
		id: ID!
		name: String!
		status: String!
		createdAt: String!
		tasks: [Task!]!
	}

	type Task {
		id: ID!
		title: String!
		status: String!
		createdAt: String!
		projectId: ID!
	}

	type Query {
		projects: [Project!]!
		project(id: ID!): Project
	}

	type Mutation {
		createProject(name: String!): Project!
		updateProjectName(projectId: ID!, name: String!): Project!
		updateProjectStatus(projectId: ID!, status: String!): Project!
		deleteProject(projectId: ID!): Project!
		createTask(projectId: ID!, title: String!): Task!
		updateTaskStatus(taskId: ID!, status: String!): Task!
		deleteTask(taskId: ID!): Task!
	}
	type Subscription {
		taskCreated: Task!
	}
`;

const resolvers = {
	Query: {
		projects: async (_: unknown, __: unknown, context: GraphQLContext) => {
			//When you log in, the browser stores an auth cookie.Every request to /api/graphql automatically includes that cookie.
			//Then on the server:const session = await getServerSession(authOptions);gets the logged-in user from the cookie.
			const userId = context.session?.user?.id;

			if (!userId) throw new Error("Unauthorized");
			return prisma.project.findMany({
				where: {
					userId: userId,
				},
				include: {
					tasks: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
		project: async (
			_: unknown,
			args: { id: string },
			context: GraphQLContext,
		) => {
			const userId = context.session?.user?.id;
			if (!userId) throw new Error("Unauthorized");
			return prisma.project.findFirst({
				where: {
					id: args.id,
					userId,
				},
				include: {
					tasks: true,
				},
			});
		},
	},
	Subscription: {
		taskCreated: {
			subscribe: () => pubsub.asyncIterableIterator([TASK_CREATED]),
		},
	},
	Mutation: {
		createProject: async (
			_: unknown,
			args: { name: string },
			context: GraphQLContext,
		) => {
			const userId = context.session?.user?.id;

			if (!userId) {
				throw new Error("Unauthorized");
			}
			return prisma.project.create({
				data: {
					name: args.name,
					userId,
				},
				include: {
					tasks: true,
				},
			});
		},
		updateProjectName: async (
			_: unknown,
			args: { projectId: string; name: string },
		) => {
			return prisma.project.update({
				where: { id: args.projectId },
				data: { name: args.name },
				include: { tasks: true },
			});
		},

		updateProjectStatus: async (
			_: unknown,
			args: { projectId: string; status: string },
		) => {
			return prisma.project.update({
				where: { id: args.projectId },
				data: { status: args.status },
				include: { tasks: true },
			});
		},

		deleteProject: async (_: unknown, args: { projectId: string }) => {
			return prisma.project.delete({
				where: { id: args.projectId },
				include: { tasks: true },
			});
		},
		createTask: async (_: unknown, args: CreateTaskArgs) => {
			const task = await prisma.task.create({
				data: {
					title: args.title,
					projectId: args.projectId,
					status: "TODO",
				},
			});

			await pubsub.publish(TASK_CREATED, {
				taskCreated: task,
			});

			return task;
		},
		updateTaskStatus: async (_: unknown, args: UpdateTaskStatusArgs) => {
			return prisma.task.update({
				where: { id: args.taskId },
				data: { status: args.status },
			});
		},
		deleteTask: async (_: unknown, args: { taskId: string }) => {
			return prisma.task.delete({
				where: { id: args.taskId },
			});
		},
	},
};
const yoga = createYoga({
	schema: createSchema({
		typeDefs,
		resolvers,
	}),
	context: async ({ request }) => {
		const session = await getServerSession(authOptions);

		return {
			session,
		};
	},
	graphqlEndpoint: "/api/graphql",
});
export { yoga as GET, yoga as POST };
