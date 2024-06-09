import type { ProjectType } from "@nx/devkit";
import type { ApplicationType } from "../generators/application/ApplicationType";
import type { LibraryType } from "../generators/library/LibraryType";

export type ProjectSubtype = ApplicationType | LibraryType;

export interface HcNxProjectDirectoryMeta {
  name: string;
  root: string;
  relative: {
    workspaceRoot: string,
    dotWorkspace: string;
  },
  isApp: boolean;
  type: ProjectType;
}

export interface HcNxProjectMeta<Subtype extends ProjectSubtype = ProjectSubtype> extends HcNxProjectDirectoryMeta {
  importName: string;
  subtype: Subtype;
}

export type ApplicationProjectMeta = HcNxProjectMeta<ApplicationType>;
export type LibraryProjectMeta = HcNxProjectMeta<LibraryType>;
