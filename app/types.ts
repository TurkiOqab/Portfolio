// Portfolio data types

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
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
    projects: Project[];
    contact: ContactInfo;
}

// Default empty portfolio for new users
export const defaultPortfolioData: PortfolioData = {
    name: "",
    title: "",
    bio: "",
    skills: [],
    projects: [],
    contact: {
        email: "",
        github: "",
        linkedin: "",
        twitter: "",
    },
};
