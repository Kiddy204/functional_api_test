import { clear, save, show } from './funtional-methods';
import { PgDataSource } from './datasource';
import { Education, Skill, TalentProfile, WorkExperience } from './entities';
import { createCompleteTalentProfiles, createFakeTalentProfiles } from './helpers/faker';
import { DataSource, SelectQueryBuilder } from 'typeorm';
PgDataSource.initialize();
const skillDevelopmentTimeline = async (dataSource, talentId) => {
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
    // console.log(result)
    return result;
};

const industryEngagement = async (dataSource) => {
    const result = await show(dataSource, WorkExperience, {
        select: ['industry', 'startDate', 'endDate'],
        orderBy: {
            'startDate': 'ASC'
        }
    });
    // console.log(result)
    return result;
};

const educationalImpactAnalysis = async (dataSource) => {
    const result = await show(dataSource, Education, {
        relations: ['profile'],
        select: ['fieldOfStudy', 'institution', 'startDate', 'endDate'],
        orderBy: {
            'startDate': 'ASC'
        }
    });
    // console.log(result)
    return result;
};


async function getAverageTurnaroundByIndustry(dataSource: DataSource): Promise<any[]> {
    return await show(dataSource, WorkExperience, {
        query: (query) => query
            .select("entity.industry", "industry")
            .addSelect("AVG(DATE_PART('day', entity.endDate - entity.startDate))", "averageTurnaround")
            .groupBy("entity.industry")
    });
}



export const list = async (entity: string): Promise<any> => {
    return await show(PgDataSource, TalentProfile, {
        relations: ['skills', 'education', 'workExperience']
    });
}

async function demo() {
    await PgDataSource.initialize();
    // await clear(PgDataSource, TalentProfile);
    // const profiles = await createCompleteTalentProfiles(20);
    // await save(PgDataSource, TalentProfile, profiles);
    const talents = await show(PgDataSource, TalentProfile, {
        select: ['id','name','profilePicture','created_at','updated_at'],
        take:5
        // relations: ['skills', 'education', 'workExperience']
    });
    const workExperiences = await show(PgDataSource, WorkExperience, {
        // filter: {
        //     profile: { 
        //         id: 'b9541209-8c03-451f-9505-c43322c541d7' 
        //     }
        // },
        select: ['id', 'title', 'startDate', 'endDate'],
        take: 5
        // relations: ['profile']
    });
    const skills = await show(PgDataSource, Skill,{take:5})
    const educations = await show(PgDataSource, Education, {take: 2})

    const skill_dev =await skillDevelopmentTimeline(PgDataSource, 'c147a6a6-1f8e-4834-b30d-9764f823c803')

    const industry_engagement = await industryEngagement(PgDataSource)

    const educationImpact = await educationalImpactAnalysis(PgDataSource)
    
    const averageScoresQuery = (query: SelectQueryBuilder<Skill>) => {
        return query
            .select("entity.name", "name")
            .addSelect("AVG(entity.score)", "averageScore")
            .groupBy("entity.name");
    };
    const avgSkillScore = await show(PgDataSource, Skill, {
        query: averageScoresQuery
    });
    // console.log(talents)
    console.log('TALENTS')
    console.table(talents)

    console.log('WORK XP')
    console.table(workExperiences)

    console.log('EDUCATION')
    console.table(educations)

    console.log('SKILLS')
    console.table(skills)

    console.log('SKILLS DEV')
    console.table(skill_dev)

    console.log('AVG SKILL SCORE')
    console.table(avgSkillScore)

    console.log('EDUCATION IMPACT')
    console.table(educationImpact)

    console.log('INDUSTRIES IMPACT')
    console.table(industry_engagement)

    console.log('AVERAGE  TURNAROUND')
    const averageTurnaroundByIndustry = await getAverageTurnaroundByIndustry(PgDataSource);
    console.table(averageTurnaroundByIndustry);
}

demo()
