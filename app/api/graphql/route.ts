import { prisma } from "@/lib/prisma";
import { createSchema, createYoga } from "graphql-yoga";

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
		createTask(projectId: ID!, title: String!): Task!
		updateTaskStatus(taskId: ID!, status: String!): Task!
		deleteTask(taskId: ID!): Task!
	}
`;

const resolvers = {
	Query: {
		projects: async () => {
			return prisma.project.findMany({
				orderBy: { createdAt: "desc" },
				include: { tasks: true },
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
		createProject: async (_: unknown, args: { name: string }) => {
			return prisma.project.create({
				data: {
					name: args.name,
				},
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
	graphqlEndpoint: "/api/graphql",
});
export { yoga as GET, yoga as POST };
