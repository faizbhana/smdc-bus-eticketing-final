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

## Published-release browser verification — 2026-11-24

GitHub Pages deployment for merge `ec9f604` succeeded; asset-version follow-up `7fa10a2` also deployed successfully. Reviewer: Codex browser automation in the ChatGPT in-app browser (exact browser version not recorded). Fresh-release URL: https://faizbhana.github.io/smdc-bus-eticketing-final/?release=7fa10a2. Older cached homepage HTML may need a refresh; runtime assets are versioned as `20261124-1`.

The following are actual observed live browser results for the updated application, and supersede the matching Pending entries above:

| Live scenario | Observed result |
|---|---|
| Customer login; select S5 and S6 | Immediate countdown displayed 5:00 and then 4:50; total ₹1,240; availability decreased immediately. Pass. |
| Wrong six-digit PIN | Clear bank rejection, no confirmation. Pass. |
| Bank unavailable → My bookings → Retry payment with 246810 | Same booking changed from pending to confirmed; receipt reference and on-screen notification appeared. Pass. |
| Cancel S5 from two-seat confirmation | S6 remained confirmed; current amount ₹620; simulated refund ₹620; refund notification displayed. Pass. |
| Five wrong logins, then correct password | Account stayed locked. Pass. |
| Demo recovery email/link → login | Account unlocked with existing password; prior bookings remained. Pass. |
| Admin Payments | Rejected/pending/confirmed/refunded events and gross ₹1,240 / refunds ₹620 / net ₹620 displayed; no customer account credentials exposed. Pass. |
| Admin cancellation with reason | Remaining seat cancelled with another ₹620 simulated refund; audit log recorded admin, time, booking, seat and reason. Pass. |
| Responsive Explore screen | At 390 px, two-column navigation and usable search; document width 375 px. At 1440 px, document width 1425 px. No horizontal page overflow. Pass for this screen; exhaustive dialog/staff layout checks remain pending. |
| Fresh public release | New recovery feature and `app.js?v=20261124-1` confirmed; site usable without GitHub sign-in. Pass. |
| Browser errors during these workflows | No captured JavaScript errors. |

Remaining browser checks: new-account registration/ID validation, pending-cancellation and full wall-clock expiry, admin approval of a pending payment, abandoned-hold release, schedule/route edits, receipt-dialog details, and exhaustive mobile/staff/dialog keyboard checks. Their logic is covered where listed in the automated suite; do not describe those as completed live browser checks.
