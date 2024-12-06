const express = require("express");

const app = express();
const swaggerUi = require("swagger-ui-express");
const logger = require("./config/logger");

const swaggerDocument = require("./app/swagger/swagger.json");

const port = process.env.PORT || 3000;
// middleware has access to req and res
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// configuring the database
const dbConnect = require("./config/database.config");

dbConnect();

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Bookstore application 📚" });
});

// Requiring routes
require("./app/routes/routes")(app);

// listen for request
app.listen(port, () => {
  logger.log("info", `Server is listening at port ${port}`);
});

module.exports = app;
