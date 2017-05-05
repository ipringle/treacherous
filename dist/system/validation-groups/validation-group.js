System.register(["../rulesets/rule-resolver", "../helpers/type-helper", "../promises/promise-counter", "../events/property-state-changed-event", "../events/model-state-changed-event", "event-js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __moduleName = context_1 && context_1.id;
    var rule_resolver_1, type_helper_1, promise_counter_1, property_state_changed_event_1, model_state_changed_event_1, event_js_1, ValidationGroup;
    return {
        setters: [
            function (rule_resolver_1_1) {
                rule_resolver_1 = rule_resolver_1_1;
            },
            function (type_helper_1_1) {
                type_helper_1 = type_helper_1_1;
            },
            function (promise_counter_1_1) {
                promise_counter_1 = promise_counter_1_1;
            },
            function (property_state_changed_event_1_1) {
                property_state_changed_event_1 = property_state_changed_event_1_1;
            },
            function (model_state_changed_event_1_1) {
                model_state_changed_event_1 = model_state_changed_event_1_1;
            },
            function (event_js_1_1) {
                event_js_1 = event_js_1_1;
            }
        ],
        execute: function () {
            // TODO: This class could be simplified
            ValidationGroup = (function () {
                function ValidationGroup(fieldErrorProcessor, ruleResolver, modelResolverFactory, model, ruleset) {
                    if (ruleResolver === void 0) { ruleResolver = new rule_resolver_1.RuleResolver(); }
                    var _this = this;
                    this.fieldErrorProcessor = fieldErrorProcessor;
                    this.ruleResolver = ruleResolver;
                    this.modelResolverFactory = modelResolverFactory;
                    this.ruleset = ruleset;
                    this.propertyErrors = {};
                    this.validatePropertyWithRuleLinks = function (propertyName, propertyRules) {
                        return _this.promiseCounter.countPromise(_this.fieldErrorProcessor.checkFieldForErrors(_this.modelResolver, propertyName, propertyRules))
                            .then(function (possibleErrors) {
                            var hadErrors = _this.hasErrors();
                            if (!possibleErrors) {
                                if (_this.propertyErrors[propertyName]) {
                                    delete _this.propertyErrors[propertyName];
                                    var eventArgs = new property_state_changed_event_1.PropertyStateChangedEvent(propertyName, true);
                                    _this.propertyStateChangedEvent.publish(eventArgs);
                                    var stillHasErrors = hadErrors && _this.hasErrors();
                                    if (!stillHasErrors) {
                                        _this.modelStateChangedEvent.publish(new model_state_changed_event_1.ModelStateChangedEvent(true));
                                    }
                                }
                                return;
                            }
                            var previousError = _this.propertyErrors[propertyName];
                            _this.propertyErrors[propertyName] = possibleErrors;
                            if (possibleErrors != previousError) {
                                var eventArgs = new property_state_changed_event_1.PropertyStateChangedEvent(propertyName, false, possibleErrors);
                                _this.propertyStateChangedEvent.publish(eventArgs);
                                if (!hadErrors) {
                                    _this.modelStateChangedEvent.publish(new model_state_changed_event_1.ModelStateChangedEvent(false));
                                }
                            }
                        })
                            .then(_this.promiseCounter.waitForCompletion);
                    };
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
                            if (_this.isForEach(ruleLinkOrSet)) {
                                var isCurrentlyAnArray = type_helper_1.TypeHelper.isArrayType(currentValue);
                                if (isCurrentlyAnArray) {
                                    currentValue.forEach(function (element, index) {
                                        var childPropertyName = propertyRoute + "[" + index + "]";
                                        _this.validatePropertyWithRules(childPropertyName, [ruleLinkOrSet.internalRule]);
                                    });
                                }
                                else {
                                    if (_this.isRuleset(ruleLinkOrSet.internalRule)) {
                                        ruleSets.push(ruleLinkOrSet.internalRule);
                                    }
                                    else {
                                        ruleLinks.push(ruleLinkOrSet.internalRule);
                                    }
                                }
                            }
                            else if (_this.isRuleset(ruleLinkOrSet)) {
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
                        return _this;
                    };
                    this.startValidateProperty = function (propertyRoute) {
                        var rulesForProperty = _this.ruleResolver.resolvePropertyRules(propertyRoute, _this.ruleset);
                        if (!rulesForProperty) {
                            return _this;
                        }
                        return _this.validatePropertyWithRules(propertyRoute, rulesForProperty);
                    };
                    this.startValidateModel = function () {
                        for (var parameterName in _this.ruleset.rules) {
                            _this.startValidateProperty(parameterName);
                        }
                        return _this;
                    };
                    this.changeValidationTarget = function (model) {
                        _this.modelResolver = _this.modelResolverFactory.createModelResolver(model);
                    };
                    this.validateProperty = function (propertyRoute) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.startValidateProperty(propertyRoute)
                                        .promiseCounter.waitForCompletion()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, !this.propertyErrors[propertyRoute]];
                            }
                        });
                    }); };
                    this.validate = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.startValidateModel().promiseCounter.waitForCompletion()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, !this.hasErrors()];
                            }
                        });
                    }); };
                    this.getModelErrors = function (revalidate) {
                        if (revalidate === void 0) { revalidate = false; }
                        return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, revalidate];
                                    case 1:
                                        (_a.sent()) ?
                                            this.startValidateModel().promiseCounter.waitForCompletion() :
                                            this.promiseCounter.waitForCompletion();
                                        return [2 /*return*/, this.propertyErrors];
                                }
                            });
                        });
                    };
                    this.getPropertyError = function (propertyRoute, revalidate) {
                        if (revalidate === void 0) { revalidate = false; }
                        return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, revalidate];
                                    case 1:
                                        (_a.sent()) ?
                                            this.startValidateProperty(propertyRoute).promiseCounter.waitForCompletion() :
                                            this.promiseCounter.waitForCompletion();
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
                ValidationGroup.prototype.isRuleset = function (possibleRuleset) {
                    return (typeof (possibleRuleset.addRule) == "function");
                };
                ValidationGroup.prototype.isForEach = function (possibleForEach) {
                    return possibleForEach.isForEach;
                };
                ValidationGroup.prototype.hasErrors = function () {
                    return (Object.keys(this.propertyErrors).length > 0);
                };
                return ValidationGroup;
            }());
            exports_1("ValidationGroup", ValidationGroup);
        }
    };
});