import { getDevProjects } from "@/lib/content";
import ProjectsGrid from "./ProjectsGrid";

/**
 * Projects are loaded from content/dev-projects/*.md (one file per project).
 * To add a project, copy content/dev-projects/_template.md.
 */
const Projects = () => {
  const projects = getDevProjects();
  return <ProjectsGrid projects={projects} />;
};

export default Projects;
