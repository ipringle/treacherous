System.register([], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var FieldHasError;
    return {
        setters: [],
        execute: function () {
            FieldHasError = (function (_super) {
                __extends(FieldHasError, _super);
                function FieldHasError(message) {
                    var _this = _super.call(this, message) || this;
                    _this.message = message;
                    return _this;
                }
                return FieldHasError;
            }(Error));
            exports_1("FieldHasError", FieldHasError);
        }
    };
});