export class TypeHelper {
    static isDateType(value) {
        return (typeof value.getMonth === 'function');
    }
    static isFunctionType(value) {
        return (typeof value === 'function');
    }
    static isSimpleType(value) {
        return (typeof value == "string" || typeof value == "number");
    }
    static isArrayType(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
    static isEmptyValue(value) {
        return value === undefined || value === null || value.length == 0;
    }
    static isObjectOrArray(value) {
        return (!!value) && (value.constructor === Array || value.constructor === Object);
    }
    static isRuleset(possibleRuleset) {
        return (typeof (possibleRuleset.addRule) == "function");
    }
    static isForEach(possibleForEach) {
        return possibleForEach.isForEach;
    }
}
