define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModelStateChangedEvent = (function () {
        function ModelStateChangedEvent(isValid) {
            this.isValid = isValid;
        }
        return ModelStateChangedEvent;
    }());
    exports.ModelStateChangedEvent = ModelStateChangedEvent;
});