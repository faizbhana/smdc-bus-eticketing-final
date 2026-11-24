# GenAI development log

## VS Code AI use

Faiz Bhana confirmed on November 24, 2026 that he used the VS Code AI prompts supplied during development and checked the website successfully. The mobile entries below are concise paraphrases of the earlier instructions. The README entry reproduces the supplied prompt. Review statements describe the reported website check and verified project changes; they do not claim unreported manual code edits.

| VS Code prompt and purpose | AI response / code change | Human review or revision | Verification |
|---|---|---|---|
| Mobile layout — concise paraphrase: Review index.html and styles.css. Make navigation, search, route cards, seat selection, booking, and dashboards responsive at 390 px. Use media queries, preserve desktop layout and JavaScript, and explain the changes and testing. | The accepted responsive implementation includes a two-column mobile navigation layout in styles.css. The mobile change is recorded in commit 4a23075. | Faiz used the supplied prompt in VS Code and accepted the responsive result. He checked the website and reported that it worked. No specific manual CSS correction was reported. | Faiz reported a successful website check on November 24, 2026. Separately, the published Explore page was checked at 390 px and 1440 px; its navigation fit and there was no horizontal page overflow. |
| Mobile follow-up — concise paraphrase: Review styles.css and index.html again. Verify the layout at 390 px, fix responsive problems without changing desktop layout or JavaScript, and explain how to verify it in Chrome DevTools. | This was a follow-up review of the mobile implementation. The final accepted CSS uses a two-column navigation layout below 700 px. A separate code change is not attributed to this prompt. | Faiz confirms he used the suggested VS Code prompts and checked the resulting website. The follow-up was used to check the mobile result rather than to add an unrelated feature. | The final mobile navigation occupied two rows in the automated browser review. Faiz also reported that the website worked; his exact viewport and browser version were not recorded. |
| README correction: Rewrite README.md to accurately describe our ISM 3113 Group 5 final project using index.html, app.js, styles.css, and TEST_PLAN.md. Include our final website and repository URLs, actual demo credentials, PIN, implemented features, instructions, and limitations. Identify Group 12's website only as the original prototype reference. Remove claims about features or files that do not exist. Modify only README.md. | AI rewrote the README for the final project, corrected the final-site link and demo accounts/PIN, removed obsolete feature/file claims, and identified the paired prototype as a reference. The initial correction is recorded in commit 9bd9a79. | Faiz identified that the README still linked to the old prototype and used the supplied prompt to correct it. The corrected version was retained when resolving the branch conflict. Later documentation updates reflect the added final features. | The current main README points to the published Group 5 site, lists the three @demo.test accounts with Demo123!, and uses payment PIN 246810. Its features were compared with the published implementation. |

### Human verification

Faiz Bhana checked the website and reported that it worked fine on November 24, 2026. His exact browser version, viewport, and a separate observed result for every new test case were not recorded. Specific 390 px / 1440 px observations and detailed workflow results in TEST_PLAN.md are identified separately as Codex browser checks.

## Additional development assistance — Codex Work, November 24, 2026

Additional fixes were completed in Codex Work after the VS Code changes. This work is disclosed separately from the three examples above.

- Added immediate seat holds and countdowns; pending-payment retry/cancellation; simulated notifications/refunds; targeted recovery; fictional-ID persistence; admin payment review/cancellation/event logs; and migration of existing browser records.
- Preserved the correct README, mobile styling, and original 15 recorded Pass results while resolving the branch conflict.
- Ran JavaScript syntax validation and 20 automated workflow tests, all passing. These execute actual application functions with isolated state and a DOM stub.
- Checked the updated live customer booking, wrong PIN, payment retry, individual-seat refund, lockout/recovery, admin payments/cancellation/audit, and responsive Explore navigation. Detailed results and remaining checks appear in TEST_PLAN.md.
