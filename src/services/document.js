"use strict";

const Account = require('../lib/entities').Account
const Announce = require('../lib/entities').Announce
const rawer = require('../lib/rawer')
const sha256 = require('../lib/sha256')
const common = require('duniter-common')

module.exports = function () {
  return new CryptoService()
}

function CryptoService() {

  this.checkAccountFormat = (raw) => checkFormat(raw, Account)

  this.checkAnnounceFormat = (raw) => checkFormat(raw, Announce)

  function checkFormat(raw, entity) {
    const copy = entity.fromRaw(raw)
    const raw2 = entity.toRaw(copy)
    const sum1 = sha256(raw)
    const sum2 = sha256(raw2)
    return sum1 === sum2
  }

  this.checkAccountSignature = (acc) => checkSignature(acc, Account)

  this.checkAnnounceSignature = (acc) => checkSignature(acc, Announce)

  function checkSignature(entity, Type) {
    const copy = Type.fromJSON(entity)
    const sig = copy.sig
    copy.sig = ''
    const raw = Type.toRaw(copy)
    return common.keyring.verify(raw, sig, copy.pub)
  }
}
