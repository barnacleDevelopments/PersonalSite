import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import { TechListing } from "../TechListing/TechListing";
import { GatsbyImage } from "gatsby-plugin-image";

jest.mock("../TechListing/TechListing");
jest.mock("gatsby-plugin-image");

describe("ProjectCard", () => {
  const mockProject = {
    title: "Test Project",
    startDate: "March 2024",
    exerpt: "This is a test excerpt.",
    technologies: [{ name: "Gatsby", image: "" }],
    slug: "/projects/test-project",
    image1: {
      src: "test-image.jpg",
    },
  };

  it("renders project title, date, excerpt, and technologies", () => {
    render(<ProjectCard project={mockProject} />);

    expect(TechListing).toHaveBeenCalledWith(
      {
        technologies: mockProject.technologies,
        descriptive: false,
      },
      expect.anything(),
    );

    expect(GatsbyImage).toHaveBeenCalledWith(
      {
        placeholder: "blurred",
        alt: "image 1",
      },
      expect.anything(),
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("March 2024")).toBeInTheDocument();
    expect(screen.getByText("This is a test excerpt.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
  });

  it("renders a link to the project page", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/projects/test-project");
  });
});
