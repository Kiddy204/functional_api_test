import "reflect-metadata";
import { DataSource, DeepPartial } from "typeorm";
import { TalentProfile, WorkExperience, Education, Skill } from "./entities";
import { ShowQueryParams } from "./funtional-methods";
interface IDataSource<T> {
    initialize(): Promise<void>;
    save(entity: { new(): T }, data: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]>;
    show(entity: { new(): T }, params?: ShowQueryParams<T>): Promise<T[]>;
    clear(entity: { new(): T }): Promise<void>;
    remove(entity: { new(): T }, id: string | string[] | { id: string } | { id: string }[]): Promise<void>;
}
export const PgDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dev",
    password: "dev",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [TalentProfile, WorkExperience, Education, Skill],
    migrations: [],
    subscribers: [],
});

PgDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });