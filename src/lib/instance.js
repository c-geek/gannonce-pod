"use strict";

const services = require('../services')
const dao = require('../dao')

module.exports = function Instance(duniterNode) {
  return new GchangeInstance(duniterNode)
}

function GchangeInstance(duniterNode) {

  this.dao = new dao.LokiJSDao('gchange')
  this.services = {}
  this.services.validation = services.validation()
  this.services.account = services.account(this.dao, this.services)
  this.services.announce = services.announce(this.dao, this.services)
  this.services.duniter = services.duniter(this.dao, this.services, duniterNode)
}