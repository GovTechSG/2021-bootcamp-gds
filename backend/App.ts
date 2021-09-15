import express from "express";

import TodoRouter from "./src/routes";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "./swagger.json";

const app = express();
const port = process.env.PORT || 3001;

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// TODO: Use environment env variable
app.use(express.json());
app.use("/api", TodoRouter);

app.listen(port, () => {
  console.log(`Backend app listening at http://localhost:${port}`);
});
