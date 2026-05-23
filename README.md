# Svelte Mono Repo

This is my year-long SvelteKit mastery program, only containing projects that have concepts I am not familar with or have not mastered.

## Tour

1. `01-formsnap-passing-dates`: Mastery of passing dates using formsnap and superforms, using old-school actions for CRUD apps.
2. `02-formsnap-gettingtoknow-inputhidden`: Trying to learn how to get comfortable with input hidden, which I don't use anymore.
3. `03-mastering-monaco`: This isn't as good as I wanted, I don't like setting up editors in Svelte.
4. `04-visualizing-data`: This is a proper CRUD loop in modern Svelte. This IS modern Svelte.
	- it uses purely remote functions EVEN WITH SUPERFORMS, by instead of having a roundtrip for form validation, using the clientside validation and just using remote functions with the payload in an `onUpdate` function. This is around the point of mastery, so more projects USING THESE FUNCTIONS will be made, but nothing atomic like this one. It also masters drizzle.
5. `05-siax-reborn-small`: A rebirth of the SiAX virtual machine platform. I built a VM, bytecode generator, and programming language with Ohm. I used CodeMirror to actually render it with a theme, and have the ability to type live-updating code.
6. `06-tanstack-mastery`: This is a conglomerate experiment of many different tanstack table aspects, built from the ground up, to master tables and all of their quirks. Once this is mastered, I will have infinite power to create any table I want for any data visualizing I want.
7. `07-clis-langs`: This one is a break from the norm. A "deload" of making programming languages like old times to feel important again.
8. `08-polling`: This one is for mastering polling with query.live in SvelteKit interfaces.
9. `09-betterauth`: This one is for mastery of betterauth, managing users, etc, all in a CRUD interface (using remote functions)

## Most Important Takeaways

- **USE REMOTE FUNCTIONS**: They are made for the purpose of RPC. RPC improves the standard "creating hella actions" by creating the remote endpoints and allowing more specific and performant refreshes for queries. `$lib/api/tasks/query.remote.ts` instead of `+page.server.ts`

## Roadmap

- Banking software
  - Requires an `mastery-tanstack` capstone, where i try and build one, or multiple, headless tanstack tables
  - `querylive-mastery` capstone, for using sveltekit remote functions refresh query
  - `authentication-mastery` capstone with betterauth.
  - `layercake-testing` project for learning charts.
- CRM (**FINAL GOAL**)
  - Requires everything there, plus mastering how to interact with user, when to use form and not, using formsnap client PLUS server,
  - using frequent remote functions, understanding how to use enhance, etc. Approaching rapidly.
  - One of these days I will have no choice but to make it
- Redesigning VOLT in an interactive interface, to practice my interfaces in general!
