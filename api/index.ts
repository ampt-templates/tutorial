import { http } from "@ampt/sdk";
import { data } from "@ampt/data";
import express, { Router } from "express";

import type { Request, Response, NextFunction } from "express";

type TodoItem = {
  id: string;
  name: string;
  description?: string;
  status: "complete" | "incomplete";
};

const app = express();

const router = Router();

router.get(
  "/healthcheck",
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.json({ status: "ok" });
  }
);

// ap.use("/api", router);

app.use(express.json());

app.use((req, _res, next) => {
  // console.info({
  //   method: req.method,
  //   url: req.url,
  //   body: req.body,
  // });
  next();
});

const todos = express.Router({ mergeParams: true });

todos.get("/", async (_req: Request, res: Response) => {
  const { items } = await data.get<TodoItem>("todo:*", { meta: true });
  res.json(
    items.map((item: any) => ({ ...item.value, created: item.created }))
  );
});

todos.put("/", async (req: Request, res: Response) => {
  const { name, description, completed } = req.body;
  const newTodo: TodoItem = {
    id: Math.random().toString(36),
    name,
    description,
    status: completed ? "complete" : "incomplete",
  };
  await data.set<TodoItem>(`todo:${newTodo.id}`, newTodo);
  res.sendStatus(200);
});

todos.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await data.get<TodoItem>(`todo:${id}`);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  const toggleStatus = todo.status === "complete" ? "incomplete" : "complete";

  await data.set<TodoItem>(`todo:${id}`, {
    status: toggleStatus,
  });

  res.sendStatus(200);
});

todos.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await data.get<TodoItem>(`todo:${id}`);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  await data.remove(`todo:${id}`);

  res.sendStatus(200);
});

app.use("/api", router);
app.use("/api/todos", todos);

app.use(async (req, res) => {
  if (req.accepts("html")) {
    // Single-page-app support: return index.html for all other HTML requests
    // this returns the app for any path that does not have a defined route
    const stream = await http.node.readStaticFile("index.html");
    res.status(200).type("html");
    stream?.pipe(res);
  } else if (req.accepts("json")) {
    res.status(404).json({ message: "Not found" });
  } else if (req.accepts("txt")) {
    res.status(404).type("txt").send("Not found");
  } else {
    res.status(404).end();
  }
});

// This allows the Expres app to run in Ampt
http.node.use(app);
