"use strict";

const validation = require('./validation-service')
const announce = require('./announce-service')
const account = require('./account-service')
const duniter = require('./duniter-service')

module.exports = { validation, announce, account, duniter }
