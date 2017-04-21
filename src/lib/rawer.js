"use strict";

const constants = require('./constants')

module.exports = {

  account: (a) => {
    const logoB64 = a.logo && a.logo.buffer.toString('base64')
    const logoExt = a.logo && a.logo.extension
    const logo = (a.logo && `data:image/${logoExt};base64,${logoB64}`) || ''
    let raw = 'Version: 1\n'
    raw += `Document: Account\n`
    raw += `Currency: ${constants.CURRENCY}\n`
    raw += `Pub: ${a.pub}\n`
    raw += `Uuid: ${a.uuid}\n`
    raw += `Title: ${a.title}\n`
    raw += `Desc: ${a.desc}\n`
    raw += `Address: ${a.address}\n`
    raw += `Logo: ${logo}\n`
    for (let i = 0; i < a.links.length; i++) {
      raw += `Links[${i}]: ${a.links[i]}\n`
    }
    raw += `${a.sig || ''}`
    return raw
  },

  announce: (a) => {
    let images = a.images.map((image) => {
      const imgB64 = image && image.buffer.toString('base64')
      const imgExt = image && image.extension
      const img = (image && `data:image/${imgExt};base64,${imgB64}`)
      return img || ''
    })
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
    for (let i = 0; i < images.length; i++) {
      raw += `Images[${i}]: ${images[i]}\n`
    }
    raw += `${a.sig || ''}`
    return raw
  }
}
