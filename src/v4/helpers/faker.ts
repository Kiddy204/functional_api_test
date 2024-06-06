import faker from 'faker';
import { Education, FieldOfStudy, Industry, Skill, TalentProfile, WorkExperience } from '../entities';
enum SkillENUM {
    ANALYTICAL_PROBLEM_SOLVING = "Analytical Problem Solving",
    COMMUNICATION = "Communication",
    CREATIVITY = "Creativity",
    CRITICAL_THINKING = "Critical Thinking",
    LEADERSHIP = "Leadership",
    MANAGEMENT = "Management",
    NEGOTIATION = "Negotiation",
    ORGANIZATIONAL_SKILLS = "Organizational Skills",
    PROBLEM_SOLUTION = "Problem Solution",
    PROJECT_MANAGEMENT = "Project Management",
    TEAMWORK = "Teamwork"
}

export async function createFakeTalentProfiles(count: number): Promise<TalentProfile[]> {
    const talentProfiles: TalentProfile[] = [];

    for (let i = 0; i < count; i++) {
        const talentProfile = new TalentProfile();
        talentProfile.name = faker.name.findName();
        talentProfile.headline = faker.name.jobTitle();
        talentProfile.summary = faker.lorem.paragraphs(2);
        talentProfile.profilePicture = faker.image.avatar();
        talentProfile.interactionCount = faker.datatype.number({ min: 0, max: 1000 });
        
        talentProfile.workExperience = [];
        talentProfile.education = [];
        talentProfile.skills = [];

        talentProfiles.push(talentProfile);
    }

    return await talentProfiles;
}

async function createFakeWorkExperience(profile: TalentProfile): Promise<WorkExperience[]> {
    const workExperiences: WorkExperience[] = [];

    const count = faker.datatype.number({ min: 1, max: 2 });
    for (let i = 0; i < count; i++) {
        const workExperience = new WorkExperience();
        workExperience.title = faker.name.jobTitle();
        workExperience.company = faker.company.companyName();
        workExperience.industry = faker.helpers.randomize(Object.values(Industry));
        workExperience.startDate = faker.date.past(10);
        workExperience.endDate = faker.datatype.boolean() ? faker.date.between(workExperience.startDate, new Date()) : null;
        workExperiences.push(workExperience);
    }
    return workExperiences;
}

async function createFakeEducation(profile: TalentProfile): Promise<Education[]> {
    const educations: Education[] = [];

    const count = faker.datatype.number({ min: 0, max: 2 });
    for (let i = 0; i < count; i++) {
        const education = new Education();
        education.institution = faker.company.companyName();
        education.degree = faker.commerce.department();
        education.fieldOfStudy = faker.helpers.randomize(Object.values(FieldOfStudy));
        education.startDate = faker.date.past(15);
        education.endDate = faker.date.between(education.startDate, new Date());

        educations.push(education);
    }
    return educations;
}

async function createFakeSkills(profile: TalentProfile): Promise<Skill[]> {
    const skills: Skill[] = [];

    const count = faker.datatype.number({ min: 2, max: 4 });
    for (let i = 0; i < count; i++) {
        const skill = new Skill();
        const randomSkillKey = Object.keys(SkillENUM)[Math.floor(Math.random() * Object.keys(SkillENUM).length)];

        skill.name = SkillENUM[randomSkillKey];
        skill.endorsements = faker.datatype.number({ min: 0, max: 100 });
        skill.score = faker.datatype.number({ min: 0, max: 100 });

        skills.push(skill);
    }
    return skills;
}

export async function createCompleteTalentProfiles(count: number): Promise<TalentProfile[]> {
    const talentProfiles: TalentProfile[] = [];

    for (let i = 0; i < count; i++) {
        const talentProfile = new TalentProfile();
        talentProfile.name = faker.name.findName();
        talentProfile.headline = faker.name.jobTitle();
        talentProfile.summary = faker.lorem.paragraphs(2);
        talentProfile.profilePicture = faker.image.avatar();
        talentProfile.interactionCount = faker.datatype.number({ min: 0, max: 1000 });
        talentProfile.workExperience = await createFakeWorkExperience(talentProfile);
        talentProfile.education = await createFakeEducation(talentProfile);
        talentProfile.skills = await createFakeSkills(talentProfile);

        talentProfiles.push(talentProfile);
    }

    return talentProfiles;
}
