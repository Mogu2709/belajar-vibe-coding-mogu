import { Elysia } from "elysia";
import { usersRoutes } from "./routes/users";

const app = new Elysia()
  .get("/", () => ({ message: "Belajar Vibe Coding API is running 🚀" }))
  .use(usersRoutes)
  .listen(3000);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);
