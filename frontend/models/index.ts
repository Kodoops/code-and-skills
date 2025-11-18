// -----------------------------------
// SITE OCNFIG
// -----------------------------------

export const PAGE_TYPES = ["footer"];


export type Feature = {
    id: string;
    title: string;
    desc: string;
    color?: string;
    iconName?: string;
    iconLib?: string;

    createdAt: string;
    updatedAt: string;
};

export type Page = {
    id: string
    createdAt: string
    updatedAt: string
    title: string
    slug: string
    type: string
    content: string
}

export type CompanySocialLink = {
    id: string
    createdAt: string
    updatedAt: string
    url: string
    companyId: string
    socialLink: {
        id: string
        name: string
        iconLib: string
        iconName: string
        createdAt: Date
        updatedAt: Date
    }
}

export type  SocialLink = {
    id: string
    name: string
    // url       String
    iconLib: string // ex: "lucide", "si", "fa", "tabler"
    iconName: string// ex: "facebook", "github", "x"
    createdAt: string
    updatedAt: string

    companySocialLink: CompanySocialLink[]
}

export type  Company = {
    id: string
    name: string
    address: string
    postalCode: string
    city: string
    country: string
    email: string
    phone: string
    siret: string
    vatNumber: string
    logoUrl: string
    createdAt: string
    updatedAt: string

    companySocialLink: CompanySocialLink[]
}

export type Testimonial = {
    userId: string
    text: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
};

export type TestimonialWithUser = Testimonial & {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image?: string | null;
    };
};

export type Newsletter = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    confirmed: Boolean
}

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    replies: ContactReply[]
}

export type ContactReply = {
    id: string;
    contactMessageId: string;
    contactMessage: ContactMessage;
    adminId: string;
    response: string;
    createdAt: string;
}

/*
*   AUTH MODELS
 */

export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
export const STATUS = ["Draft", "Published", "Archived"];

export interface UserProfile {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    title: string;
    avatarUrl?: string;
    role?: string;
    bio?: string;
    country?: string;
    city?: string;
    lastLoginAt: string;
    userId: string;
    premium: boolean;
    stripeCustomerId: string;
}

export interface SessionUser {
    email: string;
    role: string;
    enabled: boolean;
    profile?: UserProfile;
}


/*
*   CATALOGUE MODELS
 */

export  type Domain = {
    id: string
    title: string
    slug: string
    description: string
    color: string | null
    iconName: string | null
    iconLib: string | null
}

export type Category = {
    id: string
    title: string
    slug: string
    description: string
    color: string | null
    iconName: string | null
    iconLib: string | null

    domainId: string
    domainTitle: string
    domainSlug: string
}

export type Tag = {
    id: string;
    title: string;
    slug: string;
    color?: string | null;
};

export enum EnrollmentStatusEnum {
    Pending,
    Active,
    Cancelled,
}

export type  Enrollment = {
    id: string;
    amount: number;
    status: string; // EnrollmentStatusEnum

    courseId: String;
    course?: Course;
    // learningPath?: LearningPath;
    // workshop?: Workshop;
    // user: UserProfile;
    // payment?: Payment;

    updatedAt: string;
    createdAt: string;
}


export type LearningPath = {
    id: string;
    title: string;
    description: string;
    smallDescription: string;
    slug: string;
    fileKey?: string;
    duration: number;
    price: number // in cents
    status: string;  // ENUM_STATUS
    level: string;  // ENUM_LEVELS

    user: UserProfile;

    // tags: LearningPathTag[];
    // contents: LearningPathItem[];
    // progress: UserProgress[];
    // resources: LearningPathResource[];
    // objectives: LearningPathObjective[];
    // prerequisites: LearningPathPrerequisite[];
    //
    // promoCodes: PromoCode[];
    // enrollments: Enrollment[];

    promotions: Promotion[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export type LearningPathItemType = {
    id: string;

    type: string;  // ENUM_ITEM_TYPE
    position: number;
    learningPath: LearningPath;

    course?: Course;
    workshop?: Workshop;
    resource?: Resource;

    createdAt: string;
    updatedAt: string;
}


export type Course = {
    id: string
    createdAt: Date
    updatedAt: Date
    status: string
    title: string
    slug: string
    smallDescription: string
    description: string
    fileKey: string
    price: number
    currency: string
    duration: number
    level: string
    stripePriceId: string

    userId: string
    user: UserProfile
    categoryId: string
    categoryTitle: string
    categorySlug: string
    promotions: Promotion []

    chapters: Chapter[]

    tags: Tag[]

    prerequisites: string[]
    objectives: string[]
}

export type Chapter = {
    id: string
    title: string
    slug: string
    position: number
    course: Course
    lessons: Lesson []
}

export type Lesson = {
    id: string
    title: string
    slug: string
    description: string
    thumbnailKey: string
    videoKey: string
    duration: number
    position: number
    publicAccess: boolean
    resourceIds: string []
    chapter: string
}

export type LessonProgress = {
    id: string
    lessonId: string
    userId: string
    courseId: string
    progress: number
    completed: boolean
    completedAt: string
    createdAt: string
    updatedAt: string
}

export type  Quiz = {
    id: string;
    title: string;
    slug: string;
    description?: string;
    type?: string;
    chapterId?: string;
    courseId?: string;
    questions: QuizQuestion[];
    createdAt: string;
    updatedAt: string;
    user: UserProfile;
    userId: string;
}

export type  QuizQuestion = {
    id: string;
    question: string;
    type: string; // MULTIPLE_CHOICE, TRUE_FALSE, OPEN
    quizId: string;
    quiz: Quiz;
    options: QuizOption[];
}

export type  QuizOption = {
    id: string;
    content: string;
    isCorrect: boolean;
    questionId: string;
    question: QuizQuestion;
}

export type Workshop = {
    id: string;
    title: string;
    description: string;
    slug: string;
    fileKey: string;
    price: number;
    currency: number;
    duration: number;
    level: string; // ENUM_LEVELS
    status: string; // ENUM_STATUS

    statement: string;
    statementsStartFileKey?: string; // url :eip files starter kit
    statementsStartFileUrl?: string; // url :eip files starter kit
    statementVideoKey?: string;// presentation workshop video url

    solution?: string; // description of solution
    solutionFileKey?: string; // final url files solution
    solutionFileUrl?: string; // url :eip files solution
    solutionVideoKey?: string; // url video solution

    stripePriceId?: string;

    user: UserProfile;
    // tags: WorkshopTag[];
    // progress: UserProgress[];
    // resources: WorkshopResource[];
    // learningPathItems: LearningPathItem[];
    // objectives: WorkshopObjective[];
    // prerequisites: WorkshopPrerequisite[];
    //
    // promoCodes: PromoCode[];
    //
    // enrollments: Enrollment[];
    promotions: Promotion[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export type Resource = {
    id: string;
    title: string;
    description?: string;
    type: string;   //      ResourceTypeEnum
    fileKey?: string;
    url: string;

    // courseResources: CourseResource[];
    // lessonResources: LessonResource[];
    // workshopResources: WorkshopResource[];
    // learningPathResources: LearningPathResource[];
    // learningPathItems: LearningPathItem[];

    user: UserProfile;

    createdAt: string;
}

export type Promotion = {
    id: string;
    title: string;
    description?: string;
    discount: number;
    type: string; //     DiscountTypeEnum
    startsAt: string;
    endsAt: string;
    active: boolean;

    itemType: string; // ItemTypeEnum

    course: Course;
    workshop: Workshop;
    learningPath: LearningPath;
}