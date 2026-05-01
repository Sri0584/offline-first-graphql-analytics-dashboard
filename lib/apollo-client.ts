import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
} from "@apollo/client";
import { print } from "graphql";
import { createClient } from "graphql-sse";
import { getMainDefinition } from "@apollo/client/utilities";
// Next.js API routes/route handlers do not support WebSocket upgrades directly. GraphQL Yoga’s recommended subscription transport is SSE, not WebSocket, unless you create a custom Node server.
const httpLink = new HttpLink({
	uri: "/api/graphql",
});
const sseLink = {
	request(operation: any) {
		return {
			subscribe(observer: any) {
				const client = createClient({
					url: "/api/graphql",
				});

				const dispose = client.subscribe(
					{
						query: print(operation.query),
						variables: operation.variables,
					},
					{
						next: (data) => observer.next(data),
						error: (err) => observer.error(err),
						complete: () => observer.complete(),
					},
				);

				return {
					unsubscribe: dispose,
				};
			},
		};
	},
};
const splitLink =
	typeof window !== "undefined" ?
		ApolloLink.split(
			({ query }) => {
				const definition = getMainDefinition(query);

				return (
					definition.kind === "OperationDefinition" &&
					definition.operation === "subscription"
				);
			},
			sseLink as any,
			httpLink,
		)
	:	httpLink;

export const apolloClient = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					projects: {
						merge(_existing, incoming) {
							return incoming;
						},
					},
				},
			},
		},
	}),
});
