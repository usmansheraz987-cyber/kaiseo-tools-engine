import "./config/env.js";

import express from "express";
import cors from "cors";

import keywordRoutes from "./routes/keyword.routes.js";
import readabilityRoutes from "./routes/readability.routes.js";
import metaGeneratorRoute from "./routes/metaGenerator.route.js";
import contentImproverRoutes from "./routes/contentImprover.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import seoAnalyzerRoutes from "./routes/seoAnalyzer.routes.js";
import pageEligibilityRoutes from "./routes/pageEligibility.routes.js";

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
app.use("/api", aiRoutes);
app.use("/api", seoAnalyzerRoutes);
app.use("/api/page-eligibility", pageEligibilityRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
