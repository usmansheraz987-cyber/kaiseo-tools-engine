import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import keywordRoutes from "./routes/keyword.routes.js";
import readabilityRoutes from "./routes/readability.routes.js";
import metaGeneratorRoute from "./routes/metaGenerator.route.js";
import contentImproverRoutes from "./routes/contentImprover.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api", keywordRoutes);
app.use("/api", readabilityRoutes);
app.use("/api", metaGeneratorRoute);
app.use("/api", contentImproverRoutes);

app.listen(config.port, () => {
  console.log(`Server running on ${config.port}`);
});
