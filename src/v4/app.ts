import { clear, save, show } from "./funtional-methods";
import { PgDataSource } from "./datasource";
import { Education, Skill, TalentProfile, WorkExperience } from "./entities";
import { createCompleteTalentProfiles, createFakeTalentProfiles } from "./helpers/faker";
import { DataSource, SelectQueryBuilder } from "typeorm";

//////      BASIC DEMO     //////
// 1- fakeTalents
// 2- save()
// 3- show()
async function demo() {
    await PgDataSource.initialize();
    // await clear(PgDataSource,TalentProfile)
    const profiles = await createCompleteTalentProfiles(10)
    await save(PgDataSource, TalentProfile, profiles)
    const t = await show(PgDataSource, TalentProfile, {
        // filter: {
        //     id: '7b2ebdbe-c043-4fe4-b540-83334c7b27a7',
        // },
        // select: ['id', 'name', 'headline', 'profilePicture'],
        relations: ['skills', 'education', 'workExperience']

    });

    const w = await show(PgDataSource, WorkExperience, {
        filter: {
            profile: { 
                id: 'b9541209-8c03-451f-9505-c43322c541d7' 
            }
        },
        // select: ['id', 'name', 'headline', 'profilePicture'],
        relations: ['profile']

    });
    console.log(w.length)








    // await clear(PgDataSource,TalentProfile)
    // await PgDataSource.destroy().then(()=> {
    //     console.log('DB is detroyed')
    // })
}


//////      ABSTRACT VIEWS      //////

const skillDevelopmentTimeline = async (dataSource, talentId) => {
    await PgDataSource.initialize();

    const result = await show(dataSource, Skill, {
        relations: ['profile'],
        filter: {   
            profile: {
                id: talentId
            }
        },
        orderBy: {
            'created_at': 'ASC'
        }
    });
    console.log(result)
    return result;
};

// skillDevelopmentTimeline(PgDataSource, '35b044f8-fbb8-4d85-b092-37dc84db2ad6')
const industryEngagement = async (dataSource) => {
    await PgDataSource.initialize();
    const result = await show(dataSource, WorkExperience, {
        select: ['industry', 'startDate', 'endDate'],
        orderBy: {
            'startDate': 'ASC'
        }
    });
    console.log(result)
    return result;
};
// industryEngagement(PgDataSource)


const educationalImpactAnalysis = async (dataSource) => {
    await PgDataSource.initialize();
    const result = await show(dataSource, Education, {
        relations: ['profile'],
        select: ['fieldOfStudy', 'institution', 'startDate', 'endDate'],
        orderBy: {
            'startDate': 'ASC'
        }
    });
    console.log(result)
    return result;
};

// educationalImpactAnalysis(PgDataSource)

const queryBuilder = async (dataSource) => {
    await dataSource.initialize()
    const averageScoresQuery = (queryBuilder: SelectQueryBuilder<Skill>) => {
        return queryBuilder
            .select("entity.name", "name")
            .addSelect("AVG(entity.score)", "averageScore")
            .groupBy("entity.name");
    };

    const averageScores = await show(dataSource, Skill, {
        query: averageScoresQuery
    });
    console.log("Average Scores for Each Skill: ", averageScores);

}
queryBuilder(PgDataSource)