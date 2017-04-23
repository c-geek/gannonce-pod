"use strict";

const services = require('../services')
const dao = require('../dao')

module.exports = function Instance(duniterNode, dbName) {
  return new GchangeInstance(duniterNode, dbName)
}

function GchangeInstance(duniterNode, dbName) {

  this.dao = new dao.LokiJSDao(dbName)
  this.services = {}
  this.services.validation = services.validation()
  this.services.account = services.account(this.dao, this.services)
  this.services.announce = services.announce(this.dao, this.services)
  this.services.duniter = services.duniter(this.dao, this.services, duniterNode)
}