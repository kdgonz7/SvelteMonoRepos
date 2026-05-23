# 04-visualizing-data

Includes a basic task table where you can create tasks, view, and delete them.

## What did this teach me?

- This helped me master the concept of seeing your data from a Drizzle ORM database
  - Remote functions, learning about where they stand
  - Using superforms and formsnap CLIENTSIDE ONLY using SPA: true, getting familiar with adapters and where forms actually live
  - Not using server actions for everything, instead using remote functions that create the endpoints automatically
  - Serializing inputs and using drizzle's generated $inferSelect types to have type safety across TanStack, as well as my remote functions.
  - Database queries like accessing information, refreshing queries, etc.
    - This should have been mastered, but wasn't until now so I'm happy.

## What can I use these skills for?

- Building finance apps
- Finance games even (rewriting finta ith remote functions coming soon???)
- Building CRMs (learning that basic data structuring and remote function RPC)
- Task apps, user-oriented information viewing
