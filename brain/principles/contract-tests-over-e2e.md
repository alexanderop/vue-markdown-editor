# Contract Tests Over E2E at Service Boundaries

For any system with more than one deployable, default to **contract testing at the boundary** rather than booting the full graph for an end-to-end run. E2E is only a tiebreaker for flows that genuinely cross trust/transport boundaries no contract can describe.

**Why:** Cost scales differently. Verifying a contract is independent of system size — you only need the two sides of the wire. An E2E run pays for every node in the graph plus an orchestrator. As nodes and edges grow, E2E becomes quadratic in compute, setup, and debug surface; contract testing stays linear in the connections that actually changed. You also get roughly 2× the test fixtures per dollar because consumer and provider each get their own check.

The intuition (from Elliott Murray's Pact analysis):

- **Contract test cost per fixture:** constant. Adding an edge is `+1`.
- **E2E test cost per fixture:** `N + 1` (every node plus the orchestrator). Adding a node penalizes every existing test.
- **On a delta:** contract testing only touches the changed node and its direct collaborators (`1 + E_i`). E2E batching doesn't actually lower cost-per-test — it just shifts it onto rebalancing and overlap.

## How to apply

1. **Define the boundary as a contract first.** Before writing a test that boots two services, ask whether a request/response schema + examples would catch the same break. If yes, that's the test.
2. **Pair every consumer with a provider verification.** The contract is the shared artefact; each side runs in its own process under its own CI job. No shared environment.
3. **Test deltas, not the world.** On a change to node `i`, verify only `i` and its direct edges. Resist the pull to "just run everything to be safe" — that's the E2E cost curve sneaking back in.
4. **Reserve E2E for things contracts can't express.** Auth handshakes that span redirects, payment flows with third-party state, full-page user journeys. Keep the suite small and treat it as a smoke layer, not a correctness layer.
5. **Expect debugging cost to track the same curve.** A failing contract test localises to one wire. A failing E2E run requires walking every node in the path. Budget time accordingly.

## When this bites in this repo

Today the project is mostly one app, so the principle is dormant — but it activates the moment we add a worker, an extension host, a sync server, or a plugin protocol. At that point:

- Each new service entry-point should ship with a contract definition before it ships with an E2E spec.
- Component tests stay in Vitest Browser Mode ([[principles/vitest-browser-vs-playwright]]); the contract layer sits between component tests and the thin Playwright smoke layer.

## Anti-patterns

- **"We'll just spin up the whole system in CI."** Works at 2 services, collapses at 6. By the time you feel the pain, the test suite is the thing blocking deploys.
- **Batching E2E to make the bill smaller.** Reduces compute per change but not cost-per-fixture; you pay it back in overlap, redundancy, and non-deterministic coverage when batches drift.
- **Treating Pact (or equivalent) as "more E2E."** It's not — it never boots both sides together. If your contract test stands up the provider _and_ the consumer in one process, it's an integration test wearing a contract hat.
- **Contract-testing internal function calls.** Contracts are for process boundaries (HTTP, queues, RPC). Inside a single deployable, just write integration tests.

Source: Elliott Murray, _Proving E2E Tests Are a Scam_ (Pactflow blog, updated 2021-03-18). Builds on J. B. Rainsberger, _Integrated Tests Are a Scam_.
