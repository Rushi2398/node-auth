require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRouter = require("./routes/auth-routes");
const adminRouter = require("./routes/admin-routes");
const homeRouter = require("./routes/home-routes");
const uploadRouter = require("./routes/image-routes");

const app = express();

connectToDB();

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/home", homeRouter);
app.use("/api/images", uploadRouter);

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
