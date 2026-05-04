# Desktop Auto-Update Implementation Plan (To Reach PASS)

## Goal
- Produce non-ambiguous evidence for auto-update E2E PASS on production-like channel.

## Phase 1: Prepare A/B Releases
1. Ensure a stable old installer is available (A): v0.1.1.
2. Publish new installer + latest.yml + blockmap (B): v0.1.2.
3. Confirm GitHub release assets include names referenced by latest.yml.

## Phase 2: Controlled Test Bed
1. Use a clean Windows VM or isolated machine snapshot.
2. Install v0.1.1 and activate sample license.
3. Seed minimal user data (profile, lesson progress, cached license).

## Phase 3: Execute Real Updater Flow
1. Launch v0.1.1 packaged app (non-audit mode).
2. Trigger check update from UI banner button or automatic check.
3. Capture updater phases from UI/log:
   - checking
   - available
   - downloading (with percent)
   - downloaded
4. Trigger install (quit-and-install) and allow relaunch.

## Phase 4: Validate Post-Update State
1. Confirm app version == 0.1.2.
2. Confirm license status still valid.
3. Confirm core user data persisted (profile/progress sample records).
4. Confirm lesson-card TTS still works on at least 2 grades.

## Required Artifacts To Store
1. Screenshot/video of update phases.
2. Exported updater state logs (if enabled) or renderer diagnostics.
3. Before/after version evidence.
4. Before/after data persistence evidence.

## Pass Criteria
1. Detection, download, and installation all succeed without manual installer fallback.
2. Relaunch on new version succeeds.
3. No data-loss regression.
4. No critical errors in updater flow.
