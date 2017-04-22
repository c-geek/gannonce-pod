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
    yield dao.updateOrCreateAccount(json)
    return json
  })

  this.listAll = () => dao.listAllAccounts()
}
