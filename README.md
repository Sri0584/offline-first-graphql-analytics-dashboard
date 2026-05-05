https://main.d2571517qali19.amplifyapp.com/dashboard

prisma commands
npx prisma migrate reset - 
This will:
drop all tables
recreate schema
rerun migrations
regenerate Prisma client

px prisma migrate dev --name add-task-client-mutation-id - Add field to Prisma Task

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
Frontend:

Next.js App Router
React Server Components
TypeScript
Tailwind CSS
shadcn/ui
Apollo Client or urql
Service Worker for offline cache + background sync
Web Worker for heavy analytics/chart calculations
React concurrent features: Suspense, useTransition, useDeferredValue

Backend:

Node.js
GraphQL Yoga or Apollo Server
Prisma
PostgreSQL or DynamoDB
JWT/Auth.js/Cognito
Redis optional for caching/rate limits
Auth + organizations
Login/signup
Teams/workspaces
Role-based access: owner, admin, member
Project/task management
CRUD projects/tasks
GraphQL queries, mutations, pagination, filtering
Optimistic updates
Realtime activity feed
GraphQL subscriptions or polling fallback
Activity logs: task created, status changed, comment added
Offline-first mode
Service Worker caches shell + recent GraphQL responses
Offline task creation saved to IndexedDB
Sync queue when back online
Analytics dashboard
Charts for completion rate, cycle time, workload
Web Worker computes heavy aggregations
Export CSV/PDF
React performance showcase
Server Components for dashboard shell/data-heavy pages
Client Components only where interactive
Suspense loading boundaries
useTransition for filters/search
useDeferredValue for large list search

AWS free/low-cost deployment:

Amplify Hosting for frontend
Lambda for GraphQL API
API Gateway
DynamoDB or RDS free-tier-compatible option
S3 for file exports
CloudWatch + AWS Budgets

GraphQL
Apollo cache
Optimistic UI
Offline queue
Service Worker
Web Worker
Server-Sent Events (SSE) with GraphQL Yoga and Apollo Client

Subscriptions - what exactly did the subscriptions do here,
Client subscribes to live updates
Using:
useSubscription(TASK_CREATED_SUBSCRIPTION)

the client establishes a persistent subscription with Apollo Client to continuously listen for newly created tasks in real time, instead of performing a one-time data fetch like a traditional GraphQL query.

Persistent real-time connection using SSE
The application uses Server-Sent Events (SSE) with GraphQL Yoga and Apollo Client to maintain a continuous client-server connection for real-time event streaming.

Unlike standard HTTP request-response cycles:

HTTP → request → response → connection closed

SSE enables:

Server → continuous event stream → connected client

This architecture is ideal for:

live dashboards
notifications
collaborative applications
activity feeds
real-time analytics
GraphQL subscription schema definition
The GraphQL schema exposes a live subscription endpoint:
type Subscription {
  taskCreated: Task!
}

This defines a real-time event channel that clients can subscribe to in order to receive newly created task data instantly.

Subscription resolver registration
The subscription resolver connects incoming subscribers to the PubSub event stream:
Subscription: {
  taskCreated: {
    subscribe: () =>
      pubsub.asyncIterableIterator([TASK_CREATED]),
  },
},

This tells the GraphQL server to notify all active subscribers whenever a TASK_CREATED event is published.

Publishing real-time events
When a task is created, the mutation publishes an event through the PubSub system:
await pubsub.publish(TASK_CREATED, {
  taskCreated: task,
});

This broadcasts the newly created task to all connected clients subscribed to the taskCreated event stream.

PubSub event-driven architecture
The PubSub layer acts as an internal event bus for real-time communication:
publish(...) → emit event
subscribe(...) → listen for event

This decouples mutation execution from real-time delivery logic and enables scalable event-driven updates.

Apollo Client receives live updates
On the frontend, the subscription listener receives incoming task events through:
onData: ({ client, data }) => {

Apollo Client immediately processes the streamed subscription payload without requiring additional API requests.

Normalized Apollo cache synchronization
The application updates the Apollo normalized cache directly using:
client.cache.modify(...)

This injects the incoming task into the existing cached project state, enabling:

instant UI synchronization
zero refetching
no manual reloads
no polling overhead

As a result, multiple connected clients remain synchronized in real time with minimal network cost.
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
