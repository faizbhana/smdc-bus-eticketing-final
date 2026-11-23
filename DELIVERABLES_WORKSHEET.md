# ISM 3113 Final Project — Group 5 Deliverables Worksheet

**System:** SMDC Travels E-Ticketing for Buses (Case 5)

**Members:** Faiz Bhana · Liam Gordy · Luke Jackson

## 1. Published application
GitHub Pages URL: [ADD ACTUAL URL]
Repository URL: [ADD ACTUAL URL]
Hosting member: [ADD NAME]
Public access verification, date and tester: [ADD AFTER CHECKING]

## 2. Source files and README
Source: index.html, css/styles.css, js/app.js, README.md. All within the repository. Verify on GitHub after upload.

## 3. Requirements traceability map

| Case / interview requirement | Prototype / final feature | Status | Evidence to record |
|---|---|---|---|
| FR-01 registration / user identity | Create demo account | Simulated locally | TC-04 and registration test |
| FR-02/03 login and five-failure lockout | Demo authentication | Simulated locally | TC-05 |
| FR-04 public bus schedules | Route search | Implemented with sample data | TC-01, TC-03 |
| FR-05 seat availability | Seat map | Simulated locally, not global | TC-06 |
| FR-06 seat holds | 5-minute temporary hold | Simulated; timeout assumption | TC-08 |
| FR-07 bank PIN validation / confirmation | Demo PIN + on-screen receipt | Simulated; no bank or email | TC-06, TC-07 |
| FR-08 cancellation | Cancel selected individual seat | Implemented locally | TC-09 |
| FR-09 manager bookings, schedule, reports | Manager dashboard | Implemented with sample data | TC-10 |
| FR-10 admin routes, vehicles, access | Admin dashboard | Implemented in limited demo scope | TC-11, TC-12 |
| BR-05 bank outage | Pending state | Simulated; pending resolution unspecified | TC-08 |
| SR-04 admin audit log | Browser-local audit records | Simulated; not tamper-proof | TC-13 |
| NFR-01 mobile browser | Responsive CSS | Verify on devices | TC-14 |
| NFR-02/03/04 transaction speed / concurrency / uptime | No real server | Deferred, cannot claim met | State limitations |

Check original Group 12 prototype to fill the *Prototype reference* column with accurate page/control names.

## 4. Prototype decision record
**Must inspect the earlier prototype first.**

| Decision | Original prototype screen/control | Final implementation | Why |
|---|---|---|---|
| Retained | [VERIFY] | [FILL] | [FILL] |
| Adapted | [VERIFY] | [FILL] | [FILL] |
| Not carried forward | [VERIFY] | [FILL] | [FILL] |

## 5. GenAI development log
Record **three real Visual Studio Code AI prompts** used by your team, the resulting code change, the specific human review/revision, and the test used to verify each. Do not invent a VS Code session or paste a raw chat transcript.

## 6. Tests and limitations
Use `TEST_PLAN.md`; enter actually observed results with dates, testers, browser sizes, status and fixes. Explain all simulation limitations openly.

## 7. Team walkthrough recording
MS Teams URL: [ADD ACTUAL LINK]
Instructor/TA access check: [ADD NAME AND DATE]

Suggested actual contribution statement, **revise to reflect work performed**:
- Faiz Bhana: [Describe actual owned code/requirements/testing and walkthrough section]
- Liam Gordy: [Describe actual owned code/requirements/testing and walkthrough section]
- Luke Jackson: [Describe actual owned code/requirements/testing and walkthrough section]

Only one team member submits the completed Word deliverables document. Do not list proposed work as completed contributions.
