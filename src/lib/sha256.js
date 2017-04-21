"use strict";

module.exports = (str) => require("crypto")
  .createHash("sha256")
  .update(str)
  .digest("hex")
