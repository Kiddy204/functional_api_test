import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Entity,
    ManyToOne,
    OneToMany
} from "typeorm";

export enum Industry {
    Technology = "Technology",
    Finance = "Finance",
    Healthcare = "Healthcare",
    Education = "Education",
}

export enum FieldOfStudy {
    ComputerScience = "ComputerScience",
    Mathematics = "Mathematics",
    Biology = "Biology",
    BusinessAdministration = "BusinessAdministration",
}

export abstract class BaseEntityWithTimestamps extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

@Entity()
export class TalentProfile extends BaseEntityWithTimestamps {
    @Column()
    name: string;

    @Column({ nullable: true })
    headline: string;

    @Column('text', { nullable: true })
    summary: string;

    @Column({ nullable: true })
    profilePicture: string;

    @OneToMany(
        () => WorkExperience, workExperience => workExperience.profile,
        {cascade: true, eager: true}
    )
    workExperience: WorkExperience[];

    @OneToMany(
        () => Education, education => education.profile,
        { cascade: true, eager: true}
    )
    education: Education[];

    @OneToMany(
        () => Skill, skill => skill.profile,
        { cascade: true, eager: true}
    )
    skills: Skill[];

    @Column()
    interactionCount: number;
}

@Entity()
export class WorkExperience extends BaseEntityWithTimestamps {
    @Column()
    title: string;

    @Column()
    company: string;

    @Column({
        type: "enum",
        enum: Industry
    })
    industry: Industry;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @ManyToOne(() => TalentProfile, profile => profile.workExperience)
    profile: TalentProfile;
}

@Entity()
export class Education extends BaseEntityWithTimestamps {
    @Column()
    institution: string;

    @Column()
    degree: string;

    @Column({
        type: "enum",
        enum: FieldOfStudy
    })
    fieldOfStudy: FieldOfStudy;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => TalentProfile, profile => profile.education)
    profile: TalentProfile;
}

@Entity()
export class Skill extends BaseEntityWithTimestamps {
    @Column()
    name: string;

    @Column()
    endorsements: number;

    @Column()
    score: number;

    @ManyToOne(() => TalentProfile, profile => profile.skills)
    profile: TalentProfile;
}
