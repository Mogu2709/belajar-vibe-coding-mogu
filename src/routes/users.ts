import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersRoutes = new Elysia({ prefix: "/users" })

  // GET /users - List all users
  .get("/", async () => {
    const result = await db.select().from(users);
    return result;
  })

  // GET /users/:id - Get user by id
  .get("/:id", async ({ params, error }) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(params.id)));

    if (result.length === 0) {
      return error(404, { message: "User not found" });
    }
    return result[0];
  }, {
    params: t.Object({ id: t.String() }),
  })

  // POST /users - Create new user
  .post("/", async ({ body, set }) => {
    await db.insert(users).values(body);
    set.status = 201;
    return { message: "User created successfully" };
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
    }),
  })

  // PUT /users/:id - Update user
  .put("/:id", async ({ params, body, error }) => {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(params.id)));

    if (existing.length === 0) {
      return error(404, { message: "User not found" });
    }

    await db.update(users).set(body).where(eq(users.id, Number(params.id)));
    return { message: "User updated successfully" };
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      email: t.Optional(t.String({ format: "email" })),
    }),
  })

  // DELETE /users/:id - Delete user
  .delete("/:id", async ({ params, error }) => {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(params.id)));

    if (existing.length === 0) {
      return error(404, { message: "User not found" });
    }

    await db.delete(users).where(eq(users.id, Number(params.id)));
    return { message: "User deleted successfully" };
  }, {
    params: t.Object({ id: t.String() }),
  });
