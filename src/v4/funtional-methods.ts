import { DataSource, DeepPartial, Repository, SelectQueryBuilder } from "typeorm";
import { BaseEntityWithTimestamps } from "./entities";

export interface ShowQueryParams<T> {
    filter?: DeepPartial<T>; 
    select?: (keyof T)[];
    relations?: string[];
    query?: (queryBuilder: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;
    orderBy?: Partial<Record<keyof T, 'ASC' | 'DESC'>>; 
    skip?: number;
    take?: number;
}

// export async function save<T extends BaseEntityWithTimestamps>(
//     dataSource: DataSource,
//     entity: { new(): T },
//     data: DeepPartial<T> | DeepPartial<T>[]
// ): Promise<T | T[]> {
//     const repository: Repository<T> = dataSource.getRepository(entity);

//     if (Array.isArray(data)) {
//         // Perform upsert for multiple entities
//         const entities = data.map(item => repository.create(item));
//         return await repository.save(entities);
//     } else {
//         // Perform upsert for a single entity
//         const entityInstance = repository.create(data);
//         return await repository.save(entityInstance);
//     }
// }
export async function save<T extends BaseEntityWithTimestamps>(
    dataSource: DataSource,
    entity: { new(): T },
    data: DeepPartial<T> | DeepPartial<T>[]
): Promise<T | T[]> {
    const repository: Repository<T> = dataSource.getRepository(entity);

    // console.log("Saving data:", JSON.stringify(data, null, 2)); // Log data for debugging

    try {
        if (Array.isArray(data)) {
            const entities = data.map(item => repository.create(item));
            return await repository.save(entities);
        } else {
            const entityInstance = repository.create(data);
            return await repository.save(entityInstance);
        }
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
}

export async function show<T extends BaseEntityWithTimestamps>(
    dataSource: DataSource,
    entity: { new(): T },
    params?: ShowQueryParams<T>
): Promise<any> {
    const repository: Repository<T> = dataSource.getRepository(entity);
    let query = repository.createQueryBuilder("entity");
    if (params?.query) {
        query = params.query(query);
        return query.getRawMany()
    } 
    if(!params){
        return query.getMany();
    }

    if (params.select && params.select.length > 0) {
        query = query.select(params.select.map(field => `entity.${String(field)}`));
    }
    if (params.relations && params.relations.length > 0) {
        params.relations.forEach(relation => {
            query = query.leftJoinAndSelect(`entity.${relation}`, relation);
        });
    }
    if (params.filter) {
        query = applyFilters(query, params.filter);
    }
    if (params.orderBy) {
        Object.entries(params.orderBy).forEach(([key, order]) => {
            query = query.addOrderBy(`entity.${key}`, order);
        });
    }
    if (params.skip !== undefined) {
        query = query.skip(params.skip);
    }
    if (params.take !== undefined) {
        query = query.take(params.take);
    }

    return query.getMany();
}

export async function clear<T extends BaseEntityWithTimestamps>(
    dataSource: DataSource,
    entity: { new(): T }
): Promise<void> {
    // const repository: Repository<T> = dataSource.getRepository(entity);
    const entityName = dataSource.getRepository(entity).metadata.tableName;

    await dataSource.query(`TRUNCATE TABLE "${entityName}" CASCADE`);
}

export async function remove<T extends BaseEntityWithTimestamps>(
    dataSource: DataSource,
    entity: { new(): T },
    id: string | string[] | { id: string } | { id: string }[]
): Promise<void> {
    const repository: Repository<T> = dataSource.getRepository(entity);

    // Normalize the input to an array of ids
    let ids: string[] = [];
    if (typeof id === 'string') {
        ids = [id];
    } else if (Array.isArray(id)) {
        if (id.length > 0 && typeof id[0] === 'string') {
            ids = id as string[];
        } else {
            ids = (id as { id: string }[]).map(item => item.id);
        }
    } else if (typeof id === 'object' && id !== null) {
        ids = [id.id];
    }

    await repository.delete(ids);
}


function applyFilters(query: any, filters: any, alias: string = 'entity') {
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (value.id) {
                query = query.andWhere(`${alias}.${key}Id = :${alias}_${key}Id`, { [`${alias}_${key}Id`]: value.id });
            } else {
                query = applyFilters(query, value, `${alias}.${key}`);
            }
        } else {
            query = query.andWhere(`${alias}.${key} = :${alias}_${key}`, { [`${alias}_${key}`]: value });
        }
    });
    return query;
}