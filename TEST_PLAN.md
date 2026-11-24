# SMDC Travels — Test plan and evidence sheet

Record **actual results** while running in your own browser. These are proposed checks, not claimed human testing results.

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
