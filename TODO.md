# SummonIQ TODO Audit

This list summarizes gaps observed in the current codebase to make SummonIQ a complete solution for creating projects/apps, publishing to the web, connecting domains, and running centralized analytics and agent workflows.

## Project Lifecycle
- [ ] Add a ProjectTemplate model and full template creation workflow (see `apps/orchestrator/scripts/init-templates.ts`, `apps/orchestrator/scripts/reset-templates.ts`).
- [ ] Implement the Create Template action and flow in the Templates UI (see `apps/orchestrator/app/templates/[type]/page.tsx`).
- [ ] Add Git repo initialization and optional GitHub linking during create/init (see TODOs in `apps/orchestrator/app/projects/page.tsx` and `apps/orchestrator/app/projects/components/project-modal.tsx`).
- [ ] Add Vercel/Netlify provisioning on project creation (repo, env vars, initial deploy) (see TODOs in `apps/orchestrator/app/projects/page.tsx` and `apps/orchestrator/app/api/projects/[name]/initialize/route.ts`).
- [ ] Persist ignored projects and implement a proper “ignore/unignore” flow (see TODO in `apps/orchestrator/app/projects/page.tsx`).
- [ ] Make project base-path selection persistent and portable across machines (currently tied to local defaults in `apps/orchestrator/app/projects/components/project-modal.tsx`).
- [ ] Add import/connect workflow for existing repos (scan repo, detect app types, map to SummonIQ config, verify dependencies).
- [ ] Add project archive/delete with confirmation and cleanup (DB records, files, running processes, embeddings).
- [ ] Add project rename/slug change flow that updates paths, URLs, and references safely.
- [ ] Add project cloning/duplication (copy config + optional repo + optional DB snapshot).
- [ ] Add project tags, owners, and status labels (active/paused/archived) with filters.
- [ ] Add project health checks (missing env, missing deps, invalid ports, broken paths).
- [ ] Add project backup/export and restore/import flows (zip, manifest, config).
- [ ] Add per-project env profiles (dev/staging/prod) and config overrides.
- [ ] Add recent projects and pinned favorites with last-opened tracking.

## Navigation & Information Architecture
- [ ] Add a `/build` landing page (or redirect to the first child) since nav links to `/build` but there is no route (see `apps/orchestrator/app/components/app-shell.tsx`).
- [ ] Add a `/knowledge` landing page (or update nav to point directly to `/best-practices`) since `/knowledge` is missing (see `apps/orchestrator/app/components/app-shell.tsx`).
- [ ] Add breadcrumbs for project/app/detail routes to make deep navigation obvious.
- [ ] Add consistent empty states and cross-links (e.g., from Analytics to app setup).
- [ ] Add a global search/command palette entry point in the shell.
- [ ] Add a “recent activity” view to jump to last touched apps, tickets, and docs.

## Search, Command Palette & Shortcuts
- [ ] Add global search across projects, apps, tickets, docs, and files.
- [ ] Add a command palette with start/stop, open app, create ticket, and search actions.
- [ ] Add keyboard shortcut map with in-app discoverability.
- [ ] Add quick-switcher between projects/apps with fuzzy search.

