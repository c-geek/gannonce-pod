"use strict";

const rawer = require('../lib/rawer')

class Account {

  constructor(pub, uuid, title, desc, address, logo, links, sig) {
    this.pub = pub
    this.uuid = uuid
    this.title = title
    this.desc = desc
    this.address = address
    this.logo = logo
    this.links = links.slice() // Copy
    this.sig = sig
  }

  static fromJSON(a) {
    return new Account(a.pub, a.uuid, a.title, a.desc, a.address, a.logo, a.links, a.sig)
  }

  static fromRaw(raw) {
    const pub =     raw.match(/Pub: ([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44})\nUuid: /)
    const uuid =    raw.match(/Uuid: ([0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})\nTitle: /)
    const title =   raw.match(/Title: (.{10,100})\nDesc: /)
    const desc =    raw.match(/Desc: (.{10,10000})\nAddress: /)
    const address = raw.match(/Address: (.{10,100})\nLogo: /)
    const logo =    raw.match(/Logo: (data:image\/(png|jpeg);base64,[a-zA-Z0-9/+=]{1,160000})\n/)
    const sig =     raw.match(/\n([A-Za-z0-9+\\/=]{87,88})$/)
    const acc = {
      pub: pub && pub[1],
      uuid: uuid && uuid[1],
      title: title && title[1],
      desc: desc && desc[1],
      address: address && address[1],
      sig: sig && sig[1],
      logo: logo && logo[1],
      links: []
    }
    for (let i = 0; i < 10; i++) {
      const match = raw.match(new RegExp("Links\\[" + i + "\\]: (.{10,100})\n"))
      if (match) {
        acc.links.push(match[1])
      }
    }
    return acc
  }

  static toRaw(obj) {
    return rawer.account(obj)
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

  images2files() {
    const buffers = []
    for (const img of this.images) {
      const match = img.match(new RegExp("data:image\/(png|jpeg);base64,([a-zA-Z0-9/+=]{1,160000})\n"))
      if (match) {
        buffers.push({
          buffer: match && Buffer.from(match[2], 'base64'),
          extension: match && match[1]
        })
      }
    }
    return buffers
  }

  static fromJSON(a) {
    return new Announce(a.pub, a.uuid, a.title, a.desc, a.price, a.fees, a.type, a.images, a.stock, a.sig)
  }

  static fromRaw(raw) {
    const pub =     raw.match(/Pub: ([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44})\nUuid: /)
    const uuid =    raw.match(/Uuid: ([0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})\nTitle: /)
    const title =   raw.match(/Title: (.{10,100})\nDesc: /)
    const desc =    raw.match(/Desc: (.{10,10000})\nPrice: /)
    const price =   raw.match(/Price: (\d+\.\d{2})\nFees: /)
    const fees =    raw.match(/Fees: (\d+\.\d{2})\nType: /)
    const type =    raw.match(/Type: (Good|Service|Crowdfunding|Auction)\nStock: /)
    const stock =   raw.match(/Stock: ([1-9][0-9]{0,8})\n/)
    const sig =     raw.match(/\n([A-Za-z0-9+\\/=]{87,88})$/)
    const acc = {
      pub: pub && pub[1],
      uuid: uuid && uuid[1],
      title: title && title[1],
      desc: desc && desc[1],
      price: price && price[1],
      fees: fees && fees[1],
      type: type && type[1],
      stock: stock && stock[1],
      sig: sig && sig[1],
      images: []
    }
    for (let i = 0; i < 10; i++) {
      const match = raw.match(new RegExp("Images\\[" + i + "\\]: (data:image\/(png|jpeg);base64,[a-zA-Z0-9/+=]{1,160000})\n"))
      if (match) {
        acc.images.push(match && match[1])
      }
    }
    return acc
  }

  static toRaw(obj) {
    return rawer.announce(obj)
  }
}

module.exports = { Account, Announce }
