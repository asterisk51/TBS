# DocBook - Premium Healthcare Scheduling

DocBook is a modern, full-stack web application designed to streamline doctor appointment booking. It features a beautiful, responsive frontend for patients and a powerful dashboard for administrators to manage doctors and schedules.

![Home Page](screenshots/home.png)

##  Features

### For Patients (User)
-   **Browse Doctors**: View a list of available specialists.
-   **Interactive Scheduling**: Select a doctor to see their available dates and times.
-   **Date-wise Filtering**: specific slots are filtered by selecting a date.
-   **Instant Booking**: Book an appointment with a single click.

### For Administrators
-   **Dashboard Overview**: Manage all doctors and system status.
-   **Doctor Management**: Add new doctors with specialties.
-   **Slot Management**: 
    -   Select specific dates.
    -   Add multiple time slots in bulk.
-   **Crud Operations**: Delete doctors (cascading delete removes associated slots/bookings).

##  Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Version 4.0)
-   **UI Components**: Custom components with [Radix UI](https://www.radix-ui.com/) primitives.
-   **Icons**: [Lucide React](https://lucide.dev/).
-   **State/Data Fetching**: Axios, React Hooks.
-   **Animations**: Framer Motion.

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Validation**: Zod.

##  Architecture

The project follows a standard client-server architecture:

```mermaid
graph TD
    User[Client Browser] <-->|REST API| Server[Express Server]
    Server <-->|Prisma Client| DB[(PostgreSQL Database)]
    
    subgraph Frontend
        Router[React Router]
        Pages[Pages: Home, Admin, Booking]
        Comp[Components: UI, Modals]
    end
    
    subgraph Backend
        Routes[API Routes]
        Controllers[Business Logic]
        Prisma[Prisma ORM]
    end
```

### Directory Structure
```
d:\TBS\
├── backend\
│   ├── prisma\         # Database Schema & Seeds
│   ├── src\
│   │   ├── controllers # Request handlers
│   │   ├── routes      # API Endpoint definitions
│   │   ├── utils       # Helpers (DB Client)
│   │   └── server.ts   # Entry point
│   └── package.json
└── frontend\
    ├── src\
    │   ├── components  # Reusable UI components
    │   ├── pages       # Main views (AdminDashboard, BookingPage)
    │   ├── context     # Auth Context
    │   └── services    # API axios instance
    └── package.json
```

## Screenshots

### Booking Experience
Patients can easily select a doctor and view available slots for specific dates.

![Booking Page](screenshots/booking_page.png)

### Admin Dashboard
Administrators have a card-based layout to add doctors and manage existing ones.

![Admin Dashboard](screenshots/admin_dashboard.png)
![Admin List](screenshots/admin_list.png)

### Slot Management
A modal interface allows admins to pick a date and add multiple time slots efficiently.

![Manage Slots](screenshots/manage_slots.png)

##  Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL installed and running

### Installation

1.  **Clone the repository** (or navigate to project root).

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    
    # Configure .env with your DATABASE_URL
    # DATABASE_URL="postgresql://user:password@localhost:5432/docbook?schema=public"
    
    # Run migrations
    npx prisma db push
    
    # Seed database (Optional)
    npx ts-node prisma/seed.ts
    
    # Start server
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access App**
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:3000`

## 🔗 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/doctors` | List all doctors |
| `POST` | `/doctors` | Create a new doctor |
| `DELETE` | `/doctors/:id` | Delete a doctor and their data |
| `GET` | `/doctors/:id/slots` | Get slots for a specific doctor |
| `POST` | `/slots` | Create a new time slot |
| `POST` | `/bookings` | Book a time slot |

---
© 2025 DocBook. Premium Healthcare Scheduling.
