"use strict";

const co = require('co')

module.exports = function HttpApi(app, instance) {

  handleRequest(app.get.bind(app), '/account', (req, res) => co(function *() {
    return { ok: 'true' }
  }))

  handleRequest(app.get.bind(app), '/account/:pub', (req, res) => co(function *() {
    const pub = req.params && req.params.pub
    if (!pub) {
      throw "Parameter `pub` is mandatory"
    }
    const acc = yield instance.services.account.getAccount(pub)
    const result = { acc }
    if (!acc) {
      result.enoughMoney = (yield instance.duniterNode.dal.getAvailableSourcesByPubkey(pub)).length > 0
    }
    return result
  }))

  handleRequest(app.post.bind(app), '/account', (req, res) => co(function *() {
    const account = req.body.account
    if (!account) {
      throw "Parameter `account` is mandatory"
    }
    const acc = yield instance.services.account.submit(account)
    return { acc }
  }))

  handleRequest(app.get.bind(app), '/announces', (req, res) => co(function *() {
    let limit = req.query.limit ? parseInt(req.query.limit) : 30
    if (!limit) {
      limit = 100
    }
    let page = req.query.page ? parseInt(req.query.page) : 1
    if (!page) {
      page = 1
    }
    return yield instance.services.announce.listAllOpen(limit, page)
  }))

  handleRequest(app.get.bind(app), '/announces/:pub', (req, res) => co(function *() {
    const pub = req.params.pub
    if (!pub) {
      throw "Parameter `pub` is mandatory"
    }
    const announces = yield instance.services.announce.listAnnouncesOf(pub)
    return { announces }
  }))

  handleRequest(app.get.bind(app), '/announce/:uuid', (req, res) => co(function *() {
    const uuid = req.params.uuid
    if (!uuid) {
      throw "Parameter `uuid` is mandatory"
    }
    const announce = yield instance.services.announce.getAnnounce(uuid)
    return { announce }
  }))

  handleRequest(app.post.bind(app), '/announce', (req, res) => co(function *() {
    const announce = req.body.announce
    if (!announce) {
      throw "Parameter `announce` is mandatory"
    }
    const ann = yield instance.services.announce.submit(announce)
    return { ann }
  }))
}

const handleRequest = (method, uri, promiseFunc) => {
  method(uri, function(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    co(function *() {
      try {
        let result = yield promiseFunc(req);
        // HTTP answer
        res.status(200).send(JSON.stringify(result, null, "  "));
      } catch (e) {
        // HTTP error
        res.status(400).send(JSON.stringify({ error: e }, null, " "));
        console.error(e);
      }
    });
  });
};
