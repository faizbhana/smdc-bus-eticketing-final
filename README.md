# SMDC Travels - ISM 3113 Final Project

SMDC Travels is Group 5's browser-based bus e-ticketing prototype for the ISM 3113 final project. It demonstrates route search, seat selection, simulated reservations and role-based customer and staff screens. The application uses plain HTML, CSS and JavaScript; it needs no build step or server-side service.

## Links

- **Final website:** [https://faizbhana.github.io/smdc-bus-eticketing-final/](https://faizbhana.github.io/smdc-bus-eticketing-final/)
- **GitHub repository:** [https://github.com/faizbhana/smdc-bus-eticketing-final](https://github.com/faizbhana/smdc-bus-eticketing-final)
- **Group 12 original prototype reference:** [https://theom720.github.io/smdc-bus-eticketing/](https://theom720.github.io/smdc-bus-eticketing/) - reference only; it is not Group 5's final website.

## Demo accounts

Use these seeded accounts to explore the role-specific screens:

| Role | Email | Password |
|---|---|---|
| Customer | `customer@demo.test` | `Demo123!` |
| Manager | `manager@demo.test` | `Demo123!` |
| Admin | `admin@demo.test` | `Demo123!` |

**Approved simulated payment PIN:** `246810`

These are public classroom credentials, not secure accounts. Do not enter real passwords, banking details, or government ID information.

## Implemented features

- Search five sample bus routes by origin, destination, and travel date. Route cards show departure details, fare, and available seats.
- Register a demo customer and sign in with the seeded customer, manager, or admin accounts. Five failed sign-ins lock an account. Demo account recovery displays a simulated unlock email and unlocks that account without resetting other data. Registration stores the fictional ID locally.
- Select up to four available seats. Selecting the first seat starts an immediate five-minute hold with a visible countdown. Additional selected seats share that original expiry. Closing unpaid checkout releases its hold.
- Complete simulated checkout with a passenger name and PIN. The approved PIN produces a confirmed booking and an on-screen receipt; choosing the bank-unavailable simulation creates a pending booking with no charge. Retry the payment before expiry, cancel it, or let it expire automatically.
- View customer bookings, receipts and on-screen demo notifications. Cancelling a confirmed seat records a full per-seat simulated refund to the original demo payment.
- View manager dashboard metrics and booking records, cancel bookings, and edit departure times.
- Use admin-only payment management to review pending payments using the demo PIN, cancel payments with a reason, and inspect confirmed/pending/rejected/refunded/cancelled/expired payment events and gross/refund/net totals. Manage routes and vehicles and review the local audit log. Customer accounts and passwords are not exposed in staff screens.
- Browse the About page for demo notes and reset the sample data.

## Run and test

1. Open the final website above, or open `index.html` from a local copy of the repository in a browser. No package installation or build command is required.
2. Search a route as a guest. Sign in with a demo account to try the corresponding customer or staff features.
3. For a customer booking, choose a route, select seats, enter a passenger name, and use PIN `246810` for the successful simulated payment. The bank-unavailable option demonstrates a pending booking.
4. Follow the scenarios in [`TEST_PLAN.md`](TEST_PLAN.md). It preserves the team's recorded results and separates them from automated checks and browser checks still required for the updated version.
5. With Node.js installed, run `node --check app.js` and `node --test tests/workflows.test.cjs`. The workflow tests execute real application functions in an isolated DOM/state stub; they do not replace browser layout testing.
6. To return to the seeded state, use **Reset sample data** on the About page.

The application files are [`index.html`](index.html), [`styles.css`](styles.css), and [`app.js`](app.js). The manual test checklist is [`TEST_PLAN.md`](TEST_PLAN.md).

## Scope and limitations

- This is a static, browser-only classroom prototype. Accounts, routes, bookings, holds, and audit entries are stored locally in the browser; they are not shared across browsers or users.
- Authentication is not production-secure. Demo credentials and account data are handled client-side, and the demo PIN is not real payment verification.
- No real payment, email, government-ID verification, server database, external route feed, or real refund processing is connected. Receipts and notifications are on-screen simulations.
- Five minutes is the documented demo choice within the interview's unresolved 5–10 minute hold range. A full per-seat simulated refund is a demo policy; the real policy remains unconfirmed. Pending reservations expire without a charge and can be retried before expiry.
- Recovery links appear on screen and can be used by anyone with the demo email; this is deliberately a classroom simulation, not proof of identity.
- Data is retained only while this browser's storage remains intact. A 12-month retention guarantee and shared multi-user locking require a server and are not claimed. Old browser records are preserved; payment events start being logged when the updated version is used.
- A five-minute hold is used for the demonstration. It is local to one browser and does not provide reliable multi-user seat locking.
- The project does not claim production security, concurrent booking support, or any uptime guarantee.

## Submission and walkthrough

See [DELIVERABLES_WORKSHEET.md](DELIVERABLES_WORKSHEET.md) for the seven deliverables and the traceability/decision records, [AI_DEVELOPMENT_LOG.md](AI_DEVELOPMENT_LOG.md) for the required actual VS Code prompt evidence, and [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for the proposed team recording sequence. The Teams recording, access check, and actual member contributions must be supplied by the group.
