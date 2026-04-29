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
	}

	type Mutation {
		createProject(name: String!): Project!
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
