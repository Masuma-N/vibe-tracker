# Vibe Tracker  

**Vibe Tracker** is a full-stack social wellness app that lets users track their daily moods and goals and see how their friends are feeling too. It’s designed to promote mental well-being through reflection and community connection.

##  Features

- Log your daily moods with reflections  
-  Create, update, and track personal goals  
-  See your mood history and goal progress  
-  View your friends’ recent mood entries  
-  Clean, simple, and responsive user interface  
-  Full CRUD functionality with error handling  

##  Tech Stack

- **Frontend:** React (Next.js)  
- **Backend:** Next.js API Routes  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Deployment:** Vercel  

## Live Demo

🔗 [https://vibe-tracker-liart.vercel.app/]

## Project Structure

```text
app/
├── api/
│   ├── moods/  # API routes for moods (GET, POST, PATCH, DELETE)
│   └── goals/  # API routes for goals (GET, POST, PATCH, DELETE)
├── ui/         # UI components like cards and forms
├── lib/        # Prisma client and utilities
└── page.tsx    # Main dashboard page
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/vibe-tracker.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   ```ini
   DATABASE_URL=your_postgres_connection_url
   ```

4. Run database migrations and seed data (optional):

   ```bash
   npx prisma migrate dev --name init
   npx tsx app/lib/seed.ts
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

##  Final Requirements

- [x] React frontend (Next.js)  
- [x] PostgreSQL + Prisma  
- [x] Custom API (CRUD for moods & goals)  
- [x] Group features (friend mood visibility)  
- [x] GitHub repo + Vercel deployment  
- [x] Environment variables + `.gitignore`  


##  How CRUD Works

This app uses custom API routes under `/api/` to handle full CRUD operations for both moods and goals:

- **Create**: Users can submit a form to add a new mood log or goal via a `POST` request.
- **Read**: Mood and goal entries are retrieved using `GET` requests from the database using Prisma.
- **Update**: Goals can be marked as complete/incomplete using a `PATCH` request. The checkbox in the UI toggles the `completed` field in the database.
- **Delete**: Entries can be deleted using a `DELETE` request via a button in the UI.

All operations are handled with proper error catching and JSON responses inside `app/api/moods/route.ts` and `app/api/goals/route.ts`.
