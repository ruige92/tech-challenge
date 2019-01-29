const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const app = express();
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../front-end")));

routes(app);

const port = 3000;

const server = app.listen(port, () => {
  console.log("app running on port", server.address().port);
});
