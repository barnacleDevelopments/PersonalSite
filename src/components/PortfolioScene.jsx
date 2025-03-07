import React from "react";
import { Canvas } from "@react-three/fiber";
import Loadable from "@loadable/component";

function PortfolioScene({ projects }) {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {projects.map((project, index) => (
        <ProjectPanel key={index} project={project} />
      ))}
    </Canvas>
  );
}

function ProjectPanel({ project }) {
  return (
    <mesh position={[1, 2, -3]} onClick={() => window.open(project.slug)}>
      <boxGeometry args={[1.5, 1, 0.1]} />
      <meshStandardMaterial color="hotpink" />
      {project.title}
    </mesh>
  );
}

const LoadablePortfolioScene = PortfolioScene; //Loadable(() => import("./PortfolioScene"));

export default LoadablePortfolioScene;
