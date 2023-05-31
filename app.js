const express = require("express")
const http = require("http");
const path = require("path")
require("dotenv").config();
const {routesInit} = require("./routes/configRoutes")
require('./db/mongoConnect')

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname,"public")))
//routs navgation
routesInit(app)
//listnig to port
const server = http.createServer(app)
const port = 3003;
server.listen(port)