// Portfolio data types

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
}

export interface Education {
    id: string;
    institution: string;
    degreeLevel: string; // e.g., "Bachelor's", "Master's", "PhD"
    degreeName: string; // e.g., "Computer Science"
    gpa?: string;
}

export interface WorkExperience {
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    isPresent: boolean;
    duties: string;
}

export interface ContactInfo {
    email: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
}

export interface PortfolioData {
    name: string;
    title: string; // e.g., "Full-Stack Developer"
    bio: string;
    skills: string[];
    education: Education[];
    experience: WorkExperience[];
    projects: Project[];
    contact: ContactInfo;
}

// Default empty portfolio for new users
export const defaultPortfolioData: PortfolioData = {
    name: "",
    title: "",
    bio: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    contact: {
        email: "",
        github: "",
        linkedin: "",
        twitter: "",
    },
};
