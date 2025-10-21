# Patch – Currency dropdown labels from fx_rates (2025-10-21)

- Added `listCurrenciesForUiDetailed()` in actions: returns `{ code, label }` with ISO names (e.g., "British Pound (GBP)").
- Account page now fetches detailed list and passes both code-only and detailed lists to the dashboard.
- Dashboard & Edit Profile Modal updated to accept and render labels, with fallback to plain codes.

Files changed:
- (none)
