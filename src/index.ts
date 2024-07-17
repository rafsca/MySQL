import express, { Request, Response } from "express";
import { createClient } from "@vercel/postgres";

const client = createClient({
  connectionString: "postgres://default:rxUmIy7Rpde8@ep-tiny-limit-a4ih9n43.us-east-1.aws.neon.tech:5432/verceldb",
});
client.connect();

const app = express();
const port = 3000;
const server = express.json();

app.use(server);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

// Creazione , Dettaglio, Modifica, Cancellazione ,

app.get("/posts", async (req: Request, res: Response) => {
  const response = await client.query("SELECT * FROM posts");
  res.status(200).json(response.rows);
});

app.post("/posts", async (req: Request, res: Response) => {
  const title = req.body.title;
  const content = req.body.content;
  client.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [title, content], function (error, response) {
    if (error) return res.status(500).send("error");
    else return res.status(200).send("post created");
  });
});

app.get("/posts/:id", (req: Request, res: Response) => {
  client.query("SELECT * FROM posts WHERE id = $1", [req.params.id], function (error, response) {
    if (error) return res.status(500).send("error");
    else return res.status(200).send(response.rows);
  });
});

app.delete("/posts/:id", async (req: Request, res: Response) => {
  client.query("DELETE FROM posts WHERE id = $1", [req.params.id], function (error, response) {
    if (error) return res.status(500).send("error");
    else return res.status(200).send("post deleted");
  });
});

app.put("/posts/:id", async (req: Request, res: Response) => {
  client.query("UPDATE posts SET title = $1, content = $2 WHERE id = $3", [req.body.title, req.body.content, req.params.id], function (error, response) {
    if (error) return res.status(500).send("error");
    else return res.status(200).send("post updated");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
