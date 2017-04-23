"use strict";

const constants = require('./constants')

module.exports = {

  account: (a) => {
    let raw = 'Version: 1\n'
    raw += `Document: Account\n`
    raw += `Currency: ${constants.CURRENCY}\n`
    raw += `Pub: ${a.pub}\n`
    raw += `Uuid: ${a.uuid}\n`
    raw += `Title: ${a.title}\n`
    raw += `Desc: ${a.desc}\n`
    raw += `Address: ${a.address}\n`
    raw += `Logo: ${a.logo}\n`
    for (let i = 0; i < a.links.length; i++) {
      raw += `Links[${i}]: ${a.links[i]}\n`
    }
    raw += `${a.sig || ''}`
    return raw
  },

  announce: (a) => {
    let raw = 'Version: 1\n'
    raw += `Document: Announce\n`
    raw += `Currency: ${constants.CURRENCY}\n`
    raw += `Pub: ${a.pub}\n`
    raw += `Uuid: ${a.uuid}\n`
    raw += `Title: ${a.title}\n`
    raw += `Desc: ${a.desc}\n`
    raw += `Price: ${a.price}\n`
    raw += `Fees: ${a.fees}\n`
    raw += `Type: ${a.type}\n`
    raw += `Stock: ${a.stock}\n`
    for (let i = 0; i < a.images.length; i++) {
      raw += `Images[${i}]: ${a.images[i]}\n`
    }
    raw += `${a.sig || ''}`
    return raw
  }
}
