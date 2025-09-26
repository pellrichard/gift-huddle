# Account Page Patch

This adds the missing component at `src/components/account/AccountPage.tsx` so that
`app/account/page.tsx` can import it via `@/components/account/AccountPage`.

## Files
- `src/components/account/AccountPage.tsx`

## Notes
- Your existing `app/account/page.tsx` should already contain:
  ```ts
  import AccountPage from "@/components/account/AccountPage";
  export default function Page() { return <AccountPage />; }
  ```
- If your project doesn't use `@/* -> ./src/*` path alias, either add it
  to `tsconfig.json` or move this component to match your structure.
