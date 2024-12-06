const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  // Use native promises
  mongoose.Promise = global.Promise;

  // Connect to the database
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Ensures proper parsing of the URI
      useUnifiedTopology: true, // Uses the new Server Discover and Monitoring engine
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((error) => {
      console.error("Error, Connection establishment failed:", error.message);
      process.exit(1); // Exit the process on failure
    });

  return mongoose.connection;
};
