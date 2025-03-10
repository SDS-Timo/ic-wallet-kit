# ILogger
Interface for user custom logger

### Example
```typescript
import { ILogger } from "@ic-wallet-kit/common";

export class Logger implements ILogger {
    log(message: string | undefined, params?: any[]): void {
        console.log("logger", message);
    }
    logDebug(message: string | undefined, params?: any[]): void {
        console.log("logger - debug", message);
        if (params) {
               console.log("logger - debug", params);
        }
    }
    logInformation(message: string | undefined, params?: any[]): void {
        console.log("logger - info", message);
        if (params) {
            console.log("logger - info", params);
        }
    }
    logWarning(message: string | undefined, params?: any[]): void {
        console.log("logger - warning", message);
    }
    logError(error: any, message?: string | undefined, params?: any[]): void {
        console.log("logger - error", error);
    }
    logCritical(error: any, message?: string | undefined, params?: any[]): void {
        console.log(error);
        console.log("logger - critical", message);
    }
}
```