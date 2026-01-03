import express from "express";
app.use(cors());
import { config } from "./config/env.js";
import keywordRoutes from "./routes/keyword.routes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api", keywordRoutes);

app.listen(config.port, () => {
  console.log(`Server running on ${config.port}`);
});
