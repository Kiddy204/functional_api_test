
import { DataSource, InMemoryDataSource, PostgresDataSource } from './DataSource';


async function save<T>(dataSource: DataSource<T>, collectionName: string, elements: T | T[]): Promise<void> {
    await dataSource.save(collectionName, elements);
}

async function show<T>(dataSource: DataSource<T>, collectionName: string): Promise<void> {
    const data = await dataSource.show(collectionName);
    console.log(data);
}
        /////// EXAMPLE ///////

const dataSource = new InMemoryDataSource<any>();
async function demo() {
    await save(dataSource, 'users', { id: 1, name: 'John Doe' });
    await save(dataSource, 'users', [{ id: 2, name: 'Jane Doe' }]);
    await show(dataSource, 'users');
}

// demo();

const postgresClientConfig = {
    user: 'dev',
    host: 'localhost',
    database: 'reference_data',
    password: 'dev',
    port: 5432
};

async function postgresDemo() {
    const postgresDataSource = new PostgresDataSource<any>(postgresClientConfig);
    await save(postgresDataSource, 'talents', [{ id: 1, name: 'John Doe' }, { id: 1, name: 'John Doe' }]);
    await show(postgresDataSource, 'talents');
}

postgresDemo();
