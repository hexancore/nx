import type { ProjectType } from "@nx/devkit";
import type { ApplicationType } from "../generators/application/ApplicationType";
import type { LibraryType } from "../generators/library/LibraryType";

export interface ProjectMeta<Subtype extends ApplicationType | LibraryType = ApplicationType | LibraryType> {
  name: string;
  root: string;
  relative: {
    workspaceRoot: string,
    dotWorkspace: string;
  },
  importName: string;
  type: ProjectType;
  subtype: Subtype;
}

export type ApplicationProjectMeta = ProjectMeta<ApplicationType>;
export type LibraryProjectMeta = ProjectMeta<LibraryType>;