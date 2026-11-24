# ISM 3113 Final Project — Group 5 Deliverables Worksheet

**System:** SMDC Travels E-Ticketing for Buses (Case 5)  
**Members:** Faiz Bhana · Liam Gordy · Luke Jackson

This is a repository handoff record. Transfer the verified material into the required Word submission. Items requiring actual group evidence are identified explicitly.

## 1. Published application

- Final website: https://faizbhana.github.io/smdc-bus-eticketing-final/
- Source repository: https://github.com/faizbhana/smdc-bus-eticketing-final/
- Hosting member: Faiz Bhana.
- Public access: Codex opened the published site without GitHub sign-in and checked customer/staff workflows during the November 23–24 review. This checks the previous deployment. Recheck after the updated pull request is approved and deployed.

## 2. Source files and README

Runtime files are at the repository root: `index.html`, `styles.css`, and `app.js`. Supporting files: `README.md`, `TEST_PLAN.md`, `tests/workflows.test.cjs`, `AI_DEVELOPMENT_LOG.md`, and `DEMO_SCRIPT.md`.

The README identifies the actual final site, demo credentials/PIN, role-specific features, run/test instructions, simulations, and limitations.

## 3. Requirements traceability map

Sources: Case 5, Chapter 5.1 and UML Figures 5.1–5.11 in *UML Diagramming: A Case Study Approach* (printed pages 75–84); Group 12 requirements interview, dated September 24, 2026, version 1.0; paired prototype https://theom720.github.io/smdc-bus-eticketing/ (screens inspected during the November 23–24 review). The case defines scope; interview details and unresolved conflicts are handled below.

| Case / interview behavior | Paired prototype reference | Final screen / behavior | Status and limitation | Test evidence |
|---|---|---|---|---|
| FR-01, DR-01: register customer identity | Register control | Register dialog accepts name, email, password, fictional ID; rejects duplicate email and invalid fictional ID | Local simulation; ID/password not production-secure | Automated registration tests; updated browser registration check pending |
| FR-02/03, SR-01/03, IR-04: login, lockout, recovery | Log in / Register navigation | Guest can browse; booking needs customer login; fifth failure locks; Demo account recovery shows an unlock email/link on screen | Simulated password authentication and recovery; no actual email | TC-03/04/05 legacy results; automated access/lockout/unlock tests |
| Case: check buses, schedules, availability; FR-04 | Available schedules, FROM/TO filters, departure buttons, fares | Explore search and sample route cards show date, departure, fare and remaining seats; expired departures excluded | Five sample services; no live ITC feed | TC-01/02; browser invalid/empty search checks on prior deployment |
| FR-05/06, BR-02/03, DR-03: seat availability and hold | Date/departure selection before booking | Seat map with window/aisle hints; first selection immediately starts fixed five-minute hold and visible countdown | Local browser only; exact hold duration remains a demo assumption | Automated immediate/fixed hold, four-seat limit, close/release, expiry and capacity-protection tests |
| Case payment PIN / FR-07, BR-04, IR-01 | Prototype payment PIN workflow described in handoff README | Checkout rejects wrong PIN; demo PIN 246810 confirms, creates receipt and on-screen notification | Simulated bank approval; no actual transfer/email | TC-06/07; automated rejection/confirmation tests |
| BR-05, Q-02: bank unavailable and resolution | Earlier prototype handoff describes pending reservations | Bank unavailable creates pending/no-charge record; customer can retry/cancel; admin can review; expiry releases seats | Chosen demo resolution; bank service simulated | TC-08; automated pending/retry/expiry/cancellation tests |
| Case cancellation / FR-08, Q-03/Q-05 | Prototype cancellation described in handoff README | My bookings cancels individual confirmed seats; remaining seats stay booked; full per-seat simulated refund and notification | Refund policy is a documented demo choice, not confirmed real policy | TC-09; automated partial/full/idempotent refund tests |
| FR-09: manager schedules and reports | Manager dashboard described in handoff README | Bookings & reports metrics, reservation records, cancellation, and departure editor | Sample browser-local report; no real multi-user data | TC-10 legacy result; automated workflow checks; updated browser edit pending |
| Case: admin payment, route and vehicle maintenance; FR-10, BR-06 | Admin console described in handoff README | Administration adds/edits/deactivates/reactivates/deletes routes; Payments reviews pending bank PIN and cancels payment with reason | Account-management conflict resolved by keeping customer credentials out of staff screens | TC-11/12 legacy results; automated admin review/cancellation and route protections |
| SR-04 / Q-04: admin payment and audit logs | Audit/payment logs described in handoff README | Admin Payments displays events, gross/refunds/net; Audit log stores actor, action, timestamp, details | Client-side logs are not tamper-proof; old events cannot be reconstructed | TC-13 legacy result; automated role restriction and audit checks |
| NFR-01: usable smartphone browser | Responsive Browse and brand navigation | Responsive cards, dialogs, two-column mobile navigation, keyboard focus handling | No installed app required; updated browser layout check pending | TC-14 legacy result; new 390/1440 px checks pending |
| NFR-05: dashboard data at most five minutes old | Dashboard refresh described in handoff README | Local dashboard rerenders every 15 seconds | Local sample data only; no live external dashboard | Code inspection; browser check pending |
| NFR-02/03/04; retention constraint C-04; IR-02/03 | Handoff requests transaction speed, 200 users, uptime, database/route feed and one-year records | Browser storage, sample routes and local workflow simulation | Real performance/load/uptime, server database/feed, encryption and 12-month retention guarantees deferred; not claimed met | Documented limitation; no production/load test claimed |

