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

let acc1Sig, rawAcc1NoSig = '', gchange

let user1 = common.keyring.Key(
  'HgTTJLAQ5sqfknMq7yLPZbehtuLSsKj9CxWN7k8QvYJd',
  '51w4fEShBk1jCMauWu4mLpmDVfHksKmWcygpxriqCEZizbtERA6de4STKRkQBpxmMUwsKXRjSzuQ8ECwmqN1u2DP'
)

describe('Account submitting', () => {

  before(() => co(function*() {
    gchange = instance()
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
  }))

  it('account with wrong format should be rejected', () => co(function*() {
    const raw = rawAcc1NoSig + 'wrong signature format'
    yield expect(gchange.services.account.submit(raw)).to.be.rejectedWith('Wrong announce format')
  }))

  it('account with wrong signature should be rejected', () => co(function*() {
    const raw = rawAcc1NoSig + 'VTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield expect(gchange.services.account.submit(raw)).to.be.rejectedWith('Wrong signature')
  }))

  it('account with good signature should be resolved', () => co(function*() {
    const raw = rawAcc1NoSig + 'vTJVVFRL5PXTtxm5smXeWvfRvVJjKuvKfke9Wz1BQI4Kra0Ljd/dm1cHdQzWU4DF3Vhj7rSAvbHFVI3BNDSZAA=='
    yield gchange.services.account.submit(raw)
  }))
})
