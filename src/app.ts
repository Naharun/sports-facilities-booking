import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
// app.use("/api", ProductRoutes);
// app.use("/api", OrderRoutes); // Use Order Routes

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
