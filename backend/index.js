// const express = require("express");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const connectDb = require("./config/db");
// require("dotenv").config();
// const authRoute = require("./routes/authRoute");
// const postRoute = require("./routes/postRoute");
// const userRoute = require("./routes/userRoute");
// const passport = require("./controllers/googleController");

// const app = express();
// app.set("trust proxy", true);
// app.use(express.json());
// app.use(cookieParser());

// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// };
// app.use(cors(corsOptions));

// connectDb();
// app.use(passport.initialize());

// //api route
// app.use("/auth", authRoute);
// app.use("/users", postRoute);
// app.use("/users", userRoute);

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`server listening on ${PORT}`));

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDb = require("./config/db");
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const passport = require("./controllers/googleController");

const app = express();
app.set("trust proxy", true);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Connect to the database
connectDb();
app.use(passport.initialize());

// API Routes
app.use("/auth", authRoute);
app.use("/users", postRoute);
app.use("/users", userRoute);

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
