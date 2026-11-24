# ISM 3113 Final Project — Group 5 Deliverables Worksheet

**System:** SMDC Travels E-Ticketing for Buses (Case 5)  
**Members:** Faiz Bhana · Liam Gordy · Luke Jackson

This worksheet records our final implementation, design decisions, AI use, and testing. It supplies the content for the project's seven-deliverables Word submission.

## 1. Published application

- Final website: https://faizbhana.github.io/smdc-bus-eticketing-final/
- Source repository: https://github.com/faizbhana/smdc-bus-eticketing-final/
- Hosting member: Faiz Bhana.
- Publication: Pull request #1 was merged, and GitHub Pages deployed the updated site successfully on November 24, 2026. Runtime assets use a version suffix to load matching code and styling.
- Public access: The updated published site opened without GitHub sign-in during the November 24 browser review. Customer payment/retry/refund, recovery, and admin payment workflows were checked.
- Human verification: Faiz Bhana checked the website and reported that it worked fine on November 24, 2026. His exact browser version and viewport were not recorded.

## 2. Source files and README

Runtime files are at the repository root: `index.html`, `styles.css`, and `app.js`. Supporting files: `README.md`, `TEST_PLAN.md`, `tests/workflows.test.cjs`, `AI_DEVELOPMENT_LOG.md`, and `DEMO_SCRIPT.md`.

The README identifies the actual final site, demo credentials/PIN, role-specific features, run/test instructions, simulations, and limitations.

## 3. Requirements traceability map

Sources: Case 5, Chapter 5.1 and UML Figures 5.1–5.11 in *UML Diagramming: A Case Study Approach* (printed pages 75–84); Group 12 requirements interview, dated September 24, 2026, version 1.0; paired prototype https://theom720.github.io/smdc-bus-eticketing/ (screens inspected during the November 23–24 review). The case defines scope; interview details and unresolved conflicts are handled below.

| Case / interview behavior | Paired prototype reference | Final screen / behavior | Status and limitation | Test evidence |
|---|---|---|---|---|
| FR-01, DR-01: register customer identity | Register control | Register dialog accepts name, email, password, fictional ID; rejects duplicate email and invalid fictional ID | Local simulation; ID/password not production-secure | Automated registration tests passed; Faiz reported an overall successful website check. A separate new-account/ID browser result was not recorded. |
| FR-02/03, SR-01/03, IR-04: login, lockout, recovery | Log in / Register navigation | Guest can browse; booking needs customer login; fifth failure locks; Demo account recovery shows an unlock email/link on screen | Simulated password authentication and recovery; no actual email | TC-03/04/05 recorded Pass; automated tests; live lockout, blocked correct login, recovery and login passed. |
| Case: check buses, schedules, availability; FR-04 | Available schedules, FROM/TO filters, departure buttons, fares | Explore search and sample route cards show date, departure, fare and remaining seats; expired departures excluded | Five sample services; no live ITC feed | TC-01/02; browser invalid/empty search checks on prior deployment |
| FR-05/06, BR-02/03, DR-03: seat availability and hold | Date/departure selection before booking | Seat map with window/aisle hints; first selection immediately starts fixed five-minute hold and visible countdown | Local browser only; exact hold duration remains a demo assumption | Automated hold/limit/release/expiry/capacity tests passed; live countdown showed 5:00 then 4:50 before checkout. |
| Case payment PIN / FR-07, BR-04, IR-01 | Prototype payment PIN workflow described in handoff README | Checkout rejects wrong PIN; demo PIN 246810 confirms, creates receipt and on-screen notification | Simulated bank approval; no actual transfer/email | TC-06/07 recorded Pass; automated tests; live wrong-PIN rejection and correct-PIN confirmation passed. |
| BR-05, Q-02: bank unavailable and resolution | Earlier prototype handoff describes pending reservations | Bank unavailable creates pending/no-charge record; customer can retry/cancel; admin can review; expiry releases seats | Chosen demo resolution; bank service simulated | TC-08 recorded Pass; automated tests; live pending reservation retried with the same booking reference. |
| Case cancellation / FR-08, Q-03/Q-05 | Prototype cancellation described in handoff README | My bookings cancels individual confirmed seats; remaining seats stay booked; full per-seat simulated refund and notification | Refund policy is a documented demo choice, not confirmed real policy | TC-09 recorded Pass; automated tests; live booking retained one seat at 620 INR with a 620 INR simulated refund. |
| FR-09: manager schedules and reports | Manager dashboard described in handoff README | Bookings & reports metrics, reservation records, cancellation, and departure editor | Sample browser-local report; no real multi-user data | TC-10 legacy result; automated workflow checks; updated browser edit pending |
| Case: admin payment, route and vehicle maintenance; FR-10, BR-06 | Admin console described in handoff README | Administration adds/edits/deactivates/reactivates/deletes routes; Payments reviews pending bank PIN and cancels payment with reason | Account-management conflict resolved by keeping customer credentials out of staff screens | TC-11/12 legacy results; automated admin review/cancellation and route protections |
| SR-04 / Q-04: admin payment and audit logs | Audit/payment logs described in handoff README | Admin Payments displays events, gross/refunds/net; Audit log stores actor, action, timestamp, details | Client-side logs are not tamper-proof; old events cannot be reconstructed | TC-13 recorded Pass; automated tests; live payment events/totals and admin cancellation audit entry verified. |
| NFR-01: usable smartphone browser | Responsive Browse and brand navigation | Responsive cards, dialogs, two-column mobile navigation, keyboard focus handling | No installed app required; updated Explore navigation checked at desktop and mobile widths. | TC-14 recorded Pass; live Explore page checked at 390/1440 px without horizontal page overflow. Exhaustive dialog/staff checks not recorded. |
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

