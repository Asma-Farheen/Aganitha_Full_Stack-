# Video Walkthrough Script for TinyLink

**Duration:** ~3-5 minutes
**Goal:** Demonstrate all core features and code structure.

## 1. Introduction (0:00 - 0:30)
- **Say:** "Hi, this is my submission for the TinyLink take-home assignment. I've built a full-stack URL shortener using Next.js 15, Tailwind CSS, and Prisma with PostgreSQL."
- **Show:** The Dashboard homepage (http://localhost:3000).
- **Highlight:** The premium dark theme, glassmorphism design, and responsive layout.

## 2. Feature Demo: Create Link (0:30 - 1:30)
- **Action:** Copy a long URL (e.g., a Google search result or news article).
- **Action:** Paste it into the "Target URL" field.
- **Action:** Enter a custom code (e.g., `demo123`) or leave it blank for auto-generation.
- **Action:** Click "Create Short Link".
- **Show:** The success message and the new link appearing in the table below.
- **Mention:** "The app validates the URL and ensures custom codes are unique."

## 3. Feature Demo: Redirect & Stats (1:30 - 2:30)
- **Action:** Click the "Copy" button for the new link.
- **Action:** Open a new tab and paste the short link (e.g., `localhost:3000/demo123`).
- **Show:** The redirect happening.
- **Action:** Go back to the dashboard and wait 5 seconds (or refresh).
- **Show:** The "Clicks" count incrementing and "Last Clicked" updating.
- **Action:** Click the "Stats" icon (or navigate to `/code/demo123`).
- **Show:** The dedicated stats page with the cards for Clicks, Date, etc.

## 4. Feature Demo: Delete & Health (2:30 - 3:30)
- **Action:** Go back to the dashboard.
- **Action:** Click the "Delete" (trash) icon for a link.
- **Show:** The link disappearing from the table.
- **Action:** Try to visit that deleted short link again.
- **Show:** The 404 "Link not found" page.
- **Action:** Briefly show the `/healthz` endpoint in the browser to prove it returns JSON `{ ok: true }`.

## 5. Code Walkthrough (3:30 - 5:00)
- **Switch to VS Code.**
- **Show `schema.prisma`:** Explain the simple `Link` model.
- **Show `app/api/links/route.ts`:** Briefly explain the POST (create) and GET (list) logic.
- **Show `app/[code]/route.ts`:** Explain the redirect logic (finding the link, updating clicks, returning 302).
- **Show `app/page.tsx`:** Mention it's a Server Component (or Client Component) using React hooks for state.
- **Mention:** "I also included an automated test script `scripts/test-submission.js` that verifies all endpoints."

## 6. Conclusion
- **Say:** "That covers all the requirements including the optional search filter and extra credit automated tests. Thanks for watching!"