## Desktop Shell & OS Integration
- [ ] Add auto-update flow for the Electron shell (staged rollout, release notes).
- [ ] Add deep linking to open routes from OS URLs (e.g., applab://projects/...).
- [ ] Add OS menu items and keyboard shortcuts for primary actions.
- [ ] Add system tray controls for quick start/stop and status visibility.

## Notifications & Activity
- [ ] Add notification center (agent events, deploy status, domain verification, errors).
- [ ] Add desktop notifications for key events with opt-in controls.
- [ ] Add activity feed filter by project/app/agent with export.

## Configuration Library & Shared Rules
- [ ] Remove legacy mock config constants or move them to seed scripts so production data is consistent (see `apps/orchestrator/app/api/shared-configs/route.ts`).
- [ ] Add schema validation for config content (JSON/YAML/Markdown) and surface inline errors.
- [ ] Add apply-to-project/app flow with diff preview and file destination mapping.
- [ ] Add config versioning and rollback for shared configs and applied configs.
- [ ] Add usage tracking and “where used” views for shared rules.
- [ ] Add import/export bundles for shared configs (zip + manifest).

## Config & Dependency Management
- [ ] Sync config templates to actual files on disk (eslint, tsconfig, tailwind, etc) with preview and rollback.
- [ ] Add “apply template” workflows that update repo files and run format/lint.
- [ ] Add dependency sync that reads/writes package.json and lockfiles safely.
- [ ] Add dependency health checks (outdated, vulnerable, unused).
- [ ] Add per-app dependency scopes and conflict resolution between apps in monorepo.
- [ ] Add env analyzer results to the UI with fix-it actions (unused/missing vars).

## Templates & Layouts Library
- [ ] Implement the templates API endpoints used by the Templates UI (`/api/templates/by-type`, `/api/templates/:id/files`) or refactor the UI to a real backend (calls in `apps/orchestrator/app/templates/[type]/page.tsx`).
- [ ] Persist templates and file trees with versioning, diffing, and history (Templates UI edits file content but no durable store today).
- [ ] Wire template selection into app/project creation so scaffolding uses the chosen template.
- [ ] Expand the layouts catalog beyond the hard-coded list and integrate layouts into Studio (static list in `apps/orchestrator/app/layouts/page.tsx`).
- [ ] Add template variables and substitution (app name, port, package manager, framework) with validation.
- [ ] Add template preview rendering and linting before publish.
- [ ] Add template dependencies and post-create hooks (install deps, run codegen, seed data).
- [ ] Add default template per app type + project-level overrides.
- [ ] Add template creation from an existing repo/app with snapshotting.
- [ ] Add template versioning, release notes, and deprecation handling.
- [ ] Add template compatibility rules (framework/version) with warnings.

## Features & Project Capabilities
- [ ] Connect app feature flags to Feature Definitions (features stored as strings in `apps/orchestrator/app/projects/[name]/apps/[appName]/components/config-form.tsx` while definitions live in `apps/orchestrator/app/features/*`).
- [ ] Implement the “apply feature” pipeline to execute `changes` (create/modify/append files, install deps) defined in `apps/orchestrator/app/api/features/route.ts`.
- [ ] Add dependency/conflict resolution and migration UI when enabling/disabling features (features declare dependencies but no enforcement).
- [ ] Show per-app feature status and health checks (missing in app detail and config views).
- [ ] Add feature dry-run preview with file diffs and dependency changes before apply.
- [ ] Add feature rollback support (revert files, remove deps, undo env vars).
- [ ] Add feature versioning and upgrade paths (migrations, schema changes).
- [ ] Add per-feature settings UI that persists to project/app config.
- [ ] Add capability matrix per app (auth, payments, analytics, email) with status.
- [ ] Add feature checks to detect partial/manual installs and reconcile.

## Best Practices & Knowledge Base
- [ ] Add per-project best practice sets and inject them into agent context/prompts (Best Practices exist in `apps/orchestrator/app/api/best-practices/route.ts` but are not wired to agents).
- [ ] Enable or clearly gate disabled app types in Best Practices UI (disabled options in `apps/orchestrator/app/best-practices/page.tsx`).
- [ ] Add versioning, review workflow, and sharing for best practices (no approval/history in Best Practices UI).
- [ ] Add tagging, ownership, and responsibility per best practice entry.
- [ ] Add best practice import/export (Markdown bundles) and cloning.
- [ ] Add “apply to project” to generate AGENTS.md/CLAUDE.md/CURSOR rules from best practices.
- [ ] Add semantic search and embeddings for best practices with RAG context hooks.
- [ ] Add linking between best practices and features/tickets/docs.

## Documentation, Memory & RAG
- [ ] Implement manual “Add Memory” creation/editing (button has no handler in `apps/orchestrator/app/projects/[name]/memories/page.tsx`).
- [ ] Add doc import/export and repo sync for project documentation (Docs live only in the app UI in `apps/orchestrator/app/projects/[name]/tabs/documentation-tab.tsx`).
- [ ] Add attachments and richer metadata for knowledge docs (owners, review state, source links).
- [ ] Surface RAG indexing failures and provide retry/queue controls (RAG status exists but no ops UI in `apps/orchestrator/app/projects/[name]/tabs/documentation-tab.tsx`).
- [ ] Add doc templates and guided creation flows (spec, ADR, runbook, changelog).
- [ ] Add memory provenance tracking (agent/user/system) and confidence scores.
- [ ] Add memory summarization, deduplication, and pruning controls.
- [ ] Add private vs shared memory scopes (per user vs per project).
- [ ] Add RAG model/version management with reindex workflows.
- [ ] Add doc diff history and approvals for published docs.

## App Creation & Runtime
- [ ] Implement real runtime status detection in the web/desktop/API/marketing tabs (currently hardcoded `isRunning = false` in `apps/orchestrator/app/projects/[name]/tabs/*`).
- [ ] Wire Start All / Stop All to actual IPC and state updates (overview tab uses placeholder controls in `apps/orchestrator/app/projects/[name]/tabs/overview-tab.tsx`).
- [ ] Build a unified live log aggregation stream across all running apps (overview tab has TODO in `apps/orchestrator/app/projects/[name]/tabs/overview-tab.tsx`).
- [ ] Expose per-app health checks and crash detection across Electron + local dev servers (only partial status via port checks today).
- [ ] Add runtime error surfacing and retry flows for failed starts (install dependencies, port conflicts, missing package.json, etc.).
- [ ] Add preflight checks before start (node/bun version, deps installed, env files present).
- [ ] Add port reservation and conflict detection with suggestions and auto-fix.
- [ ] Add restart/reload controls and “open logs” shortcuts per app.
- [ ] Add per-app runtime profiles (dev/build/start commands with env).
- [ ] Add process resource telemetry (CPU/mem) and uptime tracking.
- [ ] Add “open in terminal” and “open in file explorer” actions.
- [ ] Add cross-app runtime dependency ordering (start API before web app).

## Files & Repo Management
- [ ] Add file search/replace across project with previews.
- [ ] Add inline diff viewer and history for edited files.
- [ ] Add git status, diff, commit, branch, and PR workflows in the UI.
- [ ] Add file type previews (images, markdown, json) and readonly locks for binaries.
- [ ] Add “open in editor” and “open in terminal” actions per file.

## Studio / Designer & Publish
- [ ] Add a dedicated page browser (search/sort/filter) and layouts browser (multiple TODOs in `apps/orchestrator/components/studio/builder/*` and `apps/orchestrator/app/projects/[name]/apps/[appName]/app-detail.tsx`).
- [ ] Show per-page publish status and diffs between designer + filesystem (TODO in `apps/orchestrator/app/projects/[name]/apps/[appName]/app-detail.tsx` and `apps/orchestrator/components/studio/builder/file-browser.tsx`).
- [ ] Surface a chooser when a requested designer page is missing instead of silently falling back (TODO in `apps/orchestrator/app/studio/page.tsx`).
- [ ] Load project metadata from the filesystem in the Studio welcome flow (TODO in `apps/orchestrator/components/studio/builder/welcome-page.tsx`).
- [ ] Add Studio breadcrumb navigation and a searchable page selector in the header (TODOs in `apps/orchestrator/components/studio/builder/app-header.tsx`).
- [ ] Add layout stack overlays and explicit `{children}` slot indicators for layout-like components (TODOs in `apps/orchestrator/components/studio/builder/canvas.tsx` and `apps/orchestrator/components/studio/builder/render-component.tsx`).
- [ ] Add default docking slots for Pages/Layouts browsers in the Studio layout (TODO in `apps/orchestrator/components/studio/builder/dockable-layout.tsx`).
- [ ] Detect Pages Router apps when enumerating pages (TODO in `apps/orchestrator/app/api/projects/[name]/apps/[appName]/pages/route.ts`).
- [ ] Add publish pipeline that creates PRs, requests agent review, and merges before deployment (TODOs in `apps/orchestrator/lib/studio/store.ts`).
- [ ] Add “publish all pages” conflict resolution, route collision handling, and batch results UI (partial in `apps/orchestrator/lib/studio/store.ts`).
- [ ] Persist last-opened page per app so the studio reopens where you left off (TODO in `apps/orchestrator/lib/studio/store.ts`).
- [ ] Add undo/redo history and change timeline for Studio edits.
- [ ] Add responsive breakpoints, viewport presets, and per-breakpoint styles.
- [ ] Add design tokens editor (typography scale, spacing, radius, shadows).
- [ ] Add data binding layer (connect components to APIs, mock data, and schema).
- [ ] Add accessibility checks and warnings inside the builder.
- [ ] Add component-level presets and reusable blocks with versioning.
- [ ] Add Studio preview environment with shareable preview URLs.
- [ ] Add multi-user collaboration or lock/merge strategy for page edits.
- [ ] Add codegen validation for build errors before publishing.

## Design, Branding & Assets
- [ ] Implement branding save/theme endpoints used by the branding UI (`/api/branding/save`, `/api/branding/set-theme-color`) or route them through project branding APIs (calls in `apps/orchestrator/app/projects/[name]/tabs/branding-tab.tsx`).
- [ ] Persist generated logos, brand palettes, and style assets in project storage with version history and export options.
- [ ] Add asset library + export pipeline for Asset Designer (only chat endpoint exists in `apps/orchestrator/app/api/asset-designer/chat/route.ts`).
- [ ] Connect branding outputs to Tailwind theme tokens and project config (branding currently saved independently of app theme).
- [ ] Add brand kit management (logos, fonts, colors, imagery) with download packs.
- [ ] Add export formats for assets (SVG/PNG/WebP) and sizing presets.
- [ ] Add brand guideline generator (usage rules, clear space, typography).
- [ ] Add asset tagging, search, and per-project organization.
- [ ] Add history/revert for brand and asset changes.

## Deployment & Domains
- [ ] Connect app deployment config to real provider APIs (Vercel/Netlify/Cloudflare/AWS) instead of just storing fields (see deployment tab in `apps/orchestrator/app/projects/[name]/apps/[appName]/components/config-form.tsx`).
- [ ] Add a “Deployments & Integrations” section in project settings for auth, repo linking, and auto-deploy settings (TODO in `apps/orchestrator/app/projects/[name]/tabs/settings-tab.tsx`).
- [ ] Define a domain data model (Domain, Verification, Certificate, RedirectRule, DomainDeploymentMapping) with status enums and audit fields (no domain tables yet).
- [ ] Add domain CRUD API endpoints (`/api/domains`, `/api/domains/:id`, `/api/domains/:id/verify`, `/api/domains/:id/health`, `/api/domains/:id/redirects`, `/api/domains/:id/history`).
- [ ] Implement DNS verification flow: generate TXT/CNAME/A/AAAA/CAA instructions, store verification tokens, run resolver checks, and mark verified/unverified states.
- [ ] Support apex/subdomain/wildcard domains with explicit environment scope (production vs preview) and primary/alias designation.
- [ ] Implement TLS/SSL issuance (ACME/Let's Encrypt) with certificate storage, renewal jobs, and failure remediation (fallback to provider-managed certs when applicable).
- [ ] Add domain routing mappings: bind domains to app deployments, include versioned mappings, and expose current/previous targets.
- [ ] Build redirect management: 301/302 rules, path rewrites, wildcard support, import/export, and conflict validation.
- [ ] Add domain rollback controls: revert mappings/redirect rules to a previous snapshot with audit trail.
- [ ] Add domain health checks: HTTPS reachability, certificate validity, redirect loop detection, and error surfacing.
- [ ] Add background jobs for periodic DNS re-validation and certificate renewal/expiry notifications.
- [ ] Build domain management UI: add domain modal, DNS instruction stepper, verification status badges, primary/alias toggles, redirects editor, and rollback history view.
- [ ] Add deployment status tracking, history, and rollback controls per app.
- [ ] Add environment variable sync to deployment providers and ensure secrets stay server-only.
- [ ] Add build/publish pipeline with preview environments per branch and PR.
- [ ] Add deployment pipeline stages (build, test, security scan, deploy) with logs.
- [ ] Add deploy approvals and manual gates for production.
- [ ] Add release notes and changelog generation per deployment.
- [ ] Add traffic split or canary releases for critical apps.

## Analytics (Centralized Service)
- [ ] Replace the mock analytics UI with live data from the analytics service (current dashboard in `apps/orchestrator/app/analytics/page.tsx` is hardcoded).
- [ ] Replace placeholder analytics metrics (like avg time) with real aggregated data in the dashboard (see `apps/orchestrator/app/analytics/components/analytics-dashboard.tsx`).
- [ ] Standardize analytics configuration between client (`NEXT_PUBLIC_ANALYTICS_ENDPOINT`) and server (`ANALYTICS_API_URL`) and surface a UI for enabling/disabling analytics per app (see `apps/orchestrator/app/layout.tsx` and `apps/orchestrator/app/analytics/actions.ts`).
- [ ] Ensure generated apps automatically report to the centralized service when analytics is enabled (currently only copy snippets in `apps/orchestrator/app/projects/[name]/apps/[appName]/app-detail.tsx`).
- [ ] Add API key auth, rate limiting, and multi-tenant isolation for analytics ingest and queries (see `apps/analytics/app/api/*`).
- [ ] Move analytics storage to a production-grade DB (current file-based `.analytics-data.json` in `apps/analytics/lib/storage.ts`).
- [ ] Add retention policies, aggregation jobs, and dashboard filters (date range, segment, app selection).
- [ ] Add an event taxonomy editor with schema validation for event properties.
- [ ] Add SDK configuration UI (sampling rate, anonymization, consent).
- [ ] Add privacy controls (DNT, GDPR export/delete, data residency options).
- [ ] Add performance metrics (TTFB, LCP, CLS) for web apps.
- [ ] Add funnels, cohorts, and conversion goals per app.
- [ ] Add export to CSV/Parquet and scheduled reports.
- [ ] Add alerting on metric thresholds (spikes, drops, errors).

## Agent Workflows & Progress
- [ ] Implement resume in the agent executor (control route notes resume not implemented in `apps/orchestrator/app/api/agent-sessions/[sessionId]/control/route.ts`).
- [ ] Wire Agents tab session controls to real control endpoints (UI-only buttons in `apps/orchestrator/app/projects/[name]/tabs/agents-tab.tsx`).
- [ ] Add a unified progress timeline for agent work (events exist but not consistently surfaced; see `apps/orchestrator/app/projects/[name]/components/live-agent-activity.tsx` and `apps/orchestrator/app/projects/[name]/components/agent-activity-stream.tsx`).
- [ ] Persist orchestration configuration instead of returning mock values (see `apps/orchestrator/lib/orchestration/project-orchestrator.ts`).
- [ ] Replace placeholder agent stats (e.g., average completion time) with real session metrics (hardcoded in `apps/orchestrator/app/projects/[name]/tabs/agents-tab.tsx`).
- [ ] Add agent queueing/concurrency limits and robust cancellation semantics (multiple sessions per agent, rollback handling, state recovery).
- [ ] Add notification system for agent events (TODO in `apps/orchestrator/app/api/tickets/[id]/comments/route.ts`).
- [ ] Add structured outputs and artifact linking for completed work (commit/PR links, test results, deployment results).
- [ ] Add per-agent budgets (time/cost/token) with guardrails and alerts.
- [ ] Add manual approval gates for risky actions (file deletes, deploys).
- [ ] Add agent run logs with step-level timings and error states.
- [ ] Add skill/capability validation before assignment (role, specialization).
- [ ] Add rerun/redo flows for failed agent steps with context reuse.
- [ ] Add worker health monitoring and stuck-run detection.
- [ ] Add team-level workload balancing and auto-assignment rules.

## Teams & Organization
- [ ] Add team member management (invite, assign roles, remove, reorder).
- [ ] Add team workflow assignment and enforcement per project.
- [ ] Add team-level analytics (throughput, cycle time, WIP limits).
- [ ] Add role-based permissions per team (reviewers, approvers, assigners).

## AI Slide Panel / Assistant UX
- [ ] Persist AI panel chat history per project and allow export (AI panel state is local only in `apps/orchestrator/components/studio/builder/ai-panel.tsx`).
- [ ] Add streaming responses and cancellation in the AI panel (generation is request/response only).
- [ ] Inject project context (selected page/component, app config) into AI prompts so outputs are grounded.
- [ ] Add model cost/usage telemetry and per-project AI settings.
- [ ] Unify AI panel behavior between docked/float modes and remove legacy panel branches.
- [ ] Wire the UI AI chat popover to a real AI service (placeholder response in `@summoniq/applab-ui`).
- [ ] Add action previews and diffs for AI-proposed edits before apply.
- [ ] Add prompt templates and pinned instructions per project.
- [ ] Add safe edit sandboxing (apply changes to draft first, then merge).
- [ ] Add component-aware suggestions (respect selected component/slot).
- [ ] Add “explain changes” summaries after AI edits.

## Assistant & Command Center
- [ ] Persist assistant chat history and tool calls (assistant uses in-memory state only in `apps/orchestrator/app/assistant/page.tsx`).
- [ ] Add tool permission gating and confirmation flows for destructive actions (assistant can launch apps but lacks guardrails).
- [ ] Inject best practices, project docs, and memories into assistant context by default (no RAG context wiring today).
- [ ] Add command routing to open logs, start/stop apps, and create tickets.
- [ ] Add project-scoped assistant sessions with context switching.
- [ ] Add assistant usage analytics and feedback loop.
- [ ] Add fallback behavior when MCP/OpenAI is unavailable (offline mode).

## Workflows & Tickets
- [ ] Save workflow edits to backend (TODOs in `apps/orchestrator/app/workflows/[id]/page.tsx`).
- [ ] Add workflow automation hooks (stage transitions triggering agent actions, notifications, CI checks).
- [ ] Ensure ticket status transitions are validated and auditable across UI/API.
- [ ] Populate ticket `createdBy` from auth context instead of hardcoding (TODO in `apps/orchestrator/app/api/projects/[name]/tickets/route.ts`).
- [ ] Add ticket comments, attachments, and @mentions.
- [ ] Add due dates, SLA timers, and overdue alerts.
- [ ] Add ticket dependencies (blocks/blocked by) with visual indicators.
- [ ] Add ticket templates and intake forms by project.
- [ ] Add workflow run logs and audit trails for transitions.
- [ ] Add kanban swimlanes and filter presets (assignee, priority, status).

## Data Explorer & DB Management
- [ ] Expand Data tab into a full data explorer (schema browser, filters, CRUD, relationships) (TODOs in `apps/orchestrator/app/projects/[name]/tabs/data-tab.tsx`).
- [ ] Add database selector for multi-app projects and connection management.
- [ ] Add backups/restore and migration tooling surfaced in the UI.
- [ ] Replace the hardcoded global table list with schema introspection (manual list in `apps/orchestrator/app/api/data/tables/route.ts`).
- [ ] Add generic CRUD, sorting, and query filters to the global Data view (`apps/orchestrator/app/data/page.tsx` is read-only).
- [ ] Add SQL/query editor with saved queries and query history.
- [ ] Add CSV/JSON import/export and bulk edit flows.
- [ ] Add row-level validation and schema-aware forms for CRUD.
- [ ] Add data masking for sensitive columns in UI.
- [ ] Add connection profiles for external databases (read-only and RW).
- [ ] Add migration history viewer and drift detection.

## MCP & Integrations
- [ ] Implement MCP server start/stop via IPC (TODOs in `apps/orchestrator/app/projects/[name]/tabs/mcp-tab.tsx`).
- [ ] Persist MCP server toggles in project config and propagate to agent runtime (see project config form MCP section).
- [ ] Add OAuth/setup flows for integrations listed in project settings (GitHub, Vercel, Sentry, etc.) instead of local-only configuration.
- [ ] Add integration health checks and sync status dashboards.
- [ ] Add per-project integration secrets storage and rotation.
- [ ] Add integration-specific actions (create repo, open PR, create issue, deploy).
- [ ] Add MCP tool permissions per agent and per project.
- [ ] Add multiple MCP server profiles and switch per project/app.

## Settings & Environment Management
- [ ] Replace localStorage-backed settings with DB/file storage; API routes currently call `apps/orchestrator/lib/settings-store.ts` which is browser-only.
- [ ] Add secrets encryption and per-project overrides for environment variables (settings UI stores plain values).
- [ ] Sync environment settings to actual `.env` files and allow diff/rollback workflows.
- [ ] Add environment schema validation (required vars, formats, defaults).
- [ ] Add environment profiles (dev/staging/prod) with inheritance.
- [ ] Add env variable audit log and change history.
- [ ] Add import/export for env sets and .env templates.
- [ ] Add redaction/masking and permission-gated reveal.

## Component Library & Design System
- [ ] Add UI to create/edit/publish component entries and manage tags (component library is read-only today).
- [ ] Add import from code/Figma and code snippet export for component docs (no ingestion pipeline today).
- [ ] Add component versioning and deprecation notices.
- [ ] Add component usage analytics and “where used” references.
- [ ] Add playground with props editor and live preview.
- [ ] Add design token synchronization (colors, spacing, typography) with Tailwind.

## Security, Auth, and Multi-User
- [ ] Add real authentication and authorization for orchestrator APIs and UI.
- [ ] Add role-based access and audit logs for project/app changes, deployments, and agent actions.
- [ ] Add secrets management UI for API keys and analytics credentials.
- [ ] Add session management (timeout, revocation, device list).
- [ ] Add SSO/OAuth providers and team invites.
- [ ] Add per-project access control and share links.
- [ ] Add security scanning hooks (deps, secrets in repo).

## Testing & Observability
- [ ] Add Playwright coverage for core flows: project create, app scaffold, start/stop, publish, analytics, agent controls.
- [ ] Add error tracking and centralized logs for the Electron main process and runtime IPC calls.
- [ ] Add unit tests for orchestration logic and critical utilities.
- [ ] Add integration tests for API routes and DB flows.
- [ ] Add build-time checks for config validity and schema drift.
- [ ] Add runtime metrics (latency, error rate, background job status).
- [ ] Add structured logging with correlation IDs across UI/API/Electron.

## Simplification & Novel Workflows
- [ ] Build a single “Ship” button that runs the minimal pipeline: validate -> build -> deploy -> smoke test -> publish, with a one-page status summary.
- [ ] Add intent-first project creation: user answers 3 questions, SummonIQ generates the rest (stack, ports, templates, env, scripts).
- [ ] Add a “What’s Broken?” panel that auto-diagnoses the most common issues and offers 1-click fixes.
- [ ] Add a “ready-to-release” traffic light with the shortest possible checklist (env, tests, build, deploy).
- [ ] Add “snapshot & share” that creates a lightweight preview without full deploy (static capture + hosted preview).
- [ ] Add a unified “Workspace Health” view that collapses all app status into one simple card per app.
- [ ] Add “minimal mode” UI that hides advanced tabs and only shows Create -> Run -> Publish.
- [ ] Add an “Outcome Map” that links goals -> features -> tickets -> releases in a single visual chain.
- [ ] Add “safe mode” for risky operations (deploy, delete, migrations) with an explicit confirmation wizard.
- [ ] Add “context capsule” per project: a single generated summary (purpose, stack, owners, current status) kept up to date.
- [ ] Add a “one-page changelog” auto-generated from commits, tickets, and releases.
- [ ] Add a “preview router” that lets you swap preview versions without touching prod.
- [ ] Add “auto-port negotiation” that silently fixes port conflicts and documents the change.
- [ ] Add “agent guardrails” presets (fast vs safe vs thorough) to simplify agent behavior choices.
- [ ] Add “project onboarding card” that guides the next 3 actions only, not the entire backlog.
