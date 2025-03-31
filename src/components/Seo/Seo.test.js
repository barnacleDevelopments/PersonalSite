import React from "react";
import Seo from "./Seo.jsx";
import { render, waitFor } from "@testing-library/react";
jest.mock('@reach/router');
import metaData from "../../../gatsby-config.js"

// can't use imported data in jest mock need to use data defined inside this file
jest.mock("gatsby", () => ({
    graphql: jest.fn(),
    useStaticQuery: jest.fn(() => ({
        site: {
            siteMetadata: {
                defaultLang: "en",
                siteUrl: "https://devdeveloper.ca",
                defaultTitle: "Devin Davis | Full-Stack Developer & Devops Engineer",
                github: "https://github.com/barnacleDevelopments",
                linkedin: "https://www.linkedin.com/in/devin-dev-d-63008412b/",
                metaImage: {
                    src: `assets/logo_2.png`,
                    width: 110,
                    height: 110,
                },
                defaultDescription:
                    "Explore the professional portfolio of Devin Davis, a results-oriented Full-Stack Web Developer specializing Devops and Blockchain.",
                defaultKeywords: [
                    "Web development",
                    "Full-stack Web developer",
                    "JavaScript Frameworks",
                    "React developer",
                    "Angular",
                    "Node.js",
                    "Next.Js",
                    "Front-end",
                    "Back-end",
                    "Smart contract",
                    "Blockchain",
                    "Devops engineer",
                    "DApp development",
                    "Decentralized applications",
                    "Web3 development",
                    "Smart contracts",
                    "Blockchain technology",
                    "API integration",
                    "CI/CD pipelines",
                    "Devin Davis portfolio",
                ],
            },
        }
    }))
}))

describe("SEO", () => {
    it("renders the SEO component with the correct default values", async () => {
        render(<Seo />);
        await waitFor(() => {
            const title = document.querySelector("title");
            const description = document.querySelector(
                'meta[name="description"]'
            );
            const ogTitle = document.querySelector(
                'meta[name="og:title"]'
            );
            const ogDescription = document.querySelector(
                'meta[name="og:description"]'
            );
            const github = document.querySelector(
                'meta[name="github"]'
            );
            const ogImage = document.querySelector(
                'meta[name="og:image"]'
            );
            const twitterTitle = document.querySelector(
                'meta[name="twitter:title"]'
            );
            const twitterDescription = document.querySelector(
                'meta[name="twitter:description"]'
            );
            const twitterImage = document.querySelector(
                'meta[name="twitter:image"]'
            );
            const keywords = document.querySelector(
                'meta[name="keywords"]'
            );

            expect(title).toHaveTextContent(
                `${metaData.siteMetadata.title}`
            );
            expect(description).toHaveAttribute(
                "content",
                metaData.siteMetadata.description
            );
            expect(github).toHaveAttribute(
                "content",
                metaData.siteMetadata.github
            );
            expect(ogTitle).toHaveAttribute(
                "content",
                metaData.siteMetadata.defaultTitle
            );
            expect(ogDescription).toHaveAttribute(
                "content",
                metaData.siteMetadata.description
            );
            expect(ogImage).toHaveAttribute(
                "content",
                `${metaData.siteMetadata.siteUrl}${metaData.siteMetadata.image.src}`
            );
            expect(twitterTitle).toHaveAttribute(
                "content",
                metaData.siteMetadata.defaultTitle
            );
            expect(twitterDescription).toHaveAttribute(
                "content",
                metaData.siteMetadata.description
            );
            expect(twitterImage).toHaveAttribute(
                "content",
                `${metaData.siteMetadata.siteUrl}${metaData.siteMetadata.image.src}`
            );
            expect(keywords).toHaveAttribute(
                "content",
                metaData.siteMetadata.keywords.join(",")
            );
        });


    });

    it("renders the SEO component with custom values", async () => {
        const customTitle = "Custom Title";
        const customDescription = "Custom Description";
        const customImage = "/custom-image.jpg";
        const customKeywords = ["custom", "keywords"];

        render(
            <Seo
                title={customTitle}
                description={customDescription}
                image={customImage}
                keywords={customKeywords}
            />
        );

        await waitFor(() => {
            const title = document.querySelector("title");
            const description = document.querySelector(
                'meta[name="description"]'
            );
            const ogTitle = document.querySelector(
                'meta[name="og:title"]'
            );
            const ogDescription = document.querySelector(
                'meta[name="og:description"]'
            );
            const ogImage = document.querySelector(
                'meta[name="og:image"]'
            );
            const twitterTitle = document.querySelector(
                'meta[name="twitter:title"]'
            );
            const twitterDescription = document.querySelector(
                'meta[name="twitter:description"]'
            );
            const twitterImage = document.querySelector(
                'meta[name="twitter:image"]'
            );
            const keywords = document.querySelector(
                'meta[name="keywords"]'
            );

            expect(title).toHaveTextContent(customTitle);
            expect(description).toHaveAttribute("content", customDescription);
            expect(ogTitle).toHaveAttribute("content", customTitle);
            expect(ogDescription).toHaveAttribute("content", customDescription);
            expect(ogImage).toHaveAttribute("content", `${metaData.siteMetadata.siteUrl}${customImage}`);
            expect(twitterTitle).toHaveAttribute("content", customTitle);
            expect(twitterDescription).toHaveAttribute("content", customDescription);
            expect(twitterImage).toHaveAttribute("content", `${metaData.siteMetadata.siteUrl}${customImage}`);
            expect(keywords).toHaveAttribute("content", customKeywords.join(","));
        });
    })
})
