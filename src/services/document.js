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

  this.checkAccountFormat = (acc, raw) => {
    const copy = Account.fromJSON(acc)
    const raw2 = rawer.account(copy)
    const sum1 = sha256(raw)
    const sum2 = sha256(raw2)
    return sum1 === sum2
  }

  this.checkAnnounceFormat = (acc, raw) => {
    const copy = Announce.fromJSON(acc)
    const raw2 = rawer.announce(copy)
    const sum1 = sha256(raw)
    const sum2 = sha256(raw2)
    return sum1 === sum2
  }

  this.checkAccountSignature = (acc) => {
    const copy = Account.fromJSON(acc)
    const sig = copy.sig
    copy.sig = ''
    const raw = rawer.account(copy)
    return common.keyring.verify(raw, sig, copy.pub)
  }

  this.checkAnnounceSignature = (acc) => {
    const copy = Announce.fromJSON(acc)
    const sig = copy.sig
    copy.sig = ''
    const raw = rawer.announce(copy)
    return common.keyring.verify(raw, sig, copy.pub)
  }
}
