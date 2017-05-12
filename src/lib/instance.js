"use strict";

const co = require('co')
const sharp = require('sharp')
const services = require('../services')
const DAO = require('../dao')
const Announce = require('../lib/entities').Announce

module.exports = function Instance(duniterNode, dao) {
  return new GchangeInstance(duniterNode, dao)
}

function GchangeInstance(duniterNode, dao) {

  if (!dao) {
    // Default: in-memory LokiJS Dao
    dao = new DAO.LokiJSDao()
  }

  this.duniterNode = duniterNode
  this.dao = dao
  this.services = {}
  this.services.validation = services.validation()
  this.services.account = services.account(this.dao, this.services)
  this.services.announce = services.announce(this.dao, this.services)
  this.services.duniter = services.duniter(this.dao, this.services, duniterNode)

  this.processUpdates = () => co(function*() {
    const announcesWithoutThumbnail = yield dao.findAnnouncesWithoutThumbnail()
    for (const row of announcesWithoutThumbnail) {
      const ann = Announce.fromJSON(row)
      const thumbnailImage = ann.getFirstImage()
      if (thumbnailImage) {
        thumbnailImage.buffer = yield sharp(thumbnailImage.buffer)
          .resize(40,40)
          .toBuffer()
        ann.thumbnail = 'data:image/' + thumbnailImage.extension + ';base64,' + thumbnailImage.buffer.toString('base64')
        yield dao.updateOrCreateAnnounce(ann)
      }
    }
  })
}