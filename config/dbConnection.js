const mongoose = require("mongoose");
let secret = process.env.CONNECTION_STRING;
const dbconnection = async () => {
  await mongoose
    .connect(secret, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Successfully!"))
    .catch((err) => console.error("Error connecting to MongoDB", err));
};
module.exports = dbconnection;
