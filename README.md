This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Dashboard page
↓
GraphQL query: projects
↓
Node.js GraphQL API route
↓
Prisma database
↓
shadcn table/card UI
↓
unit tests

GraphQL
Apollo cache
Optimistic UI
Offline queue
Service Worker
Web Worker
WebSockets
Subscriptions - what exactly did the subscriptions do here,
Before subscriptions:

Client asks server for data
→ one-time response
→ connection ends

After subscriptions:

Client stays connected to server
→ server can push updates anytime
User creates task
      ↓
Server publishes event
      ↓
All connected clients receive update
      ↓
Apollo cache updates automatically
      ↓
UI updates instantly

1. Client subscribes
This code: useSubscription(TASK_CREATED_SUBSCRIPTION) tells Apollo: "Keep listening for new tasks" Unlike queries: query → request once
subscriptions are: persistent connection
2. WebSocket connection opens
This part: GraphQLWsLink(...) creates: Browser ⇄ Server socket connection using:ws://localhost:3000/api/graphql
This connection stays alive.
Why WebSocket?
Normal HTTP: request → response → closed
WebSocket:always-open communication tunnel
Perfect for:
chat
notifications
live dashboards
multiplayer apps
3. Client subscribes to taskCreated
Your schema:
type Subscription {
  taskCreated: Task!
}
means:"There is a live event called taskCreated"
This resolver:
Subscription: {
  taskCreated: {
    subscribe: () =>
      pubsub.asyncIterableIterator([TASK_CREATED]),
  },
},
basically says: "When TASK_CREATED happens, notify all subscribers"
5. Mutation publishes event
This is the most important part:
await pubsub.publish(TASK_CREATED, {
  taskCreated: task,
});
Meaning: "Broadcast this new task to everyone listening"
What is PubSub? Think of PubSub like: Event bus / notification center
Publish pubsub.publish(...) = send event
Subscribe subscribe(...) = listen for event
6. Apollo receives event
This runs: onData: ({ client, data }) => {
Apollo receives:newTask
7. Apollo cache updates
This part: client.cache.modify(...) injects the task directly into cache. No refetch.No reload.No polling.
Real-time sync - 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