Faiz confirms using the supplied prompts in VS Code. The table records three representative examples; the first two are concise paraphrases of the mobile instructions. See `AI_DEVELOPMENT_LOG.md` for the same log and the separate disclosure of later Codex Work assistance.

| VS Code prompt and purpose | AI response / code change | Human review or revision | Verification |
|---|---|---|---|
| Mobile layout — concise paraphrase: Review index.html and styles.css. Make navigation, search, route cards, seat selection, booking, and dashboards responsive at 390 px. Use media queries, preserve desktop layout and JavaScript, and explain the changes and testing. | The accepted responsive implementation includes a two-column mobile navigation layout in styles.css. The mobile change is recorded in commit 4a23075. | Faiz used the supplied prompt in VS Code and accepted the responsive result. He checked the website and reported that it worked. No specific manual CSS correction was reported. | Faiz reported a successful website check on November 24, 2026. Separately, the published Explore page was checked at 390 px and 1440 px; its navigation fit and there was no horizontal page overflow. |
| Mobile follow-up — concise paraphrase: Review styles.css and index.html again. Verify the layout at 390 px, fix responsive problems without changing desktop layout or JavaScript, and explain how to verify it in Chrome DevTools. | This was a follow-up review of the mobile implementation. The final accepted CSS uses a two-column navigation layout below 700 px. A separate code change is not attributed to this prompt. | Faiz confirms he used the suggested VS Code prompts and checked the resulting website. The follow-up was used to check the mobile result rather than to add an unrelated feature. | The final mobile navigation occupied two rows in the automated browser review. Faiz also reported that the website worked; his exact viewport and browser version were not recorded. |
| README correction: Rewrite README.md to accurately describe our ISM 3113 Group 5 final project using index.html, app.js, styles.css, and TEST_PLAN.md. Include our final website and repository URLs, actual demo credentials, PIN, implemented features, instructions, and limitations. Identify Group 12's website only as the original prototype reference. Remove claims about features or files that do not exist. Modify only README.md. | AI rewrote the README for the final project, corrected the final-site link and demo accounts/PIN, removed obsolete feature/file claims, and identified the paired prototype as a reference. The initial correction is recorded in commit 9bd9a79. | Faiz identified that the README still linked to the old prototype and used the supplied prompt to correct it. The corrected version was retained when resolving the branch conflict. Later documentation updates reflect the added final features. | The current main README points to the published Group 5 site, lists the three @demo.test accounts with Demo123!, and uses payment PIN 246810. Its features were compared with the published implementation. |

## 6. Tests and limitations

See `TEST_PLAN.md`. The original 15 recorded Pass results are preserved. On November 24, 2026, Faiz Bhana confirmed that he checked the website and it worked fine. This is an overall human verification; an exact browser version, viewport, and separate results for every updated test case were not supplied.

Twenty automated workflow tests and the JavaScript syntax check passed. The updated published site also passed live browser checks for booking, wrong-PIN rejection, payment retry, partial refunds, lockout/recovery, admin payments/cancellation/audit, and Explore navigation at 390 px and 1440 px. These observations are recorded separately from Faiz's overall check.

Remaining targeted browser checks: new-account/ID validation, full wall-clock pending expiry, pending cancellation, admin pending-payment approval, abandoned-hold release, updated schedule/route editing, receipt-dialog details, and exhaustive mobile/staff/dialog keyboard checks. These are not claimed as independently observed updated-version results.

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
- Confirmed Faiz Bhana contribution: used the supplied VS Code AI prompts, checked the website, identified the old README link, and coordinated repository/publication work. Codex-assisted fixes are disclosed in the AI development log.
- Liam Gordy: actual implementation/testing contribution and spoken section still to be supplied by the group.
- Luke Jackson: actual implementation/testing contribution and spoken section still to be supplied by the group.

`DEMO_SCRIPT.md` proposes a three-member walkthrough; proposed assignments are not a record of work already performed. Every member must speak and explain a feature, code contribution, test, or design decision. Only one member submits the final Word document.
