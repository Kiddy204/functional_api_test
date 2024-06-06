import { Entity } from "./interface";

export interface DataStore<T extends Entity> {
    save: (elements: T | T[]) => Promise<T[]>;
    show: (id?: string | string[]) => Promise<T[] | undefined>;
    clear: () => Promise<void>;
    remove: (id: string | string[]) => Promise<void>;
}
export class InMemoryDataStore<T extends Entity> implements DataStore<T> {
    collectionName: string;
    private db: Record<string, T[]>;
    private indexMap: Record<string, Map<string, number>>;

    constructor(collectionName: string) {
        this.db = {};
        this.collectionName = collectionName
        this.indexMap = {};
        if (!this.indexMap[this.collectionName]) {
            this.indexMap[this.collectionName] = new Map();
        }
    }

    async save(elements: T | T[]): Promise<T[]> {
        console.log('X')
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        if (!this.db[this.collectionName]) {
            this.db[this.collectionName] = [];
        }
        const collection = this.db[this.collectionName];
        const indexMap = this.indexMap[this.collectionName];
        console.log('IN')
        for (const element of elements) {
            console.log('FOR')
            if (indexMap.has(element.id)) {
                const index = indexMap.get(element.id)!;
                collection[index] = element;
            } else {
                indexMap.set(element.id, collection.length);
                collection.push(element);
            }
        }
        console.log('OUT')


        return collection;
    }

    async show(): Promise<T[]>   {
        return this.db[this.collectionName] || [];
    }

    async clear(): Promise<void> {
        this.db[this.collectionName]=[]
    }

    async remove(id: string | string[]): Promise<void> {
        if (!Array.isArray(id)) {
            id = [id];
        }
    
        const indexMap = this.indexMap[this.collectionName];
        const collection = this.db[this.collectionName];
    
        if (!collection || !indexMap) {
            return;
        }
    
        const idsToRemove = new Set(id);
        const newCollection: T[] = [];
        const newIndexMap = new Map<string, number>();
    
        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (!idsToRemove.has(item.id)) {
                newIndexMap.set(item.id, newCollection.length);
                newCollection.push(item);
            }
        }
    
        this.db[this.collectionName] = newCollection;
        this.indexMap[this.collectionName] = newIndexMap;
    }
    
}
