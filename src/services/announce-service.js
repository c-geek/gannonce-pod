"use strict";

const co = require('co')
const constants = require('../lib/constants')
const Announce = require('../lib/entities').Announce

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
    // This publisher is the owner of this announce, continue.
    yield dao.updateOrCreateAnnounce(json)
    return json
  })

  this.listAll = () => dao.listAllAnnounces()

  this.listAllOpen = () => dao.listAllAnnouncesWithStock()

  this.listAnnouncesOf = (pub) => dao.listAnnouncesForPubkey(pub)

  this.search = (pattern) => dao.findAnnounces(pattern)

  this.getAnnounce = (uuid) => dao.getAnnounce(uuid)
}
