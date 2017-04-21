"use strict";

const Account = require('../lib/entities').Account
const Announce = require('../lib/entities').Announce
const rawer = require('../lib/rawer')
const common = require('duniter-common')

module.exports = function () {
  return new CryptoService()
}

function CryptoService() {

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
