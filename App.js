require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./Database");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const notFoundMiddleware = require("./Middleware/not-found");
const errorHandlerMiddleware = require("./Middleware/error-handler");
const authenticate = require("./Middleware/authentication");

const authRouter = require("./Routes/auth");
const templateRouter = require("./Routes/wish-template");
const eventsRouter = require("./Routes/upcoming-events");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wish", authenticate, templateRouter);
app.use("/api/v1/events", authenticate, eventsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
async function start() {
  const port = process.env.PORT || 5555;
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server Spinning on ${port}`);
    });
  } catch (error) {
    console.log("Error while starting:", error);
  }
}
start();
