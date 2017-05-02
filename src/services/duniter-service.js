"use strict";

const co = require('co')
const constants = require('../lib/constants')

module.exports = function (dao, services, duniterNode) {
  return new DuniterService(dao, services, duniterNode)
}

function DuniterService(dao, services, duniterNode) {

  this.hasAtLeastOneG1 = (pub) => co(function*() {
    const src = yield duniterNode.dal.getAvailableSourcesByPubkey(pub)
    return src.length >= 1
  })

  this.getPaymentsFor = (uuid) => co(function*() {
    const txs = yield duniterNode.dal.txsDAL.query('SELECT * FROM txs WHERE comment like ?', ['GANNONCE:CROWDFUNDING:' + uuid])
    return txs
  })
}
