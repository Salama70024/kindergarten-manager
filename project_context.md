Project Context: Kindergarten Management System (MVP)

1\. Project Overview

This is a Kindergarten Management System built for a private kindergarten client. The primary goal is to solve administrative pain points: tracking financial installments, monitoring consecutive student absences, and preventing direct parent-teacher communication by centralizing data. The current version is an MVP (Minimum Viable Product) designed for a successful stakeholder demo.



2\. Tech Stack \& Architecture

Framework: Next.js 14+ (App Router).



Language: JavaScript (ES6+).



Database: MongoDB Atlas (Cloud).



ORM: Mongoose (Schema-based modeling).



Styling: Standard CSS (globals.css) with a card-based dashboard layout. Note: Tailwind CSS was explicitly disabled during setup.



Deployment: Vercel (Frontend \& Serverless Functions).



HTTP Client: Axios (Client-side data fetching).



Architecture Decisions

Monolithic Structure: We utilize Next.js API Routes (src/app/api/...) to keep backend and frontend in a single repository for easy deployment.



Serverless Database Connection: We use a cached connection pattern (lib/db.js) to prevent exhausting MongoDB connection limits in a serverless environment (Vercel).



3\. Current Status \& Features

The application is currently live and functional as a Single Page Application (SPA) feel.



Fully Working Features:

Dashboard: Real-time calculation of Total Students, Cash Collected, Unpaid Debts, and Attendance Alerts.



Student Management: Complete CRUD (Add, List, Delete students).



Financial Tracking:



Tracks totalFees vs paidAmount.



Automatically updates status (Paid/Partial/Pending) based on payments.



Visual "Red/Green" indicators for debt.



Attendance System:



Tracks consecutiveAbsences.



Logic: If absences >= 2, triggers a "⚠️ CALL PARENT" visual alert.



Reset functionality when marked Present.



Deployment: Successfully deployed to Vercel with MongoDB Atlas integration.



Half-Finished / Mocked Features:

Authentication: Currently uses a frontend-only hardcoded gate (admin / admin123). This is NOT secure and does not protect API routes.



Payment UI: Uses window.prompt for entering payment amounts (Needs a proper modal).



Delete UI: Uses window.confirm for deletion confirmation (Needs a proper modal).



4\. Database Schema (Mongoose)

The Student model (src/models/Student.js) is the core entity:



JavaScript

{

&nbsp; name: String,

&nbsp; grade: String, // Enum: Nursery, Pre-KG, KG, Preparatory

&nbsp; totalFees: Number,

&nbsp; paidAmount: Number, // Default: 0

&nbsp; paymentStatus: String, // Pending, Partial, Paid

&nbsp; consecutiveAbsences: Number // Default: 0

}

5\. Coding Conventions \& Patterns

State Management: Use useState for local UI state (forms, list data) and useEffect for initial data fetching.



API Routes: Located in src/app/api/students.



route.js: Handles GET (List) and POST (Create).



\[id]/route.js: Handles PUT (Update Payment/Attendance) and DELETE.



Styling: Class-based CSS in globals.css. Do not use inline styles for complex components.



Environment Variables: MONGODB\_URI must be defined in .env.local (local) and Vercel Project Settings (production).



6\. Known Issues \& Technical Debt (High Priority)

Security Risk: API routes are currently unprotected. Anyone with the URL can trigger a DELETE or POST request. Immediate Next Step: Implement NextAuth.js or proper middleware protection.



UX Limitation: The window.prompt for payments is fragile and unprofessional. Replace with a ShadCN or custom Modal component.



Hardcoded Credentials: The login credentials are visible in the client-side bundle. This must be moved to server-side validation.



No Validation: There is no backend validation for negative numbers (fees) or invalid grades.



7\. The Roadmap (Next Steps)

Secure Authentication: Replace hardcoded auth with a real database-backed login system.



Receipt Generation: Add a feature to generate/print a PDF receipt when a payment is made.



Teacher Portal: Create a restricted view where teachers can only take attendance but cannot see financial data.



Audit Logs: Track who deleted a student or updated a payment.

