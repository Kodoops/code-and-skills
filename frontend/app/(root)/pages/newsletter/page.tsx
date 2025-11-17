import React from 'react';
import Section from "@/components/sections/Section";
import SectionTitle from "@/components/sections/SectionTitle";
import NewsLetterForm from "@/components/sections/NewsLetterForm";

const Page = () => {
    return (
        <div>
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
        </div>
    );
};

export default Page;