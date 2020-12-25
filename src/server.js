import express from "express";
import { connect } from "./utils/db";
import { config } from "./config";
import { json, urlencoded } from "body-parser";
import { login, newUser } from "./controllers/user.controller";
import UserRoutes from "./routes/user.router";
import { isAuthenticated, HasRole } from "./utils/auth";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/api/login", login);
app.post("/api/register", newUser);

app.post("/api/isauthenticated", isAuthenticated, (req, res) => {
  res.status(200).end();
});
app.post("/api/isauthorized", isAuthenticated, HasRole(), (req, res) => {
  res.status(200).end();
});

app.use("/api", UserRoutes);

const init = async () => {
  try {
    await connect(config.dbUri);
    app.listen(config.port, () => {
      console.log(`server started.......`);
    });
  } catch (err) {
    console.error(err);
  }
};

export default init;
