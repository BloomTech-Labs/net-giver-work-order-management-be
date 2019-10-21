"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlIsoDate = require("graphql-iso-date");

var _user = _interopRequireDefault(require("./user"));

var _workorder = _interopRequireDefault(require("./workorder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const customScalarResolver = {
  Date: _graphqlIsoDate.GraphQLDateTime
};
var _default = [customScalarResolver, _user.default, _workorder.default];
exports.default = _default;
module.exports = exports.default;