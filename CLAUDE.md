@AGENTS.md

# Project architecture

A women's health app: eating/exercise tracking, period tracking, and
cross-domain insights between them.

## Tech stack

- **Expo (SDK 57, managed workflow)** + React Native, TypeScript throughout.
- **Expo Router** for file-based routing. Tabs use `NativeTabs` from
  `expo-router/unstable-native-tabs` (native tab bar, SF Symbols on iOS /
  Material icons on Android) — not `@react-navigation/bottom-tabs`.
- **Zustand** for local/client-side state (UI state, in-progress log forms,
  cross-screen ephemeral state).
- **Supabase** for the backend: auth, Postgres, storage.
- **TanStack Query** for server-state — wraps Supabase calls, owns caching/
  invalidation/refetching. Supabase is the data source; TanStack Query is the
  access layer feature hooks call into.
- The app uses native modules (`@expo/ui`, `expo-glass-effect`, native tabs),
  so it needs a custom dev client — **Expo Go will not work**. Run with
  `npx expo run:ios` / `npx expo run:android`. First run does a prebuild
  (generates `ios/`/`android/`, not committed — see below) and installs
  CocoaPods; prefer `brew install cocoapods` over the system Ruby `gem
  install` (the latter fails with an EACCES permission error on macOS).
  Adding a new native dependency requires re-running `run:ios`/`run:android`,
  not just `expo start`.
- `ios/`/`android/` are build artifacts of `expo prebuild`, not checked in.
  Don't commit them; regenerate with `npx expo run:ios`/`run:android` when
  needed, and revert the `app.json`/`package.json` edits prebuild makes
  (bundle identifier, `ios`/`android` npm scripts) if you don't intend to
  keep a persistent native project.

## Folder structure

- `src/app/` — **routes only**. Thin files that assemble a screen from
  `src/features/*` and handle route-level concerns (params, header/modal
  options). No business logic, data fetching, or non-trivial state here.
  - `(tabs)/_layout.tsx` — `NativeTabs` definition for the 4 tabs.
  - `(tabs)/index.tsx`, `period.tsx`, `insights.tsx`, `settings.tsx` — the
    tab screens.
  - `discover.tsx` — pushed (card presentation) from Home's "See all" link.
    Deliberately not a tab.
  - `log/meal.tsx`, `log/exercise.tsx`, `log/symptom.tsx` — modal screens
    opened from `LogFAB`.
  - `_layout.tsx` — root `Stack`: registers `(tabs)` (`headerShown: false`),
    `discover` (card), `log/*` (modal).
- `src/features/<domain>/` — one folder per domain (`home`, `period`,
  `insights`, `discover`, `settings`): hooks, Supabase/TanStack Query calls,
  Zustand slices, feature-specific components. Route files import from here;
  feature code never imports from `src/app/`.
- `src/types/` — shared TypeScript interfaces for core data models
  (`MealLog`, `ExerciseLog`, `SymptomLog`, `CycleData`, ...) used across
  features. Types used by only one feature live inside that feature's folder
  instead.
- `src/components/` — generic, reusable, presentation-only components shared
  across features/routes (`ThemedText`, `ThemedView`, `LogFAB`). Not tied to
  one feature's business logic.
- `src/hooks/`, `src/constants/` — app-wide hooks and theme constants.

## Navigation pattern

- 4 native tabs: Home, Period, Insights, Settings.
- `LogFAB` (`src/components/LogFAB.tsx`) renders on the Home and Period tabs
  only. Tapping it opens a custom action sheet (Modal + backdrop, no
  external dependency) with Log Meal / Log Exercise / Log Symptom, each
  pushing the matching `log/*` modal route.
- Discover is reachable only via the "See all" link on Home — pushed as a
  card, not a tab.
- `log/*` screens are presented via the root Stack's `presentation: 'modal'`
  option, not a nested navigator.

## Conventions

- **Naming**: most files use kebab-case (`themed-text.tsx`, `use-theme.ts`).
  A component may use PascalCase when explicitly named that way (e.g.
  `LogFAB.tsx`) — match whatever convention the surrounding folder already
  uses rather than converting existing files.
- **New features**: put hooks/data-access/business logic under
  `src/features/<name>/`; keep the corresponding `src/app/` route file a
  thin wrapper that renders feature components.
- **New shared data models** go in `src/types/`; keep feature-local types
  inside that feature's folder.
- **State**: reach for Zustand for client/UI state; reach for TanStack Query
  (backed by Supabase) for anything that is really server data. Avoid
  duplicating server data into Zustand.
- This project tracks a newer Expo SDK than older training data reflects
  (see AGENTS.md above) — verify current APIs against
  `node_modules/expo-router/build/**/*.d.ts` or
  https://docs.expo.dev/versions/v57.0.0/ before assuming an older
  Expo Router/React Navigation shape.
