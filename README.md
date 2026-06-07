# Digital Invitation System

A full-stack digital invitation management system built with React, Express.js, and PostgreSQL. Perfect for hosting events and managing RSVPs.

## Features

✨ **Core Features:**
- Landing page with event details (name, date, time, location, dress code)
- RSVP form with guest details, meal preferences, and messages
- Admin dashboard with RSVP management and export
- Digital invitations with unique guest links
- Email notifications (with Nodemailer integration)
- Mobile-responsive modern UI with animations
- Guest list management with unique invite link generation

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Axios (API client)

**Backend:**
- Node.js + Express.js
- PostgreSQL (with SQLite fallback)
- Knex.js (query builder)
- Express Rate Limit
- Joi (validation)

## Project Structure

```
.
├── frontend/                 # React Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│   └── vite.config.js
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── server.js
│   ├── migrations/
│   └── seeds/
├── render.yaml              # Render deployment config
└── package.json            # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 12+ (or use SQLite for development)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd webapisv
   ```

2. **Install dependencies**
   ```bash
   # Root
   npm install
   
   # Frontend
   cd frontend && npm install && cd ..
   
   # Backend
   cd backend && npm install && cd ..
   ```

3. **Setup environment variables**
   ```bash
   # Copy and edit backend/.env
   cp backend/.env.example backend/.env
   ```

4. **Initialize database**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   cd ..
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin Dashboard: http://localhost:5173/admin (password: admin123)

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DB_TYPE=sqlite  # or 'postgres'
DB_URL=sqlite:database.db
# For PostgreSQL:
# DB_URL=postgresql://user:password@localhost:5432/invitations

# Admin
ADMIN_PASSWORD=admin123

# Email (optional, uses console.log if not configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@invitations.com

# Rate limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Push the code to GitHub
2. Connect repository to Render
3. Render will automatically detect `render.yaml` and configure services

### Option 2: Manual Setup

1. **Create PostgreSQL Database**
   - Service: PostgreSQL
   - Name: invitations-db
   - Note the connection string

2. **Deploy Backend**
   - Service: Web Service
   - Repository: Your GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install && npm run db:migrate`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     NODE_ENV=production
     DB_URL=<postgresql-connection-string>
     FRONTEND_URL=https://your-frontend.onrender.com
     ADMIN_PASSWORD=<strong-password>
     ```

3. **Deploy Frontend**
   - Service: Static Site
   - Repository: Your GitHub repo
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

## API Documentation

### Public Endpoints

**GET /api/event**
- Returns event details

**GET /api/invite/:id**
- Returns invite details for guest

**POST /api/rsvp**
- Submit RSVP
- Body: { inviteId, name, email, adults, children, mealPreference, attending, message }

### Admin Endpoints

**GET /api/admin/rsvps** (requires auth)
- List all RSVPs with pagination and filters

**GET /api/admin/stats** (requires auth)
- Summary statistics

**POST /api/admin/export** (requires auth)
- Export RSVPs to CSV

**POST /api/admin/guests** (requires auth)
- Add new guest and generate invite link

**DELETE /api/admin/guests/:id** (requires auth)
- Remove guest

**POST /api/admin/guests/:id/regenerate** (requires auth)
- Regenerate invite link

## Database Schema

### Tables
- `guests` - Guest information and invite links
- `rsvps` - RSVP responses
- `event` - Event details

## Features

### Landing Page
- Event banner with date/time
- Location with map link
- Dress code information
- Call-to-action to RSVP

### RSVP Form
- Pre-filled for returning guests
- Validation with clear error messages
- Meal preference options
- Optional message to host
- Confirmation submission

### Admin Dashboard
- Password-protected access
- Search and filter RSVPs
- View detailed responses
- Export to CSV
- Summary statistics
- Guest management
- Invite link generation and regeneration

### Guest Invitation
- Unique URL per guest (e.g., /invite/abc123)
- Pre-filled form with guest name
- Elegant invitation design

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:reset     # Reset and seed
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Testing

### Sample Event Data
Run the seed script to populate sample data:
```bash
cd backend
npm run db:seed
```

This creates:
- Sample event data
- 10 sample guests with unique invite links

### Test Admin Access
- URL: http://localhost:5173/admin
- Password: `admin123`

## Security Considerations

- Admin password is hashed on the backend
- Rate limiting prevents abuse
- Input validation on all endpoints
- CORS configured for production URLs
- Environment variables for sensitive data
- Session tokens with expiration (can be enhanced)

## Troubleshooting

**Database Connection Error**
- Verify `DB_URL` environment variable
- Check PostgreSQL is running (if using PostgreSQL)
- Try resetting SQLite: `rm backend/database.db`

**CORS Issues**
- Check `FRONTEND_URL` environment variable
- Ensure backend is running on correct port

**Port Already in Use**
- Backend: Change `PORT` environment variable
- Frontend: `npm run dev -- --port 5174`

## License

MIT
