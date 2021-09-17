import express from "express";

import TodoRouter from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "../swagger.json";

const app = express();
const port = process.env.PORT || 9000;

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use(express.json());
app.use("/api", TodoRouter);

export default app.listen(port, () => {
  console.log(`Backend app listening at http://localhost:${port}`);
});
