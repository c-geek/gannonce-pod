"use strict";

class Account {

  constructor(pub, uuid, title, desc, address, logo, links, sig) {
    this.pub = pub
    this.uuid = uuid
    this.title = title
    this.desc = desc
    this.address = address
    this.logo = {
      buffer: new Buffer(logo.buffer),
      extension: logo.extension
    }
    this.links = links.slice() // Copy
    this.sig = sig
  }
}

class Announce {

  constructor(pub, uuid, title, desc, price, fees, type, photos, stock, sig) {
    this.pub = pub
    this.uuid = uuid
    this.title = title
    this.desc = desc
    this.price = price
    this.fees = fees
    this.type = type
    this.images = photos.slice() // Copy
    this.stock = stock
    this.sig = sig
  }
}

module.exports = { Account, Announce }
