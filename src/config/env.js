import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Needed because you use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your .env is inside src folder
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});
