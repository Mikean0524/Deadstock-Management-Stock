# Weekly Progress Journal — Abhilakshya Puri (Roll No: 1024030445)

**Project Name:** Deadstock Management System (Verified Retail Deadstock Marketplace)
**Role:** Journal Documentation Lead, QA / CI Setup

---

## Week 1 (Aug 3 - Aug 9): Project Selection
- Participated in group brainstorming with Aryan Gupta and Farhan Kansal for project selection.
- Helped settle on the problem statement: an estimated 20-30% of retail inventory value sits idle as slow-moving/dead stock annually, and a verified marketplace (list → verify → publish → purchase) could recover it.

## Week 2 (Aug 10 - Aug 16): Early Report Review
- Reviewed the early LaTeX report draft and proposal scope for internal consistency ahead of finalization.

## Week 3 (Aug 17 - Aug 23): Presentation Review
- Reviewed the `Deadstock_Management_System.pptx` deck and `Report SE lab.pdf` before submission for feedback.

## Week 4 (Aug 24 - Aug 30): Report Consolidation
- Consolidated and uploaded `MainDeadstockManagement.pdf`, bringing the report content into a single reference document ahead of the team's diagram-modeling session.

## Week 5 (Aug 31 - Sep 6): Journal Entry & CI Scoping
- Wrote up Journal Entry No. 1, documenting the team's finalized actors/workflow, the Use Case Diagram and DFD decisions, the rule-based verification approach, the regulated-item compliance routing, and the open question on where buyer ratings should live (Verification Records vs. a separate Feedback store).
- Created a scratch test file to scope out the CI setup (build + unit tests + lint) called out as a next step, then removed it once the approach was validated.

## Week 6 (Sep 7 - Sep 13): CI Pipeline (in progress)
- Starting CI pipeline setup (build, unit tests, lint) per Section 9.1 of the report.
- Drafting backend schema notes for the five data stores identified in the DFD (Inventory, Verification Records, Listings, Transactions, Vendors/Buyers).
