import express from "express";

import TodoRouter from "./src/routes";

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// TODO: Use environment env variable
app.use(express.json());
app.use("/api", TodoRouter);

app.listen(port, () => {
  console.log(`Backend app listening at http://localhost:${port}`);
});
