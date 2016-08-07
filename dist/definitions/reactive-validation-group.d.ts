import { EventHandler } from "event-js";
import { Ruleset } from "./rulesets/ruleset";
import { IModelWatcher } from "./watcher/imodel-watcher";
import { IFieldErrorProcessor } from "./processors/ifield-error-processor";
import { IRuleResolver } from "./rulesets/irule-resolver";
import { IValidationSettings } from "./settings/ivalidation-settings";
import { IReactiveValidationGroup } from "./ireactive-validation-group";
export declare class ReactiveValidationGroup implements IReactiveValidationGroup {
    private fieldErrorProcessor;
    private ruleResolver;
    private ruleset;
    private settings;
    refreshRate: number;
    propertyErrors: {};
    modelWatcher: IModelWatcher;
    private modelResolver;
    private promiseCounter;
    propertyStateChangedEvent: EventHandler;
    modelStateChangedEvent: EventHandler;
    constructor(fieldErrorProcessor: IFieldErrorProcessor, ruleResolver: IRuleResolver, ruleset: Ruleset, model: any, settings: IValidationSettings, refreshRate?: number);
    private isRuleset(possibleRuleset);
    private isForEach(possibleForEach);
    private onModelChanged;
    private validatePropertyWithRuleLinks;
    private validatePropertyWithRuleSet;
    private validatePropertyWithRules;
    private startValidateProperty;
    startValidateModel: () => this;
    hasErrors(): boolean;
    changeValidationTarget: (model: any) => void;
    validateProperty: (propertyname: any) => Promise<boolean>;
    validate: () => Promise<boolean>;
    getModelErrors: () => Promise<any>;
    getPropertyError: (propertyRoute: string) => Promise<any>;
    release: () => void;
}
