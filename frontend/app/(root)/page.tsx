import {Button} from "@/components/ui/button";
import Link from "next/link";
import React, {Suspense} from "react";
import FeaturedCarouselClient from "@/components/sections/FeaturedCarousel.client";
import CategoriesCarouselClient from "@/components/sections/CategoriesCarousel.client";
import CoursesCarouselClient from "@/components/sections/CoursesCarousel.client";
import TestimonialCarouselClient from "@/components/sections/TestimonialCarousel.client";
import BannerPartner from "@/components/sections/BannerPartner";
import SectionHeader from "@/components/sections/SectionHeader";
import SectionTitle from "@/components/sections/SectionTitle";
import Section from "@/components/sections/Section";
import NewsLetterForm from "@/components/sections/NewsLetterForm";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import {Card} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {CategoryCardSkeleton} from "@/app/(root)/_components/CategoryCard";
import AppHero from "@/app/(root)/_components/AppHero";
import {FeatureCardSkeleton} from "@/app/(root)/_components/FeatureCard";
import {PublicCourseCardSkeleton} from "@/app/(root)/_components/PublicCourseCard";
import {TestimonialCardSkeleton} from "@/app/(root)/_components/TestimonialCard";
import LearningPathsCarouselClient from "@/components/sections/LearningPathsCarousel.client";
import {LearningPathSkeletonSimpleCard} from "@/app/(root)/_components/LearningPathSimpleCard";

import { getPopularCategories, getRandomCategories} from "@/actions/public/category";
import {getRecentCourses} from "@/actions/public/course";
import {getAllFeatures} from "@/actions/feature";
import {getAllTestimonials} from "@/actions/testimonials";
import {getAllEnrolledLearningPathsByUser, getFeaturedLearningPaths} from "@/actions/learning-path";
import {Course, Enrollment, LearningPath} from "@/models";
import {getAllEnrolledCoursesByUser} from "@/actions/auth/course";


export default async function Home() {

    return (
        <>
            <AppHero/>

            {/* CATEGORIES*/}
            <Section className="py-12">
                <SectionHeader
                    title={"Catégories populaires"}
                    //btnList={["Débutant", "Avec projets", "Certifiantes"]}
                    btnListHref={"/categories"}
                    btnLink={"/categories"}
                />
                <Suspense fallback={<CategoriesLoadingSkeletonLayout/>}>
                    <RenderCategories/>
                </Suspense>
            </Section>

            {/* CATALOG */}
            <Section className="py-12">
                <SectionHeader
                    title={"Formations mises en avant"}
                    btnList={["Débutant", "Intermédiaire", "Avancé", "Expert"]}
                    btnListHref={"/courses"}
                    btnLink={"/courses"}
                />
                <Suspense fallback={<FeaturedCoursesLoadingSkeletonLayout/>}>
                    <RenderCourses/>
                </Suspense>
            </Section>

            {/* Paths */}
            <Section className="py-12">
                <SectionHeader
                    title={"Pourquoi pas un parcours ?"}
                    btnListHref={"/learning-paths"}
                    btnLink={"/learning-paths"}
                />
                <Suspense fallback={<FeaturedLearningPathsLoadingSkeletonLayout/>}>
                    <RenderLearningPaths/>
                </Suspense>
            </Section>

            {/* FEATURES */}
            <Section className="py-12">
                <SectionTitle
                    title="Pourquoi "
                    subTitle={"Une plateforme pensée pour apprendre vite, bien et durablement."}
                >
                    <AppLogoText
                        logo="/logo/CODE_SKILLS_cropped.png"
                        alt="code and skills text"
                        width={250}
                        height={200}
                    />
                </SectionTitle>

                <Suspense fallback={<FeaturesLoadingSkeletonLayout/>}>
                    <RenderFeatures/>
                </Suspense>
            </Section>

            {/* PARTNERS / PROMO */}
            <Section className="py-12">

                <Suspense fallback={<BannerPartnerLoadingSkeletonLayout/>}>
                    <RenderBannerPartner/>
                </Suspense>

            </Section>

            {/* TESTIMONIALS id="testimonials"*/}
            <Section className="py-12">
                <SectionTitle
                    title="Ils apprennent avec Code&Skills"
                    subTitle={"Des retours concrets d’apprenants et de pros."}
                >
                </SectionTitle>

                <Suspense fallback={<TestimonialsLoadingSkeletonLayout/>}>
                    <RenderTestimonials/>
                </Suspense>
            </Section>

            {/* NEWSLETTER id="newsletter"*/}
            <Section className="py-14">
                <div className="mx-auto max-w-2xl text-center">
                    <SectionTitle
                        title="Reste informé des nouvelles formations"
                        subTitle={"Pas de spam, juste le meilleur du code et de la tech."}
                        titleStyle={"text-xl"}
                    >
                    </SectionTitle>
                    <NewsLetterForm/>
                </div>
            </Section>
        </>
    );
}


