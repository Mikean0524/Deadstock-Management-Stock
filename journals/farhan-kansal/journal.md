# Weekly Progress Journal — Farhan Kansal (Roll No: 1024030451)

**Project Name:** Deadstock Management System (Verified Retail Deadstock Marketplace)
**Role:** Diagram & Modeling Lead (Use Case Diagram, DFD)

---

## Week 1 (Aug 3 - Aug 9): Project Selection
- Participated in group brainstorming with Aryan Gupta and Abhilakshya Puri for project selection.
- Helped settle on the problem statement: an estimated 20-30% of retail inventory value sits idle as slow-moving/dead stock annually, and a verified marketplace (list → verify → publish → purchase) could recover it.

## Week 2 (Aug 10 - Aug 16): Workflow Study
- Studied the list → verify → publish → purchase workflow from the report draft to prepare for diagram modeling.

## Week 3 (Aug 17 - Aug 23): Diagram Planning
- Planned the diagram set needed for the report: a Use Case Diagram covering inventory logging, aging alerts, verification submission, regulated-item escalation, marketplace browsing, and purchase/rating flows, plus a two-level Data Flow Diagram.

## Week 4 (Aug 24 - Aug 30): First-Draft Diagrams
- Built and uploaded the first drafts of the Use Case Diagram and the Data Flow Diagram (Level 0 context diagram + Level 1 breakdown) to the `diagrams/` folder.

## Week 5 (Aug 31 - Sep 6): Diagram Revisions
- Revised the diagrams after team review: replaced the first-draft Use Case Diagram and DFD image with corrected versions, making sure the regulated-item Compliance Review path stays a distinct `<<extend>>` use case and a separate DFD process (4.0) rather than merging with the auto-pass path for non-regulated items.
- Removed the outdated diagram files once the corrected versions were confirmed.

## Week 6 (Sep 7 - Sep 13): Verification, Admin Review & Marketplace Prototype
- Took ownership of the Person 3 prototype module: verification proof submission, deterministic rule checks, compliance/manual review, verified-only listing publication, and marketplace browsing.
- Implemented the verification rule engine to return `PASS`, `REJECT`, or `MANUAL_REVIEW`, including proof, required-field, quantity, deadstock-eligibility, and regulated-category checks.
- Added vendor proof-upload and verification-submission APIs, an admin queue with approve/reject decisions, and the server-side rule that prevents publication until a verification record is `VERIFIED`.
- Built the Person 3 Admin Review and Buyer Marketplace React/Tailwind screens, plus API adapters ready to connect to the shared frontend.
- Added Person 3 Postman requests, GitHub Actions CI coverage, API/unit tests, and seed data for a verified marketplace listing and a regulated item awaiting admin review.
- Integrated the module against the shared Prisma, JWT, inventory, and aging contract after the backend foundation was completed; the combined test suite passed 18 tests.
