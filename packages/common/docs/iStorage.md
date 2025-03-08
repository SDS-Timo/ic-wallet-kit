# IStorage
Interface to user custom storage or browser localStorage

### Example
```typescript
import { IStorage } from "@ic-wallet-middleware/common";

interface Item {
    key: string;
    value: string;
}

class DataStorage implements IStorage {

    private items: Item[] = []

    getItem(key: string): string | null {
        let item = this.items.find(i => i.key == key);

        if (item) {
            return item.value;
        }
        else {
            return null;
        }
    }

    setItem(key: string, value: string): void {
        let item = this.items.find(i => i.key == key);

        if (item) {
            item.value = value;
        }
        else {
            this.items.push({ key: key, value: value });
        }

    }
    removeItem(key: string): void {
        this.items = this.items.filter(i => i.key != key);
    }

}
```