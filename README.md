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
- Register a demo customer and sign in with the seeded customer, manager, or admin accounts. Repeated failed sign-ins lock an account in the local demo.
- Select up to four available seats. A selected seat is held for five minutes in this browser.
- Complete simulated checkout with a passenger name and PIN. The approved PIN produces a confirmed booking and an on-screen receipt; choosing the bank-unavailable simulation creates a pending booking.
- View customer bookings, show receipts, and cancel individual seats from confirmed bookings.
- View manager dashboard metrics and booking records, cancel bookings, and edit departure times.
- View admin dashboard tabs to manage routes and vehicles, view schedules, and review the local audit log.
- Browse the About page for demo notes and reset the sample data.

## Run and test

1. Open the final website above, or open `index.html` from a local copy of the repository in a browser. No package installation or build command is required.
2. Search a route as a guest. Sign in with a demo account to try the corresponding customer or staff features.
3. For a customer booking, choose a route, select seats, enter a passenger name, and use PIN `246810` for the successful simulated payment. The bank-unavailable option demonstrates a pending booking.
4. Follow the scenarios in [`TEST_PLAN.md`](TEST_PLAN.md). It is a manual test checklist; its actual-result fields are intentionally left for reviewers to complete.
5. To return to the seeded state, use **Reset sample data** on the About page.

The application files are [`index.html`](index.html), [`styles.css`](styles.css), and [`app.js`](app.js). The manual test checklist is [`TEST_PLAN.md`](TEST_PLAN.md).

## Scope and limitations

- This is a static, browser-only classroom prototype. Accounts, routes, bookings, holds, and audit entries are stored locally in the browser; they are not shared across browsers or users.
- Authentication is not production-secure. Demo credentials and account data are handled client-side, and the demo PIN is not real payment verification.
- No real payment, email, government-ID verification, server database, external route feed, or refund processing is connected. Receipts and notifications are on-screen simulations.
- A five-minute hold is used for the demonstration. It is local to one browser and does not provide reliable multi-user seat locking.
- The project does not claim production security, concurrent booking support, or any uptime guarantee.
