import express from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({ message: "Backend is running. Start building your API in backend/src." });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

