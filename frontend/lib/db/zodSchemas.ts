import {z} from "zod";

export const loginFormSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Adresse e-mail invalide" }),
    password: z
        .string()
        .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
        .max(100, { message: "Le mot de passe est trop long" }),
});

export const registerFormSchema = z
    .object({
        firstname: z
            .string()
            .trim()
            .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
        lastname: z
            .string()
            .trim()
            .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email({ message: "Adresse e-mail invalide" }),
        password: z
            .string()
            .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
            .max(100, { message: "Le mot de passe est trop long" }),
        confirm_password: z
            .string()
            .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
            .max(100, { message: "Le mot de passe est trop long" }),
    })
    // ✅ Vérifie que les deux mots de passe correspondent
    .refine((data) => data.password === data.confirm_password, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirm_password"], // indique à Zod où afficher l'erreur
    });

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Adresse e-mail invalide" }),
});

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
            .max(100, { message: "Le mot de passe est trop long" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export const changePasswordSchema = z
    .object({
        oldPassword: z
            .string()
            .min(6, "L'ancien mot de passe doit contenir au moins 6 caractères."),
        newPassword: z
            .string()
            .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères."),
        confirmPassword: z
            .string()
            .min(6, "La confirmation doit contenir au moins 6 caractères."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    });

export const updateProfileSchema = z.object({
    firstname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Adresse e-mail invalide" }),
    lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    bio: z.string().max(300, "La bio ne peut pas dépasser 300 caractères.").nullable().optional(),
    title: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
});



export const learningPathSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    smallDescription: z.string().min(3, {message:'Small description  must be at least 3 characters long'}).max(255, {message:'Small Description  must be most 200 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
    status: z.string().min(1,{message:'Status must be one of the following: draft, published, archived'}),
})

export const learningPathItemSchema =z.object({
    type: z.string().min(1, {message:'Type required '}),
    courseId: z.string().optional(),
    workshopId: z.string().optional(),
    resourceId: z.string().optional(),
    learningPathId: z.string().min(1, {message:'Learning Path  Id  required '}),
})

export const courseSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    categoryId: z.string(),
    smallDescription: z.string().min(3, {message:'Small description  must be at least 3 characters long'}).max(200, {message:'Small Description  must be most 200 characters long ... '}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
    status: z.string().min(1,{message:'Status must be one of the following: draft, published, archived'}),
    currency: z.string().optional(),
    userId: z.string().min(1,{message:'Authenticated user is required'})
})

export const chapterSchema = z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}),
    courseId: z.string().uuid({message:'Course Id is required'}),
})

export const lessonSchema = z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}),
    courseId: z.string().uuid({message:'Course Id is required'}),
    chapterId: z.string().uuid({message:'Chapter Id is required'}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}).optional(),
    thumbnailKey: z.string().optional(),
    videoKey: z.string().optional(),
    publicAccess:z.boolean().optional(),
})

export const workshopSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    statement: z.string().optional(),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
    status: z.string().min(1,{message:'Status must be one of the following: draft, published, archived'}),
})

export const workshopStatementSchema = z.object({
    statement: z.string().min(3, { message: 'Statement must be at least 3 characters long' }),
    statementsStartFileKey: z.string().optional(),
    statementsStartFileUrl: z.string().url().optional(),
    statementVideoKey: z.string().optional(),
});

export const workshopSolutionSchema = z.object({
    solution: z.string().min(3, { message: 'Solution must be at least 3 characters long' }),
    solutionFileKey: z.string().optional(),
    solutionFileUrl: z.string().url().optional(),
    solutionVideoKey: z.string().optional(),
});

export const resourceSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    type: z.string().min(1, {message:'Type is required'}),
    fileKey: z.string().optional(),
    url: z.string().min(1, {message:'File is required'}),
})

export const quizSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
})

export const quizQuestionSchema = z.object({
    question: z.string().min(3, {message:'Question must be at least 3 characters long'}),
    quizId: z.string().uuid({message:'Quiz Id is required'}),
    // type: z.string().min(1,{message:'Type must be one of the following: Course , Chapter, etc ...'}),
})

export const quizOptionSchema = z.object({
    content: z.string().min(3, {message:'Question must be at least 3 characters long'}),
    questionId: z.string().uuid({message:'Quiz Id is required'}),
    isCorrect: z.boolean().optional(),
    quizId: z.string().uuid({message:'Quiz Id is required'}),
})

export const attachQuizFormToCourse = z.object({
    courseId: z.string().optional(),
    chapterId: z.string().optional(),
    quizId: z.string().uuid({message:'Quiz Id is required'}),
})

export const categorySchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    color: z.string().optional(),
    iconName: z.string().optional(),
    iconLib: z.string().optional(),
    domainId: z.string(),
    domainSlug: z.string().optional(),
    domainTitle: z.string().optional(),
})

export const domainSchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    color: z.string().optional(),
    iconName: z.string().optional(),
    iconLib: z.string().optional(),
})

export const tagSchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    color: z.string().optional(),
})

export const featureSchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    desc: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    color: z.string().optional(),
    iconName: z.string().optional(),
    iconLib: z.string().optional(),
})

