import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectSection } from "./ProjectSection";

jest.mock("gatsby-plugin-image");

// TODO need to find out how to mock the image alignment
describe("ProjectSection", () => {
  const mockProject = {
    image1: "test-image-1.jpg",
  };

  it("renders the section with image on the left when alignment is right", () => {
    render(
      <ProjectSection
        alignment="right"
        image={mockProject.image1}
        imageAlt="Test Image"
      >
        <p>Test</p>
      </ProjectSection>
    );

    const image = screen.getByAltText("Test Image");
    const imageContainer = image.closest("div");

    expect(imageContainer).toHaveStyle("order: 1");
  });
});
