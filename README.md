# SMDC Travels — Group 5 Bus E-Ticketing (ISM 3113, Fall 2026)

Browser-based classroom implementation of **Case 5: Design of UML Diagrams for E-Ticketing for Buses**, informed by the Group 12 interview handoff (Assignment 4). Contributors: **Faiz Bhana, Liam Gordy, Luke Jackson**. Assign actual module ownership in the course submission only after the team verifies each person's work.

## Run the site

Open `index.html` locally, or publish the whole folder to GitHub Pages. The entry file links `css/styles.css` and `js/app.js` with relative paths, so no build step is needed.

## Demo accounts (ONLY fictional credentials)

| Role | Email | Password |
|---|---|---|
| Customer | `customer@demo.test` | `Demo123!` |
| Manager | `manager@demo.test` | `Demo123!` |
| Admin | `admin@demo.test` | `Demo123!` |

At payment enter **246810** as the fake approved PIN. Any other six-digit PIN is rejected. Choose **Bank unavailable** to place a reservation in pending status and demonstrate a temporary hold.

## Implemented interactions

- View routes and departure times as a guest; filter by origin, destination, and travel date.
- Register a fictional demo customer; log in/out; simulated lockout after five incorrect passwords.
- View seat maps, select up to four seats, and set a five-minute temporary seat hold in the current browser.
- Simulated bank PIN approval, rejection, and bank-down pending state; generate on-screen confirmation and receipt.
- View booking records and cancel individual seats, releasing them for a later reservation in the current browser.
- Manager role: monitor sample utilization, booking records, cancel bookings, change departure times.
- Admin role: monitor operations, add/edit/deactivate/reactivate/delete routes, change vehicle/capacity, view audit log. Prevent deleting a route with active reservations.
- Field validation, errors, empty states, accessible labels, and responsive layout.

## Important limitations

**This is NOT a live transportation, banking, or account-management system.** Bank API, PINs, emails, password recovery, Indian Tourist Center data feed, and database are all **simulated**, and **no money, email, or SMS is sent**. Login credentials are intentionally hardcoded as public fake demo data. The browser's localStorage holds all routes, users, holds, and bookings; there is no multi-user synchronization, production password security, shared seat inventory, real payment encryption, or server-side persistence. It cannot demonstrate true 200-concurrent-user load, under-one-minute server response, or measured 99.5% uptime. Use only made-up details. Do not enter a real password, government ID, or payment credential.

The interview references both 5 and 10 minutes for unpaid holds and leaves the exact value open. **This prototype uses five minutes as a clearly labeled assumption.** A bank-outage reservation stays pending until that hold expires, then becomes expired. The resolution workflow is still a stakeholder question. Refunds are not processed.

The interview contains conflicting descriptions of admin permissions to customer accounts. This demo does not permit admin access to customer account data; administrative access focuses on routes, vehicles and an audit trail. Verify this interpretation with the stakeholder before claiming it is a confirmed rule.

## Hosting on GitHub Pages

1. Create a new GitHub repository, for example `smdc-bus-final-group5`.
2. Upload `index.html`, `css/styles.css`, `js/app.js`, and this `README.md`, preserving folder paths.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**; save.
4. Once published, open the Pages URL in a signed-out/private browser. Test navigation, login, one reservation and payment, cancellation, and staff dashboard.
5. Put the actual published URL and repository URL into Deliverable 1. Do not reuse the **paired team's** site as your own final submission.

## Testing

Use `TEST_PLAN.md` and record **your team's actual observed outcomes and browser sizes** for Deliverable 6. Do not represent suggested test cases as completed evidence. Document three actual VS Code AI prompts and human reviews for Deliverable 5.

## Requirements and provenance

Case 5 UML diagrams define scope; Group 12's Systems Requirements Interview & Specification Template adds stakeholder details. Group 12's [prototype URL](https://theom720.github.io/smdc-bus-eticketing/) and [README](https://github.com/theom720/smdc-bus-eticketing/blob/main/README.md) were provided as handoff references, but they were not accessible for code/screen review in this build environment. **Do not claim specific elements were retained, adapted, or rejected until the group has directly inspected the paired prototype.**
