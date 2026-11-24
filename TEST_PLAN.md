# SMDC Travels — Test plan and evidence sheet

The table below preserves the team's Pass results from commit `5ba4a38`. These results describe the earlier deployed version. Original human reviewer/date/browser details were not recorded and are still required; the automated checks below must not be presented as a person's browser testing.

| ID | Scenario | Expected result | Actual result / pass/fail / reviewer |
|---|---|---|---|
| TC-01 | As guest, search Delhi → Jaipur | Active matching services with price and available seat count | Pass |
| TC-02 | Search same origin and destination | Friendly error, no invalid search | Pass |
| TC-03 | Guest tries to reserve | Login required, schedules remain public | Pass |
| TC-04 | Log in as `customer@demo.test` with `Demo123!` | Customer access | Pass |
| TC-05 | Enter wrong password five times on demo account | Fifth failure locks account; sixth blocked | Pass |
| TC-06 | Select two seats and pay with fake PIN `246810` | Confirmation, receipt and booking record | Pass |
| TC-07 | Use incorrect PIN | Friendly rejection; no confirmed booking | Pass |
| TC-08 | Choose Bank unavailable | Pending status and temporary hold | Pass |
| TC-09 | Cancel one of two booked seats | One seat remains booked and other returns to availability | Pass |
| TC-10 | Manager logs in, views bookings/reports and edits departure | Change visible, account data restricted | Pass |
| TC-11 | Admin adds and deactivates a route | New route visible; deactivated route hidden from guest search | Pass |
| TC-12 | Admin attempts to delete route with confirmed booking | Deletion blocked; route can be deactivated | Pass |
| TC-13 | Admin opens audit log | Logged actions include user, timestamp and details | Pass |
| TC-14 | View on 390 px mobile viewport and desktop 1440 px | Navigation, text and forms remain usable | Pass |
| TC-15 | Open GitHub Pages link signed out/private | App loads and remains interactive | Pass |

Limitations to disclose: static-site simulation only; browser-local sample data; no real bank API or email; no cross-user shared seat locking; no production secure authentication or load/uptime verification; five-minute hold is an unresolved-requirement assumption; refund process is unspecified.

Actual browser/version checked: ______  Date: ______  Tested by: ______

## Updated-version verification — 2026-11-24

Reviewer: Codex automated verification. Command: `node --test tests/workflows.test.cjs` (20 passing tests) and `node --check app.js` (passed). The tests run actual app functions with isolated state and a DOM stub, not a real browser. A local page load was visually confirmed in Chrome, but browser automation could not complete the updated workflows. Run the browser checks below before final submission; do not mark them passed until observed.

| Automated check | Result |
|---|---|
| Existing local records migrate without losing bookings | Pass |
| Guest/staff cannot reserve customer seats | Pass |
| Immediate hold, shared fixed expiry, four-seat limit, close releases unpaid hold | Pass |
| Wrong PIN rejected without storing PIN; valid two-seat payment = ₹1,240 | Pass |
| Pending retry confirms the same booking once; exact five-minute expiry blocks payment | Pass |
| Individual cancellation refunds ₹620 once and preserves the other seat | Pass |
| Customer cannot cancel another customer's booking | Pass |
| Pending cancellation creates no charge or refund | Pass |
| Five failures lock account; correct sixth blocked; targeted unlock works | Pass |
| Registration stores fictional ID and rejects duplicate/invalid input | Pass |
| Payment tab admin-only; manager cannot approve pending payment | Pass |
| Admin cancellation requires reason, refunds full amount, and audits action | Pass |
| Route deletion/capacity edits protect active holds | Pass |

| Required updated-version browser check | Status |
|---|---|
| Register with a fictional ID, log out/in, duplicate and invalid-input checks | Pending |
| Select seats, observe countdown, close unpaid dialog, reselect, pay with invalid/valid PIN | Pending |
| Bank unavailable → pending → retry; pending → cancel; wait full five minutes for expiry | Pending |
| Cancel individual confirmed seat; check receipt, notifications and refund totals | Pending |
| Lock account, use on-screen recovery link, sign in without resetting other data | Pending |
| Admin Payments: review pending payment, cancel with reason; check payment/audit logs | Pending |
| Manager schedule edit; admin add/deactivate route; protection against invalid capacity/deletion | Pending |
| Complete customer/staff navigation at 390 px and 1440 px, including new dialogs | Pending |
| After approved merge/deployment, open public Pages URL signed out and repeat core workflow | Pending |

## Updated limitations and demo policy

Five-minute holds start on selection and are local to one browser. No true concurrent seat-locking guarantee is made. Pending reservations can be retried before expiry or cancelled, then expire without charge. Confirmed-seat cancellation uses a full per-seat simulated refund; real refund policy is unresolved. Recovery emails and customer notifications are displayed on screen only. Payment events contain no entered PIN, bank credentials, or government ID. Fictional IDs and demo passwords remain in browser storage, so use no real sensitive information. Existing payment history cannot be reconstructed reliably; legacy bookings may predate the event log. Data lasts only while localStorage is retained; 12-month retention, real bank/email/route integrations, security, load and uptime guarantees are deferred.