export const companySchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    address: z.string().min(3, { message: "Address must be at least 3 characters long" }),
    city: z.string().min(2, { message: "City must be at least 2 characters long" }),
    country: z.string().min(2, { message: "Country must be at least 2 characters long" }),
    postalCode: z
        .string()
        .regex(/^\d{5}$/, { message: "Postal code must be 5 digits" }),

    email: z
        .string()
        .email({ message: "Invalid email" })
        .or(z.literal("")) // permet ""
        .transform((val) => (val === "" ? undefined : val)),

    phone: z
        .string()
        .min(6, { message: "Phone number must be valid" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),

    vatNumber: z
        .string()
        .min(5, { message: "VAT number must be valid" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),

    siret: z
        .string()
        .regex(/^\d{14}$/, { message: "SIRET must be 14 digits" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),

    logoUrl: z
        .string()
        .url({ message: "Logo URL must be a valid URL" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
});

export const socialLinkSchema = z.object({
    name: z.string().min(3, {message:'Name must be at least 3 characters long'}),

    iconName: z.string(),
    iconLib: z.string(),
})

export const companySocialLinkSchema = z.object({
    url: z.string()
        .url({ message: " URL must be a valid URL" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
    socialLinkId: z.string().min(1, {message:'Social Network required'}),
})

export const objectiveRequisiteSchema = z.object({
    content: z.string().min(3, "Veuillez saisir au moins 3 caractères."),
});

export const testimonialFormSchema = z.object({
    rating: z.number().min(1).max(5),
    text: z.string().min(3, "Veuillez saisir au moins (3) caractères."),
});

export const pageLinkSchema = z.object({
    title: z.string().min(3, "Veuillez saisir au moins (3) caractères."),
    slug: z.string().min(3, "Veuillez saisir au moins (3) caractères."),
    content: z.string().min(3, "Veuillez saisir au moins (3) caractères."),
    type: z.string().min(1, "Veuillez saisir au moins (3) caractères."),

});

export const newsletterSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    name:z.string().optional(),
    confirmed:z.boolean().optional(),
});

export const contactMessageSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    subject: z.string().min(3, "Sujet trop court"),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
    userId:z.string().optional(),
});

export const replyContactMessageSchema = z.object({
    response: z.string().min(2, "Le message doit contenir au moins 2 caractères"),
    adminId:z.string().optional(),
    contactMessageId:z.string().min(1, {message:'Contact Message Id is required'}),
});

export const subscriptionPlanSchema = z.object({
    title: z.string().min(2, "Veuillez saisir au moins (2) caractères."),
    slug: z.string().min(2, "Veuillez saisir au moins (2) caractères."),
    description: z.string().min(3, "Veuillez saisir au moins (3) caractères."),
    interval: z.string().min(2, "Veuillez saisir au moins (2) caractères."),
    price: z.number("Prix non valide").min(0," 0 Minimum price"),
    active: z.boolean().optional(),
    currency:z.string().min(1, {message:'Currency is required'}),
    selected:z.boolean().optional(),
});

export const contactQuotationSchema = z.object({
    company: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    employees: z.number().min(5, "au minimum 5 employees ( 0 à 5)"),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});


export type LoginFormSchema = z.infer<typeof loginFormSchema>
export type RegisterFormSchema = z.infer<typeof registerFormSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;


export type LearningPathSchema = z.infer<typeof learningPathSchema>
export type LearningPathItemSchema = z.infer<typeof learningPathItemSchema>
export type CourseSchema = z.infer<typeof courseSchema>
export type ChapterSchema = z.infer<typeof chapterSchema>
export type LessonSchema = z.infer<typeof lessonSchema>
export type WorkshopSchema = z.infer<typeof workshopSchema>
export type WorkshopStatementSchema = z.infer<typeof workshopStatementSchema>
export type WorkshopSolutionSchema = z.infer<typeof workshopSolutionSchema>
export type ResourceSchema = z.infer<typeof resourceSchema>
export type CategorySchema = z.infer<typeof categorySchema>
export type DomainSchema = z.infer<typeof domainSchema>
export type TagSchema = z.infer<typeof tagSchema>
export type FeatureSchema = z.infer<typeof featureSchema>
export type CompanySchema = z.infer<typeof companySchema>
export type SocialLinkSchema = z.infer<typeof socialLinkSchema>
export type CompanySocialLinkSchema = z.infer<typeof companySocialLinkSchema>
export type ObjectiveRequisiteSchema = z.infer<typeof objectiveRequisiteSchema>
export type QuizSchema = z.infer<typeof quizSchema>
export type QuizQuestionSchema = z.infer<typeof quizQuestionSchema>
export type QuizOptionSchema = z.infer<typeof quizOptionSchema>
export type AttachQuizFormToCourse = z.infer<typeof attachQuizFormToCourse>
export type TestimonialFormSchema = z.infer<typeof testimonialFormSchema>
export type PageLinkSchema = z.infer<typeof pageLinkSchema>
export type NewsletterSchema = z.infer<typeof newsletterSchema>
export type ContactMessageSchema = z.infer<typeof contactMessageSchema>
export type ReplyContactMessageSchema = z.infer<typeof replyContactMessageSchema>
export type SubscriptionPlanSchema = z.infer<typeof subscriptionPlanSchema>
export type ContactQuotationSchema = z.infer<typeof contactQuotationSchema>
