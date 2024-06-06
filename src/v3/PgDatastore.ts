import { Client } from 'pg';
import { DataStore } from './DataStore';
import { Entity } from './interface';



// export class PgDatastore<T extends Entity> implements DataStore<T> {
//     private client: Client;
//     private tableName: string;
//     private clientConfig: any;

//     constructor(tableName: string) {
//         this.clientConfig = {
//             user : 'dev',
//             host : 'localhost',
//             database : 'test',
//             password: 'dev',
//             port: 5432
//         }
//         this.client = new Client(this.clientConfig);
//         this.tableName = tableName;
//     }
//     private async getClient(): Promise<Client> {
//         const client = new Client(this.clientConfig);
//         await client.connect();
//         return client;
//     }

//     // async save(elements: T | T[]): Promise<T[]> {
//     //     if (!Array.isArray(elements)) {
//     //         elements = [elements];
//     //     }
//     //     const client = await this.client.connect();
//     //     try {
//     //         const values = elements.map(e => `('${e.id}', '${e.createdAt.toISOString()}', '${e.updatedAt.toISOString()}')`);
//     //         const query = `
//     //             INSERT INTO ${this.tableName} (id, created_at, updated_at) VALUES ${values.join(', ')}
//     //             ON CONFLICT (id) DO UPDATE 
//     //             SET created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at
//     //             RETURNING *;
//     //         `;
//     //         const result = await client.query(query);
//     //         return result.rows;
//     //     } finally {
//     //         client.release();
//     //     }
//     // }
//     async save(elements: T | T[]): Promise<T[]> {
//         if (!Array.isArray(elements)) {
//             elements = [elements];
//         }
//         const client = await this.getClient();
//         const columns = Object.keys(elements[0]).map(key => `"${key}"`).join(', ');
//         const values = elements.map(e =>
//             `(${Object.values(e).map(val => `'${val instanceof Date ? val.toISOString() : val}'`).join(', ')})`
//         ).join(', ');

//         const updateClause = Object.keys(elements[0]).map(key => `"${key}" = EXCLUDED."${key}"`).join(', ');

//         const query = `
//                 INSERT INTO ${this.tableName} (${columns})
//                 VALUES ${values}
//                 ON CONFLICT (id) DO UPDATE 
//                 SET ${updateClause}
//                 RETURNING *;
//             `;
//         const result = await client.query(query);
//         return result.rows;

//     }

//     async show(): Promise<T[]> {
//         const client = await this.client.connect();

//         const query = `SELECT * FROM ${this.tableName};`;
//         const result = await client.query(query);
//         return result.rows;
//     }

//     async clear(): Promise<void> {
//         const client = await this.client.connect();
//         const query = `DELETE FROM ${this.tableName};`;
//         await client.query(query);
//     }

//     async remove(id: string | string[]): Promise<void> {
//         if (!Array.isArray(id)) {
//             id = [id];
//         }
//         const client = await this.client.connect();
//         const query = `DELETE FROM ${this.tableName} WHERE id = ANY($1);`;
//         await client.query(query, [id]);
//     }
// }


export class PgDatastore<T extends Entity> implements DataStore<T> {
    private clientConfig: any;
    private tableName: string;

    constructor(tableName: string) {
        this.clientConfig = {
            user: 'dev',
            host: 'localhost',
            database: 'test',
            password: 'dev',
            port: 5432
        };
        this.tableName = tableName;
    }

    private async getClient(): Promise<Client> {
        const client = new Client(this.clientConfig);
        await client.connect();
        return client;
    }
    async save(elements: T | T[]): Promise<T[]> {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        const client = await this.getClient();
        try {
            const columnsSet = new Set<string>();
            elements.forEach(e => Object.keys(e).forEach(key => columnsSet.add(key)));
            const columns = Array.from(columnsSet);
            
            const values = elements.map(e => 
                columns.map(col => e[col] instanceof Date ? e[col].toISOString() : e[col] !== undefined ? e[col] : null)
            );
    
            const query = `
                INSERT INTO ${this.tableName} (${columns.map(col => `"${col}"`).join(', ')})
                VALUES ${values.map((row, i) => `(${row.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`).join(', ')}
                ON CONFLICT (id) DO UPDATE 
                SET ${columns.map(col => `"${col}" = EXCLUDED."${col}"`).join(', ')}
                RETURNING *;
            `;
    
            const flatValues = values.flat();
            const result = await client.query(query, flatValues);
            return result.rows;
        } finally {
            await client.end();
        }
    }
    

    async show(): Promise<T[]> {
        const client = await this.getClient();
        try {
            const query = `SELECT * FROM ${this.tableName};`;
            const result = await client.query(query);
            return result.rows;
        } finally {
            await client.end();
        }
    }

    async clear(): Promise<void> {
        const client = await this.getClient();
        try {
            const query = `DELETE FROM ${this.tableName};`;
            await client.query(query);
        } finally {
            await client.end();
        }
    }

    async remove(id: string | string[]): Promise<void> {
        if (!Array.isArray(id)) {
            id = [id];
        }
        const client = await this.getClient();
        try {
            const query = `DELETE FROM ${this.tableName} WHERE id = ANY($1);`;
            await client.query(query, [id]);
        } finally {
            await client.end();
        }
    }
}
