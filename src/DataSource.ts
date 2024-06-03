import { Client } from 'pg';
export type DataSource<T> = {
    save: (collectionName: string, elements: T | T[]) => Promise<void>;
    show: (collectionName: string) => Promise<T[]>;
};

export class InMemoryDataSource<T> implements DataSource<T> {
    private db: Record<string, T[]>;

    constructor() {
        this.db = {};
    }

    async save(collectionName: string, elements: T | T[]): Promise<void> {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        if (!this.db[collectionName]) {
            this.db[collectionName] = [];
        }
        this.db[collectionName].push(...elements);
    }

    async show(collectionName: string): Promise<T[]> {
        return this.db[collectionName] || [];
    }
}
export class PostgresDataSource<T> implements DataSource<T> {
    private client: Client;

    constructor(clientConfig: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number
    }) {
        this.client = new Client(clientConfig);
        this.client.connect();
    }
    private async ensureTableExists(collectionName: string): Promise<void> {
        const checkTableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM pg_tables
                WHERE  schemaname = 'public'
                AND    tablename  = $1
            );
        `;
        const result = await this.client.query(checkTableExistsQuery, [collectionName]);
        if (!result.rows[0].exists) {
            const createTableQuery = `
                CREATE TABLE ${collectionName} (
                    id serial PRIMARY KEY,
                    data jsonb NOT NULL
                );
            `;
            await this.client.query(createTableQuery);
        }
    }

    async save(collectionName: string, elements: T | T[]): Promise<void> {
        await this.ensureTableExists(collectionName);

        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        const insertQuery = `INSERT INTO ${collectionName} (data) VALUES ($1::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
        for (const element of elements) {
            await this.client.query(insertQuery, [element]);
        }
    }

    async show(collectionName: string): Promise<T[]> {
        const selectQuery = `SELECT data FROM ${collectionName}`;
        const res = await this.client.query(selectQuery);
        return res.rows.map(row => row.data);
    }
}