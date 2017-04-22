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
    const existing = accounts.find({ uuid: acc.uuid })[0]
    if (existing) {
      existing.title = acc.title
      existing.desc = acc.desc
      existing.address = acc.address
      existing.logo = acc.logo
      existing.links = acc.links.slice()
      accounts.update(existing)
    } else {
      accounts.insert(acc)
    }
    return acc
  })

  this.updateOrCreateAnnounce = (ann) => co(function*() {
    const existing = announces.find({ uuid: ann.uuid })[0]
    if (existing) {
      existing.title = ann.title
      existing.desc = ann.desc
      existing.price = ann.price
      existing.fees = ann.fees
      existing.type = ann.type
      existing.stock = ann.stock
      existing.sig = ann.sig
      existing.images = ann.images.slice()
      announces.update(existing)
    } else {
      announces.insert(ann)
    }
    return ann
  })

  this.listAllAccounts = () => co(function*() {
    return accounts.find()
  })

  this.listAllAnnounces = () => co(function*() {
    return announces.find()
  })
}