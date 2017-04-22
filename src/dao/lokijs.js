"use strict";

const co = require('co')
const loki = require('lokijs')

module.exports = function LokiJSDao(name) {

  const db = new loki(name)
  const accounts = db.addCollection('accounts')
  const announces = db.addCollection('announces')

  this.getAccountByPubkey = (pub) => co(function*() {
    return accounts.find({ pub })[0]
  })

  this.updateOrCreateAccount = (acc) => co(function*() {
    accounts.insert(acc)
    return acc
  })

  this.updateOrCreateAnnounce = (ann) => co(function*() {
    announces.insert(ann)
    return ann
  })
}