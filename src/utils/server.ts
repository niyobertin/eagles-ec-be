import express from "express";
import cors from "cors";
import appROutes from "../routes";
import homeRoute from "../routes/homeRoutes";
import docRouter from "../docs/swagger";
import passport from "passport";
import session from "express-session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
    session({
      secret: "eagles.team1",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
      },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

app.use("/", homeRoute);
app.use("/api/v1", appROutes);
app.use("/docs", docRouter);

export default app;
