"use strict";

const co = require('co')
const loki = require('lokijs')
const mem = new loki.LokiMemoryAdapter();
const file = new loki.LokiFsAdapter();

module.exports = function LokiJSDao(name) {

  const dbName = name ? name : ':memory'
  const dbAdapter = name ? file : mem
  const db = new loki(dbName, {
    autosave: true,
    autoloadCallback : loadHandler,
    autosaveInterval: 100,
    autoload: true,
    adapter: dbAdapter
  })

  let loaded
  let loadedPromise = new Promise((res) => loaded = res)

  let accounts, announces

  function loadHandler() {
    accounts = db.getCollection('accounts')
    announces = db.getCollection('accounts')
    if (!accounts) {
      accounts = db.addCollection('accounts')
    }
    if (!announces) {
      announces = db.addCollection('announces')
    }
    loaded()
  }

  this.getAccountByPubkey = (pub) => co(function*() {
    yield loadedPromise
    return accounts.find({ pub })[0]
  })

  this.updateOrCreateAccount = (acc) => co(function*() {
    yield loadedPromise
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
    yield loadedPromise
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
    yield loadedPromise
    return accounts.find()
  })

  this.listAllAnnounces = () => co(function*() {
    yield loadedPromise
    return announces.find()
  })

  this.findAnnounces = (pattern) => co(function*() {
    yield loadedPromise
    const cleanedPattern = pattern
      .replace(/([$\[\]()+*?!{}|])/g, '\\$1')
    return announces.find({
      $or: [
        { title: { $regex: new RegExp(cleanedPattern)} },
        { desc: { $regex: new RegExp(cleanedPattern)} }
      ]
    })
  })

  this.getAnnounce = (uuid) => co(function*() {
    yield loadedPromise
    return announces.find({ uuid })[0]
  })

  this.getAccount = (pub) => co(function*() {
    yield loadedPromise
    return accounts.find({ pub })[0]
  })
}