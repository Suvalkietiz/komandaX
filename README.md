# komandaX


The frontend project follows a type-based folder structure, where files are organized according to their technical role. Reusable UI components are placed in the components directory, application logic is implemented in hooks, page-level components are stored in pages, backend communication is handled in services, shared application state is managed in store, and general helper functions are located in utils.

Architectural pattern example structure:

```
frontend/
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Navbar.tsx
│
├── hooks/
│   ├── useAuth.ts
│   └── useBlog.ts
│
├── pages/
│   ├── blog_page.tsx
│   ├── login_page.tsx
│   ├── dashboard.tsx
│   └── profile_page.tsx
│
├── services/
│   ├── authAPI.ts
│   ├── blogAPI.ts
│   └── userAPI.ts
│
├── store/
│   ├── authStore.ts
│   └── blogStore.ts
│
└── utils/
    ├── formatDate.ts
    ├── validateEmail.ts
    └── constants.ts
```
<ul>
    <li>
        components/<br>  Reusable UI components used across multiple pages.
    </li>
    <li>
        hooks/<br> Custom React hooks that contain reusable logic. Hooks allow you to reuse stateful logic between components. For example: authentication logic, fetching data, managing form state, pagination logic
    </li>
    <li>
         pages/<br> Top-level page components representing application routes. These are the main screens of the application.
    </li>
    <li>
        services/<br> API communication with the backend. This folder contains functions responsible for: HTTP requests, interacting with backend endpoints, returning data to the frontend. Example:
<code>
    export async function login(email: string, password: string) {
  return fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  })
}
    </code>
    </li>
    <li>
        store/<br> Global application state management. This is where shared state is stored so multiple components can access it. Typical things stored here: logged-in user, authentication state, blog posts, UI state. Example:
<code>
        export const authStore = {
  user: null,
  isLoggedIn: false
}
    </code>
    </li>

<li>
    utils/ <br> General helper functions used across the application. These are small reusable utilities that don't belong to a specific feature. Example
    <code>
export function formatDate(date: Date) {
  return date.toLocaleDateString()
}
        </code>
</li>

</ul>


<br>
<br>
<br>
<br>
<br>
The backend follows a simplified layered architecture, separating routing, controllers, services, and database access. This approach improves maintainability and ensures a clear separation of responsibilities while keeping the system simple enough for a small development team.

```
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

```

<ul>
  <li>
    <strong>server.ts</strong> → Starts the backend server.
    <pre><code>import express from "express"
import routes from "./routes"

const app = express()
app.use(express.json())
app.use("/api", routes)

app.listen(3000, () => {
  console.log("Server running")
})
</code></pre>
  </li>

  <li>
    <strong>routes.ts</strong> → Defines API endpoints. Maps URL to controller.
    <pre><code>router.post("/login", authController.login)
router.post("/learning-places", learningPlacesController.create)
router.get("/learning-places", learningPlacesController.getAll)
</code></pre>
  </li>

  <li>
    <strong>controllers/</strong> → Controllers handle HTTP requests and responses. They read request data, call services, and send responses. Controllers should stay very thin.
    <pre><code>export const create = async (req, res) => {
  const place = await learningPlacesService.create(req.body)
  res.json(place)
}
</code></pre>
  </li>

  <li>
    <strong>services/</strong> → Services contain business logic. Implements application logic, talks to database layer, and validates data.
    <pre><code>export const create = async (data) => {
  return db.query(
    "INSERT INTO learning_places(name, city) VALUES($1,$2)",
    [data.name, data.city]
  )
}
</code></pre>
  </li>

  <li>
    <strong>db/</strong> → Database connection.
    <pre><code>import pkg from "pg"
const { Pool } = pkg

export const db = new Pool({
  connectionString: process.env.DATABASE_URL
})
</code></pre>
  </li>

  <li>
    <strong>models/</strong> → TypeScript types / interfaces. Defines data structures and helps TypeScript understand data.
    <pre><code>export interface LearningPlace {
  id: number
  name: string
  city: string
}
</code></pre>
  </li>
</ul>

<br>
<br>
<br>
<br>
<br>


Reasons why we chose such architectural pattern:
1. Samll and inexperienced team
2. Small project
3. This architecture pattern is easy to understand. It requires minimal time to adapt and follow the pattern.
4. This project is not planned to be scaled. Even if it's ever scaled, you can reconfigure it to feature based architecture pattern which is more proffesional.
```
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
```


