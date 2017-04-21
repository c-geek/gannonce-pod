"use strict";

const should = require('should')
const path = require('path')
const co = require('co')
const qfs = require('q-io/fs')
const rawer = require('../lib/rawer')
const common = require('duniter-common')
const entities = require('../lib/entities')
const cryptoService = require('../services/crypto')()

let acc1, ann1, rawAcc1NoSig = '', rawAnn1NoSig = ''

let user1 = common.keyring.Key(
  'HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd',
  '51w4fEShBk1jCMauWu4mLpmDVfHksKmWcygpxriqCEZizbtERA6de4STKRkQBpxmMUwsKXRjSzuQ8ECwmqN1u2DP'
)

describe('Validation', () => {

  before(() => co(function*() {
    const img = yield qfs.read(path.join(__dirname, 'data/g1.png'), 'b')
    // Mock account 1
    acc1 = {
      pub: 'HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd',
      uuid: 'd34f195c-4689-45b1-92b8-870097effb1d',
      title: 'Account 1',
      desc: 'A fake account for tests',
      address: 'In memory',
      logo: {
        extension: 'png',
        buffer: img
      },
      links: [
        'https://duniter.org',
        'https://duniter.org/fr',
        'https://duniter.org/en'
      ]
    }
    rawAcc1NoSig += 'Version: 1\n'
    rawAcc1NoSig += 'Document: Account\n'
    rawAcc1NoSig += 'Currency: g1\n'
    rawAcc1NoSig += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAcc1NoSig += 'Uuid: d34f195c-4689-45b1-92b8-870097effb1d\n'
    rawAcc1NoSig += 'Title: Account 1\n'
    rawAcc1NoSig += 'Desc: A fake account for tests\n'
    rawAcc1NoSig += 'Address: In memory\n'
    rawAcc1NoSig += 'Logo: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAcc1NoSig += 'Links[0]: https://duniter.org\n'
    rawAcc1NoSig += 'Links[1]: https://duniter.org/fr\n'
    rawAcc1NoSig += 'Links[2]: https://duniter.org/en\n'
    acc1.sig = user1.signSync(rawer.account(acc1))
    // Mock announce 1
    ann1 = {
      pub: 'HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd',
      uuid: 'd34f195c-4689-45b1-92b8-870097effb1d',
      title: 'Announce 1',
      desc: 'Crowdfunding for developing ğchange',
      price: '123456789.06',
      fees: '98765.20',
      type: 'Crowdfunding',
      stock: '1',
      images: [
        { extension: 'png', buffer: img },
        { extension: 'png', buffer: img },
        { extension: 'png', buffer: img }
      ]
    }
    rawAnn1NoSig += 'Version: 1\n'
    rawAnn1NoSig += 'Document: Announce\n'
    rawAnn1NoSig += 'Currency: g1\n'
    rawAnn1NoSig += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAnn1NoSig += 'Uuid: d34f195c-4689-45b1-92b8-870097effb1d\n'
    rawAnn1NoSig += 'Title: Announce 1\n'
    rawAnn1NoSig += 'Desc: Crowdfunding for developing ğchange\n'
    rawAnn1NoSig += 'Price: 123456789.06\n'
    rawAnn1NoSig += 'Fees: 98765.20\n'
    rawAnn1NoSig += 'Type: Crowdfunding\n'
    rawAnn1NoSig += 'Stock: 1\n'
    rawAnn1NoSig += 'Images[0]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn1NoSig += 'Images[1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn1NoSig += 'Images[2]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    ann1.sig = user1.signSync(rawer.announce(ann1))
  }))

  it('account should have good formatting', () => co(function*() {
    const raw = rawer.account(acc1)
    let expected = rawAcc1NoSig
    expected += 'PmoKBFEXjQhoxYubhIizm8eCBY7MibRr2G/PZLZtoMiqxN9+alCA66HiapRyEtp+zCUF+w7WWWeRaXRPIVX9Dw=='
    raw.should.equal(expected)
  }))

  it('announce should have good formatting', () => co(function*() {
    const raw = rawer.announce(ann1)
    let expected = rawAnn1NoSig
    expected += 'pmaU/YYxncMrndd/jEievLz/ArZGeTr24CviFj73tHCigZhuWnDVfKfSgJKYreMEJnqvX4wYu6CWm81f9FG0Aw=='
    raw.should.equal(expected)
  }))

  it('good account should have good signature', () => {
    cryptoService.checkAccountSignature(acc1).should.equal(true)
  })

  it('wrong account should have wrong signature', () => {
    const acc2 = entities.Account.fromJSON(acc1)
    acc2.title = 'Wrong title'
    cryptoService.checkAccountSignature(acc2).should.equal(false)
  })

  it('good annouce should have good signature', () => {
    cryptoService.checkAnnounceSignature(ann1).should.equal(true)
  })

  it('wrong annouce should have wrong signature', () => {
    const ann2 = entities.Announce.fromJSON(ann1)
    ann2.title = 'Wrong title'
    cryptoService.checkAnnounceSignature(ann2).should.equal(false)
  })
})
