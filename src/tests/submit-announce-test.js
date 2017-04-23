"use strict";

const should = require('should')
const chai = require('chai')
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const path = require('path')
const co = require('co')
const rawer = require('../lib/rawer')
const common = require('duniter-common')
const entities = require('../lib/entities')
const instance = require('../lib/instance')
const fakeServer = require('./lib/fake-server')

let acc1Sig, ann1Sig, rawAcc1NoSig = '', rawAnn1NoSig = '', gchange

let user1 = common.keyring.Key(
  'HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd',
  '51w4fEShBk1jCMauWu4mLpmDVfHksKmWcygpxriqCEZizbtERA6de4STKRkQBpxmMUwsKXRjSzuQ8ECwmqN1u2DP'
)

describe('Announce submitting', () => {

  before(() => co(function*() {
    gchange = instance(fakeServer)
    // Mock account 1
    rawAcc1NoSig += 'Version: 1\n'
    rawAcc1NoSig += 'Document: Account\n'
    rawAcc1NoSig += 'Currency: g1\n'
    rawAcc1NoSig += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAcc1NoSig += 'Uuid: d34f195c-4689-45b1-92b8-870097effb1d\n'
    rawAcc1NoSig += 'Title: Account 1 with 10 chars\n'
    rawAcc1NoSig += 'Desc: A fake account for tests\n'
    rawAcc1NoSig += 'Address: In memory (with 10 chars)\n'
    rawAcc1NoSig += 'Logo: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAcc1NoSig += 'Links[0]: https://duniter.org\n'
    rawAcc1NoSig += 'Links[1]: https://duniter.org/fr\n'
    rawAcc1NoSig += 'Links[2]: https://duniter.org/en\n'
    acc1Sig = user1.signSync(rawAcc1NoSig)
    // Mock announce 1
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
    ann1Sig = user1.signSync(rawAnn1NoSig)
  }))

  it('announce with wrong format should be rejected', () => co(function*() {
    const raw = rawAnn1NoSig + 'wrong signature format'
    yield expect(gchange.services.announce.submit(raw)).to.be.rejectedWith('Wrong announce format')
  }))

  it('announce with wrong signature should be rejected', () => co(function*() {
    const raw = rawAnn1NoSig + 'vTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield expect(gchange.services.announce.submit(raw)).to.be.rejectedWith('Wrong signature')
  }))

  it('announce with no account should be rejected', () => co(function*() {
    const raw = rawAnn1NoSig + 'pmaU/YYxncMrndd/jEievLz/ArZGeTr24CviFj73tHCigZhuWnDVfKfSgJKYreMEJnqvX4wYu6CWm81f9FG0Aw=='
    yield expect(gchange.services.announce.submit(raw)).to.be.rejectedWith('The account must exist')
  }))

  it('announce with an account should be accepted', () => co(function*() {
    // Submitting account first
    const rawAcc = rawAcc1NoSig + 'vTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield gchange.services.account.submit(rawAcc)
    // Then submitting the announce
    const rawAnn = rawAnn1NoSig + 'pmaU/YYxncMrndd/jEievLz/ArZGeTr24CviFj73tHCigZhuWnDVfKfSgJKYreMEJnqvX4wYu6CWm81f9FG0Aw=='
    yield gchange.services.announce.submit(rawAnn)
  }))

  it('should exist 1 announce', () => co(function*() {
    yield expect(gchange.services.announce.listAll()).to.eventually.have.length(1)
  }))

  it('should exist 2 announces', () => co(function*() {
    let rawAnn2 = ''
    rawAnn2 += 'Version: 1\n'
    rawAnn2 += 'Document: Announce\n'
    rawAnn2 += 'Currency: g1\n'
    rawAnn2 += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAnn2 += 'Uuid: a9fe49ad-4689-45b1-92b8-870097effb1d\n'
    rawAnn2 += 'Title: Announce 2\n'
    rawAnn2 += 'Desc: Crowdfunding for developing ğchange\n'
    rawAnn2 += 'Price: 123456789.06\n'
    rawAnn2 += 'Fees: 98765.20\n'
    rawAnn2 += 'Type: Crowdfunding\n'
    rawAnn2 += 'Stock: 1\n'
    rawAnn2 += 'Images[0]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn2 += 'Images[1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn2 += 'Images[2]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn2 += user1.signSync(rawAnn2)
    yield gchange.services.announce.submit(rawAnn2)
    yield expect(gchange.services.announce.listAll()).to.eventually.have.length(2)
  }))

  it('should exist 2 announces after an update', () => co(function*() {
    let rawAnn2 = ''
    rawAnn2 += 'Version: 1\n'
    rawAnn2 += 'Document: Announce\n'
    rawAnn2 += 'Currency: g1\n'
    rawAnn2 += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAnn2 += 'Uuid: d34f195c-4689-45b1-92b8-870097effb1d\n'
    rawAnn2 += 'Title: Announce 1 (modified)\n'
    rawAnn2 += 'Desc: Crowdfunding for developing ğchange\n'
    rawAnn2 += 'Price: 123456789.06\n'
    rawAnn2 += 'Fees: 98765.20\n'
    rawAnn2 += 'Type: Crowdfunding\n'
    rawAnn2 += 'Stock: 1\n'
    rawAnn2 += 'Images[0]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn2 += 'Images[1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn2 += 'Images[2]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAnn2 += user1.signSync(rawAnn2)
    yield gchange.services.announce.submit(rawAnn2)
    yield expect(gchange.services.announce.listAll()).to.eventually.have.length(2)
  }))
})
