export declare function getPropertyName<T extends object>(o: T, expression: (x: {
    [Property in keyof T]: string;
}) => string): string;
