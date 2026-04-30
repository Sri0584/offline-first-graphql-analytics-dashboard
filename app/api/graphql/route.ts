import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSchema, createYoga } from "graphql-yoga";
import { getServerSession } from "next-auth";

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
`;

const resolvers = {
	Query: {
		projects: async () => {
			return prisma.project.findMany({
				include: {
					tasks: true,
					user: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
		project: async (_: any, args: { id: string }) => {
			return prisma.project.findUnique({
				where: { id: args.id },
				include: { tasks: true },
			});
		},
	},
	Mutation: {
		createProject: async (_: unknown, args: { name: string }, context: any) => {
			const userId = context.session?.user?.id;
			console.log(userId, "userId");

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
		createTask: async (_: any, args: { projectId: string; title: string }) => {
			return prisma.task.create({
				data: {
					title: args.title,
					projectId: args.projectId,
				},
			});
		},
		updateTaskStatus: async (
			_: any,
			args: { taskId: string; status: string },
		) => {
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
