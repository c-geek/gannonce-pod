"use strict";

const services = require('../services')
const dao = require('../dao')

module.exports = function Instance() {
  return new GchangeInstance()
}

function GchangeInstance() {

  this.dao = new dao.LokiJSDao('gchange')
  this.services = {}
  this.services.validation = services.validation()
  this.services.account = services.account(this.dao, this.services)
  this.services.announce = services.announce(this.dao, this.services)
}