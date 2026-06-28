const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