The original interview conflicts on admin account permissions: FR-10 mentions managing user accounts, but the interview evidence blocks admin access to customer accounts. The demo honors the restricted-account interpretation; account recovery is customer-facing. This remains an explicit stakeholder clarification.

## 4. Prototype decision record

These decisions document the final approach based on the inspected paired prototype; they are not a claim about when individual members originally made them.

| Decision | Original prototype screen/control | Final implementation | Rationale |
|---|---|---|---|
| Retained | Browse page: SMDC Travels branding, route names, Indian rupee fares and seat availability | SMDC branding, INR fares, public route cards and seat counts | Preserves recognizable customer-facing continuity and the case's bus-search goal. |
| Adapted | Browse lists many date/time departure buttons under each route and offers FROM/TO filters | One travel-date field and From/To search, followed by compact departure cards | Keeps route/date/departure choice while reducing the amount of sample data shown at once. |
| Not carried forward | Browse includes price/distance sorting and a dark-mode toggle | Consistent single theme and focused route search | Prioritizes the assigned booking, payment, cancellation and staff workflows; sorting/theme switching are outside this demo's core scope. |

Prototype feature descriptions beyond the visually inspected Browse screen come from the paired handoff README and must not be presented as independently tested original-prototype workflows.

## 5. GenAI development log

See `AI_DEVELOPMENT_LOG.md`. The team must supply three **actual VS Code AI prompts**, the response/code change, human review or revision, and verification. This Codex Work session is disclosed separately and cannot stand in for evidence of a VS Code session.

## 6. Tests and limitations

See `TEST_PLAN.md`. Preserve the team's 15 recorded legacy Pass results; attach the original human tester/date/browser details when known. Twenty automated workflow tests pass for the updated source; they do not replace actual browser interaction/responsive checks.

Simulation policies:
- Five-minute holds start immediately at seat selection and do not renew when more seats are selected.
- Pending reservations have no charge; they may be retried/cancelled and otherwise expire.
- Confirmed-seat cancellation simulates a full per-seat refund to the original demo payment; the real refund mechanism remains open.
- Recovery links and notifications appear on screen; no real email or identity verification.
- Admin can manage payment records without accessing stored customer account credentials.
- External bank/route services, shared database/locking, production security/load/uptime and guaranteed 12-month retention remain deferred.

## 7. Team walkthrough recording

Recording is still required from the group:
- MS Teams recording URL: **Pending group recording.**
- Instructor/TA access verification: **Pending real access check.**
- Actual member contributions and spoken sections: **Group must confirm.**

`DEMO_SCRIPT.md` proposes a three-member walkthrough; proposed assignments are not a record of work already performed. Every member must speak and explain a feature, code contribution, test, or design decision. Only one member submits the final Word document.
