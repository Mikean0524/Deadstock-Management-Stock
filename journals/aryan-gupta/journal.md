# Weekly Progress Journal — Aryan Gupta (Roll No: 1024030455)

**Project Name:** Deadstock Management System (Verified Retail Deadstock Marketplace)
**Role:** Proposal & Report Lead (LaTeX), Presentation Design

---

## Week 1 (Aug 3 - Aug 9): Project Selection
- Participated in group brainstorming with Abhilakshya Puri and Farhan Kansal for project selection.
- Helped settle on the problem statement: an estimated 20-30% of retail inventory value sits idle as slow-moving/dead stock annually, and a verified marketplace (list → verify → publish → purchase) could recover it.

## Week 2 (Aug 10 - Aug 16): Report Drafting
- Set up the LaTeX project (`main.tex`) for the UCS503P project report.
- Drafted the initial Problem Statement and Project Scope sections, framing the solution as a scalable marketplace/workflow system rather than an ML research project.

## Week 3 (Aug 17 - Aug 23): Report Finalization & Presentation
- Finalized and uploaded `Report SE lab.pdf`.
- Built the `Deadstock_Management_System.pptx` deck to present the proposal for review, summarizing the vendor → buyer → compliance-reviewer workflow.

## Week 4 (Aug 24 - Aug 30): Actor & Workflow Definition
- Collaborated with the team to finalize the core actors (Vendor, Buyer, Compliance Reviewer) and the list → verify → publish → purchase loop ahead of diagram modeling.

## Week 5 (Aug 31 - Sep 6): Scope Consistency Check
- Reviewed the team's Use Case Diagram / DFD decisions against the report to keep them consistent, confirming verification stays rule-based/checklist-driven (no ML) per the report's non-research scope constraint.
- Cross-checked that regulated-category listings correctly route through the separate Compliance Review process before publishing.

## Week 6 (Sep 7 - Sep 13): Backend Prototype Implementation

### Aryan's Work Timeline

- Sep 8, 09:00 - Reviewed the project documents, repository structure, and Person 2 backend responsibilities.
- Sep 8, 11:00 - Added the shared Prisma schema, relations, enums, indexes, and PostgreSQL migration.
- Sep 8, 12:00 - Added JWT authentication, role middleware, register/login/me endpoints, and bcrypt password hashing.
- Sep 9, 10:30 - Implemented vendor-owned inventory CRUD APIs with Zod validation and centralized error handling.
- Sep 9, 13:15 - Added aging and deadstock calculation, lifecycle timestamps, filtered endpoints, and demo seed data.
- Sep 10, 09:45 - Connected the Person 2 foundation with the Person 3 verification and listings routes and fixed TypeScript integration issues.
- Sep 10, 12:00 - Added authentication, authorization, inventory, aging, and API tests; all 15 tests passed.
- Sep 11, 10:00 - Verified Prisma schema, TypeScript compilation, production build, and documented setup commands and demo accounts.
- Sep 11, 11:30 - Organized the completed work into focused Aryan commits for authentication, database, inventory, testing, and documentation. Push remains pending until GitHub write access is available.
