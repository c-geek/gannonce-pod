"use strict";

const co = require('co')
const constants = require('../lib/constants')
const Account = require('../lib/entities').Account

module.exports = function (dao, services) {
  return new AccountService(dao, services)
}

function AccountService(dao, services) {

  this.submit = (raw) => co(function*() {
    const validFormat = services.validation.checkAccountFormat(raw)
    if (!validFormat) {
      throw constants.ERRORS.WRONG_FORMAT_ACCOUNT
    }
    const json = Account.fromRaw(raw)
    const validSig = services.validation.checkAccountSignature(json)
    if (!validSig) {
      throw constants.ERRORS.WRONG_SIGNATURE
    }
    // Authenticated document, legit. Process.
    let acc = yield dao.getAccountByUuid(json.uuid)
    if (acc && acc.pub !== json.pub) {
      throw constants.ERRORS.NOT_THE_ACCOUNT_OWNER
    }
    acc = yield dao.getAccount(json.pub)
    if (acc && acc.uuid !== json.uuid) {
      throw constants.ERRORS.ONE_ACCOUNT_PER_PUBKEY
    }
    // This publisher is the owner of this announce, continue.
    const isAuthorizedToCreateAnAccount = yield services.duniter.hasAtLeastOneG1(json.pub)
    if (!isAuthorizedToCreateAnAccount) {
      throw constants.ERRORS.UNAUTHORIZED_ACCOUNT_CREATION
    }
    // Has enough units
    yield dao.updateOrCreateAccount(json)
    return json
  })

  this.listAll = () => dao.listAllAccounts()

  this.getAccount = (pub) => dao.getAccount(pub)
}
