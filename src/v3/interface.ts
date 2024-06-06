export interface IEntity {
    id: string;
    created_at: Date;
    updated_at: Date;
}
export class Entity implements IEntity {
    id!: string;
    created_at!: Date;
    updated_at!: Date;
}


export class Talent extends Entity {
    first_name!: string;
    last_name!: string;
    email!: string;
    headline?: string;
    location?: string;
    industry?: string;
    summary?: string;
}

export class Experience extends Entity {
    start: Date;
    end: Date;
    company: Provider
    title: string;
    description?: string;
}

export class Provider extends Entity {
    name: string;
    industry?: string;
    companySize?: CompanySize;
    website?: string;
    employees: Talent[];
}

export enum CompanySize {
    SMALL = '1-50',
    MEDIUM = '50-200',
    LARGE = '+200'
}