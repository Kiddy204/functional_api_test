import { InMemoryDataStore } from "./DataStore";
import { PgDatastore } from "./PgDatastore";
import { save, show, remove, clear } from "./api";
import { CompanySize, Provider, Talent } from "./interface";

const dataSource = new InMemoryDataStore<Talent>('talents');

const talentsArray: Talent[] = [
    {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'contact@email.com',
        location: 'paris',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '2',
        first_name: 'Mohammed',
        last_name: 'Ali',
        email: 'contact@email.com',
        location: 'England',
        created_at: new Date(),
        updated_at: new Date()
    }
];
const talentObject = {
    id: '3',
    first_name: 'Michael',
    last_name: 'Jordan',
    created_at: new Date(),
    updated_at: new Date()
}
const upsertTalents = [
    {
        id: '1',
        first_name: 'Ana',
        last_name: 'Karina',
        email: 'email@mail.com',
        headline: 'The bee',
        updated_at: new Date(),
        created_at: new Date(),
    },
    {
        id: '2',
        first_name: 'Mohammed',
        last_name: 'Ali',
        email: 'email@mail.com',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '4',
        first_name: 'Albert',
        last_name: 'Einstein',
        headline: 'The wise one',
        email: 'email@mail.com',
        created_at: new Date(),
        updated_at: new Date()
    }
]
const providersArray: Provider[] = [
    {
        id: '1',
        name: 'Provider One',
        industry: 'IT',
        companySize: CompanySize.LARGE,
        website: 'www.providerone.com',
        employees: [
            {
                id: '1',
                first_name: 'John',
                last_name: 'Doe',
                email:'email@mail.com',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: '2',
                first_name: 'Mohammed',
                last_name: 'Ali',
                email:'email@mail.com',
                created_at: new Date(),
                updated_at: new Date()
            }
        ],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '2',
        name: 'Provider Two',
        industry: 'Finance',
        companySize: CompanySize.MEDIUM,
        website: 'www.providertwo.com',
        employees: [
            {
                id: '3',
                first_name: 'Michael',
                last_name: 'Jordan',
                email:'email@mail.com',
                created_at: new Date(),
                updated_at: new Date()
            }
        ],
        created_at: new Date(),
        updated_at: new Date()
    }
];
const providerObject = {
    id: '3',
    name: 'Provider Three',
    employees: [],
    created_at: new Date(),
    updated_at: new Date()
};

const upsertProviders: Provider[] = [
    {
        id: '1',
        name: 'Provider One Updated',
        industry: 'Tech',
        companySize: CompanySize.SMALL,
        website: 'www.provideroneupdated.com',
        employees: [
            {
                id: '1',
                first_name: 'John',
                last_name: 'Doe',
                email:'email@mail.com',
                created_at: new Date(),
                updated_at: new Date()
            }
        ],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '4',
        name: 'Provider Four',
        employees: [],
        created_at: new Date(),
        updated_at: new Date()
    }
];


const providerDataSource = new InMemoryDataStore<Provider>('providers');


async function testInMemoryDB() {

    await save(providerDataSource, providersArray);
    await save(providerDataSource, providerObject);
    await save(providerDataSource, upsertProviders);
    await remove(providerDataSource, ['1', '4', '4']);
    const res = await show(providerDataSource);

    console.log(res)
}
const talentDataSource = new PgDatastore<Talent>('talents');

async function testPgDb(){
    try{
        await save(talentDataSource, talentsArray)
        await save(talentDataSource, talentObject)
        await save(talentDataSource, upsertTalents)
        const res = await show(talentDataSource)
        console.log(res)
    } catch(e) {
        throw e
    }

}

testPgDb();
