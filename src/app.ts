import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { Env } from "./env";
import { dynamoDBMiddleware } from "./middleware/dynamodb";

const app = new Hono<Env>();

app.use("*", dynamoDBMiddleware("Test"));

app.get("/", (c) => {
  return c.text("Hello World");
});

app.get("/items", async (c) => {
  try {
    const items = await c.get("dynamodb").scanItems();
    return c.json(items);
  } catch (error) {
    return c.json({ error: "Failed to get items" }, 500);
  }
});

app.get("/items/:id", async (c) => {
  try {
    const item = await c.get("dynamodb").getItem(c.req.param("id"));
    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }
    return c.json(item);
  } catch (error) {
    return c.json({ error: "Failed to get item" }, 500);
  }
});

app.post("/items", async (c) => {
  try {
    const item = await c.req.json();
    await c.get("dynamodb").putItem(item);
    return c.json({ message: "Item created" });
  } catch (error) {
    return c.json({ error: "Failed to create item" }, 500);
  }
});

app.put("/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const item = await c.req.json();
    await c.get("dynamodb").updateItem(id, item);
    return c.json({ message: "Item updated" });
  } catch (error) {
    return c.json({ error: "Failed to update item" }, 500);
  }
});

app.delete("/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await c.get("dynamodb").deleteItem(id);
    return c.json({ message: "Item deleted" });
  } catch (error) {
    return c.json({ error: "Failed to delete item" }, 500);
  }
});

export const handler = handle(app);
