"use strict";

const co = require('co')
const sharp = require('sharp')
const constants = require('../lib/constants')
const Announce = require('../lib/entities').Announce
const Account = require('../lib/entities').Account

module.exports = function (dao, services) {
  return new AnnounceService(dao, services)
}

function AnnounceService(dao, services) {

  this.submit = (raw) => co(function*() {
    const validFormat = services.validation.checkAnnounceFormat(raw)
    if (!validFormat) {
      throw constants.ERRORS.WRONG_FORMAT_ANNOUNCE
    }
    const json = Announce.fromRaw(raw)
    const validSig = services.validation.checkAnnounceSignature(json)
    if (!validSig) {
      throw constants.ERRORS.WRONG_SIGNATURE
    }
    // Authenticated document, legit. Process.
    const acc = yield dao.getAccountByPubkey(json.pub)
    if (!acc) {
      throw constants.ERRORS.THE_ACCOUNT_MUST_EXIST
    }
    // The account exist, now save the changes.
    const ann = yield dao.getAnnounce(json.uuid)
    if (ann && ann.pub !== json.pub) {
      throw constants.ERRORS.NOT_THE_ANNOUNCE_OWNER
    }
    const thumbnailImage = Announce.fromJSON(json).getFirstImage()
    if (thumbnailImage) {
      thumbnailImage.buffer = yield sharp(thumbnailImage.buffer)
        .resize(40,40)
        .toBuffer()
      json.thumbnail = 'data:image/' + thumbnailImage.extension + ';base64,' + thumbnailImage.buffer.toString('base64')
    }
    // This publisher is the owner of this announce, continue.
    yield dao.updateOrCreateAnnounce(json)
    return json
  })

  this.listAll = () => dao.listAllAnnounces().then(cleanForJSONAnswer)

  this.listAllOpen = (limit, page, search) => co(function*() {
    const result = yield dao.listAllAnnouncesWithStock(limit, page, search)
    result.announces = yield cleanForJSONAnswer(result.announces)
    return result
  })

  this.listAnnouncesOf = (pub) => dao.listAnnouncesForPubkey(pub).then(cleanForJSONAnswer)

  this.search = (pattern) => dao.findAnnounces(pattern)

  this.getAnnounce = (uuid) => dao.getAnnounce(uuid).then((ann) => co(function*() {
    ann.payments = yield services.duniter.getPaymentsFor(ann.uuid)
    return ann
  }))

  function cleanForJSONAnswer(anns) {
    return co(function*(){
      const copies = []
      for (const ann of anns) {
        const copy = Announce.fromJSON(ann)
        copy.payments = yield services.duniter.getPaymentsFor(ann.uuid)
        copy.images = []
        copy.thumbnail = ann.thumbnail
        copy.account = Account.fromJSON(ann.account)
        copy.account.logo = null
        copies.push(copy)
      }
      return copies
    })
  }
}
