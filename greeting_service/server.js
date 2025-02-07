import express from "express";
import cors from 'cors';
import path from "path";
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';


import connectDB from './config/db.js';
import postRoutes from './route/postRoutes.js';
import userRouter from './route/userRoutes.js';
import birthDayRouter from "./route/birthDayRoutes.js";
import eventRouter from "./route/eventRoutes.js";
import festivalRouter from "./route/festivalRoutes.js";
import marriageRouter from "./route/marriageRoute.js"
import { templeRouter } from "./route/templeRoutes.js";
import { scheduleRouter } from "./route/scheduleRoutes.js";
import { watchSchedules } from "./schedular/scheduleJob.js";
import responseRouter from "./route/responseRoutes.js";
import createPredefinedTemplates from "./utils/createPredefinedTemplates.js";
import analyticsRoutes from './route/analyticsRoutes.js';
import userTicketingRouter from "./route/userTicketingRoutes.js";
import contactRoute from "./route/contactRoutes.js";
import { createDefaultAdmin } from "./utils/createDefaultAdmin.js";
import "./utils/passport.js";

const port = process.env.DB_PORT || 3000;  // Default port is 3000 if DB_PORT is not specified

dotenv.config();

const app = express();

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json({ limit: '6mb' }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to catch and handle errors caused by payloads exceeding the limit
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413) {
    res.status(413).send({ error: 'Payload too large!' });
  } else {
    next(err);
  }
});

// app.use((req, res, next) => {
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });


// Middleware to serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes for birthdays management
app.use('/birthdays', birthDayRouter);


// Routes for events management
app.use('/events', eventRouter);

app.use("/festivals", festivalRouter);

app.use("/marriages", marriageRouter);

// Routes for user management
app.use('/users', userRouter);

// Routes for temple information
app.use("/temple", templeRouter);

// Routes for post management
app.use('/post', postRoutes);

//Routes for schedule 
app.use("/schedule", scheduleRouter);

app.use("/response", responseRouter);

app.use("/analytics", analyticsRoutes);

app.use("/user-ticketing", userTicketingRouter);

app.use("/contact", contactRoute);

app.get("/", (req, res) => {
  res.status(200).send(`Server running upon the port : ${port}`);
})

// Server setup

app.listen(port, async () => {
  console.log(`Server Started on port ${port}`);
  // Connect to MongoDB
  await connectDB();
  // Start watching the collection for scheduling
  await watchSchedules();
  // Create predefined templates
  await createPredefinedTemplates();
  // Ensure default admin is created
  await createDefaultAdmin();
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 5);
  console.log(currentDate);
});
