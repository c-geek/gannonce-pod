"use strict";

const should = require('should')
const chai = require('chai')
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const _ = require('underscore')
const path = require('path')
const co = require('co')
const rawer = require('../lib/rawer')
const common = require('duniter-common')
const bma = require('duniter-bma').duniter.methods.bma;
const entities = require('../lib/entities')
const instance = require('../lib/instance')

// Duniter Testing Tools
const toolbox = require('duniter/test/integration/tools/toolbox');
const user      = require('duniter/test/integration/tools/user');

let acc1Sig, rawAcc1NoSig = '', gchange, duniterNode

const i1pair = { pub: 'HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd', sec: '51w4fEShBk1jCMauWu4mLpmDVfHksKmWcygpxriqCEZizbtERA6de4STKRkQBpxmMUwsKXRjSzuQ8ECwmqN1u2DP'};
const i2pair = { pub: '2LvDg21dVXvetTD9GdkPLURavLYEqP3whauvPWX4c2qc', sec: '2HuRLWgKgED1bVio1tdpeXrf7zuUszv1yPHDsDj7kcMC4rVSN9RC58ogjtKNfTbH1eFz7rn38U1PywNs3m6Q7UxE'};

let user1 = common.keyring.Key(i1pair.pub, i1pair.sec)

const start = 1487000000;

describe('Account submitting', () => {

  before(() => co(function*() {
    duniterNode = toolbox.server(_.extend({
      memory: true,
      pair: i1pair,
      currency: 'DUN',
      sigQty: 1,
      udTime0: start,
      udReevalTime0: start,
      ud0: 100,
      dt: 1,
      dtReeval: 1,
      medianTimeBlocks: 1,
      avgGenTime: 300
    }, {}))
    gchange = instance(duniterNode)
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

    yield duniterNode.initWithDAL().then(bma).then((bmapi) => bmapi.openConnections())
    const i1 = user('idty1', i1pair, { server: duniterNode })
    const i2 = user('idty2', i2pair, { server: duniterNode })
    yield i1.createIdentity()
    yield i2.createIdentity()
    yield i1.cert(i2)
    yield i2.cert(i1)
    yield i1.join()
    yield i2.join()
    yield duniterNode.commit()
  }))

  it('account with wrong format should be rejected', () => co(function*() {
    const raw = rawAcc1NoSig + 'wrong signature format'
    yield expect(gchange.services.account.submit(raw)).to.be.rejectedWith('Wrong announce format')
  }))

  it('account with wrong signature should be rejected', () => co(function*() {
    const raw = rawAcc1NoSig + 'VTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield expect(gchange.services.account.submit(raw)).to.be.rejectedWith('Wrong signature')
  }))

  it('account with good signature but no money should be rejected', () => co(function*() {
    const raw = rawAcc1NoSig + 'vTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield expect(gchange.services.account.submit(raw)).to.be.rejectedWith('The account must own at least 1 Ğ1 to be created')
  }))

  it('account with good signature should be resolved', () => co(function*() {
    yield duniterNode.commit()
    const raw = rawAcc1NoSig + 'vTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield gchange.services.account.submit(raw)
  }))

  it('should exist 1 account', () => co(function*() {
    yield expect(gchange.services.account.listAll()).to.eventually.have.length(1)
  }))

  it('should exist 2 accounts', () => co(function*() {
    let rawAcc2 = ''
    rawAcc2 += 'Version: 1\n'
    rawAcc2 += 'Document: Account\n'
    rawAcc2 += 'Currency: g1\n'
    rawAcc2 += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAcc2 += 'Uuid: uh97r59d-4689-45b1-92b8-870097effb1d\n'
    rawAcc2 += 'Title: Account 1 with 10 chars\n'
    rawAcc2 += 'Desc: A fake account for tests\n'
    rawAcc2 += 'Address: In memory (with 10 chars)\n'
    rawAcc2 += 'Logo: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAcc2 += 'Links[0]: https://duniter.org\n'
    rawAcc2 += 'Links[1]: https://duniter.org/fr\n'
    rawAcc2 += 'Links[2]: https://duniter.org/en\n'
    rawAcc2 += user1.signSync(rawAcc2)
    yield gchange.services.account.submit(rawAcc2)
    yield expect(gchange.services.account.listAll()).to.eventually.have.length(2)
  }))

  it('should exist 2 accounts after an update', () => co(function*() {
    let rawAcc2 = ''
    rawAcc2 += 'Version: 1\n'
    rawAcc2 += 'Document: Account\n'
    rawAcc2 += 'Currency: g1\n'
    rawAcc2 += 'Pub: HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd\n'
    rawAcc2 += 'Uuid: d34f195c-4689-45b1-92b8-870097effb1d\n'
    rawAcc2 += 'Title: Account 1 (modified)\n'
    rawAcc2 += 'Desc: A fake account for tests\n'
    rawAcc2 += 'Address: In memory (with 10 chars)\n'
    rawAcc2 += 'Logo: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAg5JREFUKJE9kstLVGEAR3/fw/lG5502M6ChSJhETkFI0qoHWkqkCeNmFm4sMRD8Q2oV4aJNGwkMMpB2ZYsiBqeVc7UswkonvHPvOI87c1/eR4seZ3vO8gB/4YyIudvdSxsrUwVVmjfUnfvG29WZwtxU7xJnRPzrCAAk47znxfLUq5HxoQy4Dt/1/khGAUcgv75ZnF58PVGuOQeEMyI2nk5vjoyfzhxrDeiqgvLRMd5/NDE5GkE0nQRvDyO/li9eW3g3zGbHehbnF6/M2loNpiZDdMVQrVE4bhAnTsUR8BXA4ejpT6f2pW8Vmr1xJudZLVj1CngigoamocNRECYyHj/aBm8PwdZL8CwZ2evJHNlbvWV0DSSDNlWwpzogah0DmQSocGDJVYhuD7ZmgGrdqHxRTO42fsFRVHiJKg5/avgqWTh7tQ/EFwiJOhzNA20LgzYU+HoLtLhzJJFmHTDbcOliFL3BJtyigWOpAX27BH1fB6wo3KaJrV1bYtQmobEL4ZvMC4OlOJKdAbT2a2iVm2h1REASUfBqDLaq+Q9XKw8Ip0Q8v9tXuDwcHKKdabD+AAyzBM9nEPQkqAy4cgkfCmYx++T7MPN8uG8+NdfPR0KjqaCV8koaWD0FJnO4P8qwFM3PFwzp3rODiabtVcn/NSgRdwbjC5OZWG4wLc4BwO6hJb3cqq+sfa4tO55vAcBvXJrz3umEwZcAAAAASUVORK5CYII=\n'
    rawAcc2 += 'Links[0]: https://duniter.org\n'
    rawAcc2 += 'Links[1]: https://duniter.org/fr\n'
    rawAcc2 += 'Links[2]: https://duniter.org/en\n'
    rawAcc2 += user1.signSync(rawAcc2)
    yield gchange.services.account.submit(rawAcc2)
    yield expect(gchange.services.account.listAll()).to.eventually.have.length(2)
  }))
})
