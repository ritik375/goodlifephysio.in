# MotionWell Physiotherapy — Full-Stack Clinic Website

A complete, production-ready physiotherapy clinic website built on the "MySQL-MERN" stack:
**M**ySQL, **E**xpress, **R**eact, **N**ode.

It includes a public marketing site (home, about, services, doctors, gallery, testimonials,
contact, appointment booking) and a secure admin panel for managing all of that content.

---

## Tech Stack

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Frontend       | React 18 (Vite), React Router, Tailwind CSS   |
| Backend        | Node.js, Express.js                           |
| Database       | MySQL 8 (raw SQL via `mysql2/promise`)        |
| Auth           | JWT + bcrypt                                  |
| File Uploads   | Multer                                        |
| HTTP Client    | Axios                                         |
| Icons          | React Icons                                   |

---

## Project Structure

```
physio-clinic/
├── client/                 React frontend (Vite)
│   ├── src/
│   │   ├── components/     Reusable UI components
│   │   ├── pages/          Public pages + pages/admin (admin panel)
│   │   ├── layouts/        MainLayout (public) & AdminLayout (dashboard)
│   │   ├── services/       Axios API modules (one per resource)
│   │   ├── hooks/          useAuth, useClinicInfo, useToast
│   │   ├── context/        AuthContext, ClinicInfoContext
│   │   └── utils/          iconMap helper
│   └── .env.example
├── server/                 Node/Express backend
│   ├── controllers/        Request handlers per resource
│   ├── models/             Raw SQL query layer (mysql2)
│   ├── routes/             Express routers
│   ├── middleware/         auth, upload (multer), validation, errors
│   ├── config/db.js        MySQL connection pool
│   ├── utils/               asyncHandler, generateToken
│   ├── uploads/             Uploaded doctor photos & gallery images
│   └── .env.example
├── database/
│   └── physio.sql          Full schema + seed data
└── README.md
```

---

## 1. Prerequisites

- Node.js **18+** and npm
- MySQL **8.x** (or MariaDB 10.6+) running locally or on a VPS
- A terminal / MySQL client (e.g. `mysql` CLI, MySQL Workbench, phpMyAdmin)

---

## 2. Database Setup

1. Make sure MySQL is running.
2. Import the schema + seed data:

   ```bash
   mysql -u root -p < database/physio.sql
   ```

   This creates the `physio_clinic` database, all tables, and seeds:
   - A default admin login
   - Sample clinic info, services, doctors, and testimonials

   **Default admin login:**
   - Email: `admin@motionwell.com`
   - Password: `Admin@123`

   > ⚠️ Change this password immediately after your first login (Admin Panel → Clinic Settings → Change Password).

---

## 3. Backend Setup (`server/`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your MySQL credentials and a strong JWT secret:

```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=physio_clinic

JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start       # plain node
```

The API will be available at `http://localhost:5000/api`, with a health check at
`GET /api/health`. Uploaded images are served statically from `http://localhost:5000/uploads`.

---

## 4. Frontend Setup (`client/`)

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env` if your backend runs somewhere other than `localhost:5000`:

```ini
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000/uploads
VITE_WHATSAPP_NUMBER=919876543210
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/admin/login` for the admin panel.

---

## 5. Building for Production

**Frontend:**
```bash
cd client
npm run build      # outputs static files to client/dist
```
Serve `client/dist` with any static host (Nginx, Apache, Vercel, Netlify, or Express's
`express.static`), or copy it to your VPS and point Nginx at it.

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```
For a VPS deployment, run the backend with a process manager such as PM2:
```bash
npm install -g pm2
pm2 start server.js --name physio-api
```

Typical VPS layout: Nginx reverse-proxies `/api` and `/uploads` to the Node process on
port 5000, and serves the built `client/dist` files directly for everything else.

---

## 6. Admin Panel Features

- Secure JWT-based login (`/admin/login`)
- Dashboard with content counts and recent appointment requests
- Full CRUD for **Services**, **Doctors** (with photo upload), **Gallery** (image upload)
- Approve / hide / delete **Testimonials** submitted by patients
- View, filter, update status, and delete **Appointment** requests
- Edit clinic-wide info: name, tagline, about, address, phone, WhatsApp, email,
  Google Maps embed URL, social links, and opening hours
- Change admin password

---

## 7. Key API Endpoints

| Method | Endpoint                          | Access  | Description                     |
|--------|------------------------------------|---------|----------------------------------|
| POST   | `/api/auth/login`                  | Public  | Admin login, returns JWT        |
| GET    | `/api/auth/profile`                | Private | Current admin profile           |
| PUT    | `/api/auth/change-password`        | Private | Change admin password           |
| GET    | `/api/services`                    | Public  | List services                   |
| POST   | `/api/services`                    | Private | Create service                  |
| PUT    | `/api/services/:id`                | Private | Update service                  |
| DELETE | `/api/services/:id`                | Private | Delete service                  |
| GET    | `/api/doctors`                     | Public  | List doctors                    |
| POST   | `/api/doctors`                     | Private | Create doctor (multipart photo) |
| GET    | `/api/gallery`                     | Public  | List gallery images              |
| POST   | `/api/gallery`                     | Private | Upload gallery image             |
| GET    | `/api/testimonials`                | Public  | List approved testimonials       |
| POST   | `/api/testimonials`                | Public  | Submit a testimonial             |
| PUT    | `/api/testimonials/:id`            | Private | Approve/edit testimonial         |
| POST   | `/api/appointments`                | Public  | Book an appointment              |
| GET    | `/api/appointments`                | Private | List appointment requests        |
| PUT    | `/api/appointments/:id/status`     | Private | Update appointment status        |
| GET    | `/api/clinic-info`                 | Public  | Get clinic info                  |
| PUT    | `/api/clinic-info`                 | Private | Update clinic info               |

All private routes require `Authorization: Bearer <token>`.

---

## 8. Design System

The frontend uses a custom Tailwind design system centered on a physiotherapy motif:
a "range of motion" arc (inspired by a goniometer, the tool physiotherapists use to
measure joint mobility) appears throughout the hero, dividers, and loading states.

- **Colors:** deep spruce `ink`, pale mint `paper`, clinical teal `primary`, warm clay `accent`
- **Type:** Newsreader (display/serif headings), Inter (body), IBM Plex Mono (data/labels)

---

## 9. Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWTs are signed with `JWT_SECRET` — use a long, random value in production
- `helmet` and `express-rate-limit` are enabled on the API
- Multer restricts uploads to image files under 5MB
- Always serve the production site over HTTPS and rotate `JWT_SECRET` if ever leaked

---

## License

MIT — free to use and modify for your own clinic or client projects.
