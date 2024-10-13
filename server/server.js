const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const api = require("./api");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", api);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
