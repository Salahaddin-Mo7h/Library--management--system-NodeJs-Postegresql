const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

const db = require("./src/models");
const Role = db.role;
db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
  // initial();
});

// {force: true}

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });
}

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// books route
require("./src/routes/books.route")(app);
// auth route
require("./src/routes/auth.route")(app);
// user route for testing
require("./src/routes/users.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
