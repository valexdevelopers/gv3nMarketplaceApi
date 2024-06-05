import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function confirmFieldDecorator(property:string, validationOptions?: ValidationOptions){
    return (object:any, propertyName:string) => {
        registerDecorator({
            name: "ConfirmFieldValidator",
            target: object.constructor,
            propertyName,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return value === relatedValue;
            },
            defaultMessage(args: ValidationArguments) {
                const [relatedPropertyName] = args.constraints;
                return `${relatedPropertyName} and ${propertyName} are not the same`;
            }

            },
        });
    }
}

