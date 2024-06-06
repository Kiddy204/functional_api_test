import { DataStore } from "./DataStore"
import { Entity } from "./interface"

export const  save = async<T extends Entity> (datasource: DataStore<T>, elements: T | T[]): Promise<T[]> => {
    return await datasource.save(elements)
}


export const show = async<T extends Entity> (dataSource: DataStore<T>): Promise<T[]> => {
    return await dataSource.show()
}


export const remove = async <T extends Entity>(dataSource: DataStore<T>, id: string | string[]): Promise<void> => {
    await dataSource.remove(id);
}

export const clear = async <T extends Entity>(dataSource: DataStore<T>): Promise<void> => {
    await dataSource.clear();
}