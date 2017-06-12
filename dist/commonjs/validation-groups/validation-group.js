"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rule_resolver_1 = require("../rulesets/rule-resolver");
var type_helper_1 = require("../helpers/type-helper");
var promise_counter_1 = require("../promises/promise-counter");
var property_state_changed_event_1 = require("../events/property-state-changed-event");
var model_state_changed_event_1 = require("../events/model-state-changed-event");
var event_js_1 = require("event-js");
// TODO: This class could be simplified
var ValidationGroup = (function () {
    function ValidationGroup(fieldErrorProcessor, ruleResolver, modelResolverFactory, model, ruleset) {
        if (ruleResolver === void 0) { ruleResolver = new rule_resolver_1.RuleResolver(); }
        var _this = this;
        this.fieldErrorProcessor = fieldErrorProcessor;
        this.ruleResolver = ruleResolver;
        this.modelResolverFactory = modelResolverFactory;
        this.ruleset = ruleset;
        this.propertyErrors = {};
        this.validatePropertyWithRuleLinks = function (propertyName, propertyRules) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activePromise, possibleErrors, hadErrors, eventArgs, stillHasErrors, previousError, eventArgs;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activePromise = this.fieldErrorProcessor.checkFieldForErrors(this.modelResolver, propertyName, propertyRules);
                        return [4 /*yield*/, this.promiseCounter.countPromise(activePromise)];
                    case 1:
                        possibleErrors = _a.sent();
                        hadErrors = this.hasErrors();
                        if (!possibleErrors) {
                            if (this.propertyErrors[propertyName]) {
                                delete this.propertyErrors[propertyName];
                                eventArgs = new property_state_changed_event_1.PropertyStateChangedEvent(propertyName, true);
                                this.propertyStateChangedEvent.publish(eventArgs);
                                stillHasErrors = hadErrors && this.hasErrors();
                                if (!stillHasErrors) {
                                    this.modelStateChangedEvent.publish(new model_state_changed_event_1.ModelStateChangedEvent(true));
                                }
                            }
                            return [2 /*return*/, this.promiseCounter.waitForCompletion()];
                        }
                        previousError = this.propertyErrors[propertyName];
                        this.propertyErrors[propertyName] = possibleErrors;
                        if (possibleErrors != previousError) {
                            eventArgs = new property_state_changed_event_1.PropertyStateChangedEvent(propertyName, false, possibleErrors);
                            this.propertyStateChangedEvent.publish(eventArgs);
                            if (!hadErrors) {
                                this.modelStateChangedEvent.publish(new model_state_changed_event_1.ModelStateChangedEvent(false));
                            }
                        }
                        return [2 /*return*/, this.promiseCounter.waitForCompletion()];
                }
            });
        }); };
        this.validatePropertyWithRuleSet = function (propertyRoute, ruleset) {
            var transformedPropertyName;
            for (var childPropertyName in ruleset.rules) {
                transformedPropertyName = propertyRoute + "." + childPropertyName;
                _this.validatePropertyWithRules(transformedPropertyName, ruleset.getRulesForProperty(childPropertyName));
            }
        };
        this.validatePropertyWithRules = function (propertyRoute, rules) {
            var ruleLinks = [];
            var ruleSets = [];
            var currentValue;
            try {
                currentValue = _this.modelResolver.resolve(propertyRoute);
            }
            catch (ex) {
                console.warn("Failed to resolve property " + propertyRoute + " during validation. Does it exist in your model?");
                throw (ex);
            }
            var routeEachRule = function (ruleLinkOrSet) {
                if (ValidationGroup.isForEach(ruleLinkOrSet)) {
                    var isCurrentlyAnArray = type_helper_1.TypeHelper.isArrayType(currentValue);
                    if (isCurrentlyAnArray) {
                        currentValue.forEach(function (element, index) {
                            var childPropertyName = propertyRoute + "[" + index + "]";
                            _this.validatePropertyWithRules(childPropertyName, [ruleLinkOrSet.internalRule]);
                        });
                    }
                    else {
                        if (ValidationGroup.isRuleset(ruleLinkOrSet.internalRule)) {
                            ruleSets.push(ruleLinkOrSet.internalRule);
                        }
                        else {
                            ruleLinks.push(ruleLinkOrSet.internalRule);
                        }
                    }
                }
                else if (ValidationGroup.isRuleset(ruleLinkOrSet)) {
                    ruleSets.push(ruleLinkOrSet);
                }
                else {
                    ruleLinks.push(ruleLinkOrSet);
                }
            };
            rules.forEach(routeEachRule);
            _this.validatePropertyWithRuleLinks(propertyRoute, ruleLinks);
            ruleSets.forEach(function (ruleSet) {
                _this.validatePropertyWithRuleSet(propertyRoute, ruleSet);
            });
        };
        this.startValidateProperty = function (propertyRoute) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var rulesForProperty;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.ruleset.compositeRules !== {})) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateCompositeRules()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        rulesForProperty = this.ruleResolver.resolvePropertyRules(propertyRoute, this.ruleset);
                        if (!rulesForProperty) {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/, this.validatePropertyWithRules(propertyRoute, rulesForProperty)];
                }
            });
        }); };
        this.validateCompositeRule = function (compositeRule) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var hadErrors, isValid, eventArgs, stillHasErrors, previousError, currentError, eventArgs;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hadErrors = this.hasErrors();
                        return [4 /*yield*/, compositeRule.validate(this.modelResolver)];
                    case 1:
                        isValid = _a.sent();
                        if (!isValid) return [3 /*break*/, 3];
                        if (this.propertyErrors[compositeRule.propertyName]) {
                            delete this.propertyErrors[compositeRule.propertyName];
                            eventArgs = new property_state_changed_event_1.PropertyStateChangedEvent(compositeRule.propertyName, true);
                            this.propertyStateChangedEvent.publish(eventArgs);
                        }
                        stillHasErrors = hadErrors && this.hasErrors();
                        if (!stillHasErrors) {
                            this.modelStateChangedEvent.publish(new model_state_changed_event_1.ModelStateChangedEvent(true));
                        }
                        return [4 /*yield*/, this.promiseCounter.waitForCompletion()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        previousError = this.propertyErrors[compositeRule.propertyName];
                        currentError = compositeRule.getMessage(this.modelResolver);
                        this.propertyErrors[compositeRule.propertyName] = currentError;
                        if (currentError != previousError) {
                            eventArgs = new property_state_changed_event_1.PropertyStateChangedEvent(compositeRule.propertyName, false, currentError);
                            this.propertyStateChangedEvent.publish(eventArgs);
                            if (!hadErrors) {
                                this.modelStateChangedEvent.publish(new model_state_changed_event_1.ModelStateChangedEvent(false));
                            }
                        }
                        return [4 /*yield*/, this.promiseCounter.waitForCompletion()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.propertyErrors[compositeRule.propertyName]];
                }
            });
        }); };
        this.validateCompositeRules = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _i, propertyName, compositeRule;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.ruleset.compositeRules)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        propertyName = _a[_i];
                        compositeRule = this.ruleset.compositeRules[propertyName];
                        return [4 /*yield*/, this.validateCompositeRule(compositeRule)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.startValidateModel = function () {
            for (var parameterName in _this.ruleset.rules) {
                _this.startValidateProperty(parameterName);
            }
        };
        this.changeValidationTarget = function (model) {
            _this.modelResolver = _this.modelResolverFactory.createModelResolver(model);
        };
        this.validateProperty = function (propertyRoute) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.startValidateProperty(propertyRoute)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.promiseCounter.waitForCompletion()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, !this.propertyErrors[propertyRoute]];
                }
            });
        }); };
        this.validate = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.startValidateModel()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.promiseCounter.waitForCompletion()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, !this.hasErrors()];
                }
            });
        }); };
        this.getModelErrors = function (revalidate) {
            if (revalidate === void 0) { revalidate = false; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!revalidate) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.startValidateModel()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.promiseCounter.waitForCompletion()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, this.propertyErrors];
                    }
                });
            });
        };
        this.getPropertyError = function (propertyRoute, revalidate) {
            if (revalidate === void 0) { revalidate = false; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!revalidate) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.startValidateProperty(propertyRoute)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.promiseCounter.waitForCompletion()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, this.propertyErrors[propertyRoute]];
                    }
                });
            });
        };
        this.release = function () { };
        this.propertyStateChangedEvent = new event_js_1.EventHandler(this);
        this.modelStateChangedEvent = new event_js_1.EventHandler(this);
        this.promiseCounter = new promise_counter_1.PromiseCounter();
        this.modelResolver = this.modelResolverFactory.createModelResolver(model);
    }
    ValidationGroup.isRuleset = function (possibleRuleset) {
        return (typeof (possibleRuleset.addRule) == "function");
    };
    ValidationGroup.isForEach = function (possibleForEach) {
        return possibleForEach.isForEach;
    };
    ValidationGroup.prototype.hasErrors = function () {
        return (Object.keys(this.propertyErrors).length > 0);
    };
    return ValidationGroup;
}());
exports.ValidationGroup = ValidationGroup;
