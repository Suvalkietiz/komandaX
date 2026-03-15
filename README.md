# komandaX


The frontend project follows a type-based folder structure, where files are organized according to their technical role. Reusable UI components are placed in the components directory, application logic is implemented in hooks, page-level components are stored in pages, backend communication is handled in services, shared application state is managed in store, and general helper functions are located in utils.

Architectural pattern example structure:
frontend/
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useBlog.ts
├── pages/
│   ├── blog_page.tsx
│   └── login_page.tsx
│   └── dashboard.tsx
│   └── profile_page.tsx
├── services/
│   ├── authAPI.ts
│   └── blogAPI.ts
│   └── userAPI.ts
├── store/
│   ├── authStore.ts
│   └── blogStore.ts
└── utils/
    └── formatDate.ts
    └── validateEmail.ts
    └── constants.ts

components/ → Reusable UI components used across multiple pages.

hooks/      → Custom React hooks that contain reusable logic. Hooks allow you to reuse stateful logic between components. For example: authentication logic, fetching data, managing form state, pagination logic

pages/      → Top-level page components representing application routes. These are the main screens of the application.

services/   → API communication with the backend. This folder contains functions responsible for: HTTP requests, interacting with backend endpoints, returning data to the frontend. Example:
export async function login(email: string, password: string) {
  return fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  })
}

store/      → Global application state management. This is where shared state is stored so multiple components can access it. Typical things stored here: logged-in user, authentication state, blog posts, UI state. Example:
export const authStore = {
  user: null,
  isLoggedIn: false
}

utils/      → General helper functions used across the application. These are small reusable utilities that don't belong to a specific feature. Example
export function formatDate(date: Date) {
  return date.toLocaleDateString()
}





========================================================================================================================================





The backend follows a simplified layered architecture, separating routing, controllers, services, and database access. This approach improves maintainability and ensures a clear separation of responsibilities while keeping the system simple enough for a small development team.

backend/
    └── src/
        ├── server.ts
        ├── routes.ts
        │
        ├── controllers/
        │   ├── authController.ts
        │   └── learningPlacesController.ts
        │
        ├── services/
        │   ├── authService.ts
        │   └── learningPlacesService.ts
        │
        ├── db/
        │   └── db.ts
        │
        └── models/
            ├── user.ts
            └── learningPlace.ts


server.ts      → Starts the backend server.
Example idea:
import express from "express"
import routes from "./routes"
const app = express()
app.use(express.json())
app.use("/api", routes)
app.listen(3000, () => {
  console.log("Server running")
})

routes.ts      → Defines API endpoints. Map URL to controller.
Example:
router.post("/login", authController.login)
router.post("/learning-places", learningPlacesController.create)
router.get("/learning-places", learningPlacesController.getAll)


controllers/    → Controllers handle HTTP requests and responses. It has to read request data, call services, send response. Controllers should stay very thin.
Example:
export const create = async (req, res) => {
  const place = await learningPlacesService.create(req.body)
  res.json(place)
}


services/       → Services contain business logic. It implements application logic and talk to database layer. It also validates data.
Example:
export const create = async (data) => {
  return db.query(
    "INSERT INTO learning_places(name, city) VALUES($1,$2)",
    [data.name, data.city]
  )
}

db/             → Database connection.
Example:
import pkg from "pg"
const { Pool } = pkg
export const db = new Pool({
  connectionString: process.env.DATABASE_URL
})


models/         → TypeScript types / interfaces. Defines data structures and help typescript understand data.
Example:
export interface LearningPlace {
  id: number
  name: string
  city: string
}


========================================================================================================================================
========================================================================================================================================
========================================================================================================================================
Reasons why we chose such architectural pattern:
1. Samll and inexperienced team
2. Small project
3. This architecture pattern is easy to understand. It requires minimal time to adapt and follow the pattern.
4. This project is not planned to be scaled. Even if it's ever scaled, you can reconfigure it to feature based architecture pattern which is more proffesional.

Typical request flow throughout whole application: 
React frontend
      ↓
POST /api/learning-places
      ↓
routes.ts
      ↓
learningPlacesController
      ↓
learningPlacesService
      ↓
PostgreSQL database
      ↓
response returned



