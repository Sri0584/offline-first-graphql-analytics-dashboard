import { createSchema, createYoga } from "graphql-yoga";

const typeDefs = /* GraphQL */ `
	type Project {
		id: ID!
		name: String!
		status: String!
		createdAt: String!
	}

	type Query {
		projects: [Project!]!
	}
`;

const projects = [
	{
		id: "1",
		name: "Portfolio Analytics Platform",
		status: "ACTIVE",
		createdAt: new Date().toISOString(),
	},
];
const resolvers = {
	Query: {
		projects: () => projects,
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
