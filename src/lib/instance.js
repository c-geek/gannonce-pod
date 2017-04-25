"use strict";

const services = require('../services')
const DAO = require('../dao')

module.exports = function Instance(duniterNode, dao) {
  return new GchangeInstance(duniterNode, dao)
}

function GchangeInstance(duniterNode, dao) {

  if (!dao) {
    // Default: in-memory LokiJS Dao
    dao = new DAO.LokiJSDao()
  }

  this.duniterNode = duniterNode
  this.dao = dao
  this.services = {}
  this.services.validation = services.validation()
  this.services.account = services.account(this.dao, this.services)
  this.services.announce = services.announce(this.dao, this.services)
  this.services.duniter = services.duniter(this.dao, this.services, duniterNode)
}