const express = require("express");
const newsletterController = require("../controllers/newsletter");

const api = express.Router();

api.post( "/suscribe-newsletter/:email", newsletterController.suscribeEmail );

module.exports = api;