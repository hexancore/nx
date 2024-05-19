import type { ProjectType } from "@nx/devkit";
import type { LibraryType } from "../generators/library/LibraryType";

export interface ProjectMeta {
  name: string;
  root: string;
  importName: string;
  type: ProjectType;
  libraryType?: LibraryType;
}