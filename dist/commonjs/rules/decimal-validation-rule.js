"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DecimalValidationRule = (function () {
    function DecimalValidationRule() {
        this.ruleName = "decimal";
        this.decimalRegex = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
    }
    DecimalValidationRule.prototype.validate = function (modelResolver, propertyName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value;
            return tslib_1.__generator(this, function (_a) {
                value = modelResolver.resolve(propertyName);
                if (value === undefined || value === null) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, this.decimalRegex.test(value)];
            });
        });
    };
    DecimalValidationRule.prototype.getMessage = function (modelResolver, propertyName) {
        var value = modelResolver.resolve(propertyName);
        return "This field contains " + value + " which is not a decimal value";
    };
    return DecimalValidationRule;
}());
exports.DecimalValidationRule = DecimalValidationRule;