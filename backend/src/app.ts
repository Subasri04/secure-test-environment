import express from "express";
import cors from "cors";
import routes from "./routes";
import morgan from "morgan";

const app = express();

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://secure-test-environment-web.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
