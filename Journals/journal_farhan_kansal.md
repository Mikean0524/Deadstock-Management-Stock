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

## Week 6 (Sep 7 - Sep 13): Final Diagram Touch-Ups (in progress)
- Updated the DFD image again to reflect the finalized model: five data stores (Inventory, Verification Records, Listings, Transactions, Vendors/Buyers) and five processes (Manage Inventory, Verify & Publish, Browse & Purchase, Compliance Review, Compute Metrics).
