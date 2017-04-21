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

  static fromJSON(a) {
    return new Account(a.pub, a.uuid, a.title, a.desc, a.address, a.logo, a.links, a.sig)
  }
}

class Announce {

  constructor(pub, uuid, title, desc, price, fees, type, images, stock, sig) {
    this.pub = pub
    this.uuid = uuid
    this.title = title
    this.desc = desc
    this.price = price
    this.fees = fees
    this.type = type
    this.images = images.slice() // Copy
    this.stock = stock
    this.sig = sig
  }

  static fromJSON(a) {
    return new Announce(a.pub, a.uuid, a.title, a.desc, a.price, a.fees, a.type, a.images, a.stock, a.sig)
  }
}

module.exports = { Account, Announce }
