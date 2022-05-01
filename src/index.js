const express = require("express");
const app = express();
const db = require("./db/db");
const bodyParser = require("body-parser");
const router = require("./router/index");
const port = process.env.PORT;

db.connect();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

router(app);

app.get("/", (req, res) => {
  res.send("home");
});

app.listen(port, () => {
  console.log("listening on " + port);
});
