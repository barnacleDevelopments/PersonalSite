import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import { getImage } from "gatsby-plugin-image";
import "@testing-library/jest-dom";
import { TechListing } from "../../templates/ProjectPage";

// Mock GatsbyImage and getImage
jest.mock("gatsby-plugin-image", () => ({
  GatsbyImage: ({ image, alt }) => <img src={image?.src} alt={alt} />,
  getImage: jest.fn(() => ({ src: "test-image.jpg" })),
}));

// Mock TechListing
jest.mock("../../templates/ProjectPage", () => ({
  TechListing: ({ technologies }) => (
    <div data-testid="tech-listing">
      {technologies.map((tech) => tech.name).join(", ")}
    </div>
  ),
}));

describe("ProjectCard", () => {
  const mockProject = {
    title: "Test Project",
    startDate: "March 2025",
    exerpt: "This is a sample excerpt.",
    technologies: [
      { name: "React", image: "" },
      { name: "GraphQL", image: "" },
    ],
    slug: "/projects/test-project",
    image1: {},
  };

  it("renders project information correctly", () => {
    render(<ProjectCard project={mockProject} />);

    expect(
      screen.getByRole("heading", { name: /test project/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/march 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/sample excerpt/i)).toBeInTheDocument();
    expect(screen.getByTestId("tech-listing")).toHaveTextContent(
      "React, GraphQL",
    );
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();

    const viewLink = screen.getByRole("link", { name: /view/i });
    expect(viewLink).toHaveAttribute("href", "/projects/test-project");

    const image = screen.getByAltText("image 1");
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  it("handles missing excerpt gracefully", () => {
    const projectWithoutExcerpt = { ...mockProject, exerpt: null };
    render(<ProjectCard project={projectWithoutExcerpt} />);

    expect(screen.queryByText(/sample excerpt/i)).not.toBeInTheDocument();
  });
});
