# Proposed MS Teams walkthrough

This is a suggested recording plan, not a claim that these contributions or the recording have already occurred. Adapt the speaker assignments to the work each member actually performed.

## Before recording

1. Use the final published URL after approved deployment; keep repository source and the completed Word deliverables open.
2. Use fictional demo data only. Prepare a route with available seats.
3. Confirm each member can explain their assigned code, requirement, test or design decision.
4. Use actual VS Code prompt examples from the group's history.
5. After recording, check that both instructor and TA can access the link.

## Speaker 1 — suggested Faiz: introduction and customer journey (2–3 minutes)

- Identify Group 5, Case 5, SMDC Travels, and the Customer/Manager/Admin/Bank roles.
- Explain the manual paper-chart/bank-PIN process and the purpose of the browser demonstration.
- Show public route search, including one same-city or no-result exception.
- Log in as customer@demo.test / Demo123!, select two seats, and point out the immediate countdown and window/aisle hints.
- Try an incorrect six-digit PIN, then 246810; show confirmation, receipt and My bookings.

## Speaker 2 — suggested Liam: exceptions and staff operations (2–3 minutes)

- Cancel one of the booked seats. Show that the other stays booked and the demo refund/notification is recorded.
- Create a bank-unavailable pending reservation, then retry with the available bank and correct PIN.
- Log in as manager@demo.test / Demo123!. Explain booking/seat/revenue metrics, records, and departure editing.
- Explain that data is local to this browser and that real concurrency, payment and email are simulated.

## Speaker 3 — suggested Luke: admin, decisions and AI review (2–3 minutes)

- Log in as admin@demo.test / Demo123!. Open Payments; show payment events and reason-required cancellation on a disposable demo booking.
- Show Administration, protection against deleting a booked route, and the audit trail.
- Point to one interview requirement in the traceability map and one source function implementing it.
- Explain one retained prototype idea and one adaptation/omission from the decision record.
- Show one actual VS Code AI prompt, the reviewed code change and verification. Briefly show automated test results and distinguish these from browser testing.
- Explain the five-minute hold and full per-seat simulated refund as documented demo choices.

## Close and submission

- State the remaining production limitations without claiming bank/email/security integrations.
- Every member states their actual contribution.
- Paste the real Teams recording link and instructor/TA access check into section 7 of the final Word document.
