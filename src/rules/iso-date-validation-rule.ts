;
import {IValidationRule} from "./ivalidation-rule";

export class ISODateValidationRule implements IValidationRule
{
    public ruleName = "isoDate";
    private isoDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

    public validate(mr, prop): Promise<boolean>
    {
        var value = mr.get(prop);
        if (value === undefined || value === null)
        { return Promise.resolve(true); }

        var matchesRegex = this.isoDateRegex.test(value);
        return Promise.resolve(matchesRegex);
    }

    public getMessage(mr, prop) {
        var value = mr.get(prop);
        return `This field contains "${value}" which is not a valid ISO date`;
    }
}