async function RenderCourses() {

    const {data} = await getRecentCourses();

    const res  =  await getAllEnrolledCoursesByUser();

    let enrolledByUser: Enrollment[] = [];

    if(res?.status === "success") {
        enrolledByUser = res?.data ?? [];
    }

    const enrolledCourseIds = enrolledByUser.map(enrollment => enrollment?.courseId);

    const alreadyEnrolled: string[] = [];

    const cleaned = data?.map((course : Course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        if (isEnrolled) {
            alreadyEnrolled.push(course.id);
        }

        return ({
            ...course,
        })
    });

    return (
        data &&
        <CoursesCarouselClient items={cleaned!} perPage={6} alreadyEnrolled={alreadyEnrolled}/>
    );
}

function FeaturedCoursesLoadingSkeletonLayout() {

    return (
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {Array.from({length: 6}).map((_, index) => (
                <PublicCourseCardSkeleton key={index}/>
            ))}
        </div>
    )
}

async function RenderLearningPaths() {

    const data = await getFeaturedLearningPaths();

    let  enrolledByUser: LearningPath[] =[]; // =  await getAllEnrolledLearningPathsByUser();

    const enrolledCourseIds = enrolledByUser.map(enrollment => enrollment?.id);

    const alreadyEnrolled: string[] = [];

    const cleaned = data.map(path => {
        const isEnrolled = enrolledCourseIds.includes(path.id);
        if (isEnrolled) {
            alreadyEnrolled.push(path.id);
        }

        return ({
            ...path,
        })
    });

    return (
        <LearningPathsCarouselClient items={cleaned} perPage={2} alreadyEnrolled={alreadyEnrolled}/>
    );
}

function FeaturedLearningPathsLoadingSkeletonLayout() {

    return (
        <div className={"grid grid-cols-1 md:grid-cols-2  gap-6"}>
            {Array.from({length: 6}).map((_, index) => (
                <LearningPathSkeletonSimpleCard key={index}/>
            ))}
        </div>
    )
}

async function RenderCategories() {
    const {data} = await getPopularCategories()

    return (
        data &&
        <CategoriesCarouselClient items={data} perPage={4}/>
    )
}

function CategoriesLoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <CategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}

async function RenderFeatures() {
    const {data, totalPages, perPage, page, total} = await getAllFeatures(1, 9)

    return (
        <FeaturedCarouselClient items={data} perPage={3}/>
    )
}

function FeaturesLoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, index) => (
                <FeatureCardSkeleton key={index}/>
            ))}
        </div>
    )
}

async function RenderTestimonials() {
    const {data, totalPages, perPage, page, total} = await getAllTestimonials(1, 9)
    return (
        <TestimonialCarouselClient items={data}/>
    )
}

function TestimonialsLoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, index) => (
                <TestimonialCardSkeleton key={index}/>
            ))}
        </div>
    )
}

async function RenderBannerPartner() {

    const randomCategories = await getRandomCategories();

    return (
        <BannerPartner title={"-30% sur l’abonnement annuel"}
                       subTitle={"Offre de lancement limitée. Accès illimité aux parcours et nouvelles formations."}
                       buttons={<>

                           <Button asChild variant={"secondary"}
                                   className=" p-6 text-sm font-semibold backdrop-blur transition">
                               <Link href={"/subscriptions"}>S’abonner</Link>
                           </Button>
                           <Button
                               asChild
                               className="rounded-xl text-white bg-white/20 p-6 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                               <Link href={"/courses"}>Voir le catalogue</Link>
                           </Button>
                       </>}
        >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {randomCategories.map((p) => (
                    <div key={p}
                         className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80">{p}</div>
                ))}
            </div>
        </BannerPartner>
    )
}

function BannerPartnerLoadingSkeletonLayout() {
    return (
        <Card className=" overflow-hidden rounded-3xl border border-white/10 p-6 ring-1 ring-white/10">
            <div className="absolute inset-0 opacity-70 bg-muted-foreground/5"/>
            <div className={` flex  justify-between space-y-1 `}>
                <div className={`flex flex-col  justify-center space-y-1 flex-1`}>
                    <Skeleton className="h-8 w-4/5 bg-muted-foreground/10"/>
                    <Skeleton className="h-4 w-7/8 bg-muted-foreground/10"/>
                    <div className="mt-4 flex gap-3">
                        <Skeleton className="h-14 w-32 bg-muted-foreground/10"/>
                        <Skeleton className="h-14 w-32 bg-muted-foreground/10"/>
                    </div>
                </div>
                <div className=" flex-1 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Array.from({length: 6}).map((_, index) => (
                        <Skeleton className="h-14 w-32 bg-muted-foreground/10" key={index}/>
                    ))}
                </div>
            </div>
        </Card>
    )
}
