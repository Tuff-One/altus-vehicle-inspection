# Altus ICT Vehicle Inspection System — Test Plan

## Authentication
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password fails with generic error
- [ ] Login with nonexistent email fails with the same generic error
- [ ] Login with missing email/password returns 400
- [ ] Protected routes reject requests with no token
- [x] Protected routes reject requests with an invalid/tampered token
- [x] Protected routes reject requests with an expired token

## Authorization
- [ ] Admin can access all permission-gated routes
- [x] Boss can access all permission-gated routes except manage_boss_accounts-only actions (partial — no manage_boss_accounts route exists yet to test against, revisit when Manage Users screen is built)
- [x] Supervisor can access manage_vehicles/manage_inspections/view_reports but not manage_users
- [ ] Driver is denied on manage_vehicles, manage_inspection_items, manage_users, view_reports
- [ ] Driver can still create/view own inspections

## Vehicles
- [ ] Vehicle list loads for all roles
- [ ] Vehicle creation requires name/type/registration_number
- [ ] Editing a nonexistent vehicle id returns 404

## Inspections
- [ ] Inspection creation requires vehicle_id/date/time/overall_status/results
- [ ] Driver only sees their own inspections in the list
- [ ] Admin/Boss/Supervisor see all inspections
- [ ] A failed inspection insert rolls back cleanly, no partial data left behind

## Reports
- [ ] All three report routes return correct, expected data
- [ ] Driver is denied on all report routes

## Database
- [x] Foreign key constraints reject invalid references
- [x] ON DELETE CASCADE behaves as expected where configured