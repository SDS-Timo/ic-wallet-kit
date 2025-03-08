
export interface testDefinition {
    name: string;
    input: any;
    data?: any;
    result?: any;
    error?: any;
}


export interface testValidateDefinition {
    name: string;
    input: testKeyValue;
    data?: testKeyValue;
    result?: any;
    error?: any;
}

export interface testValidate<T extends testValidateDefinition> {
    name: string;
    tests: T[];
}

export interface testKeyValue {
    key: string;
    value: any;
}