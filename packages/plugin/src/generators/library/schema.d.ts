import type { LibraryType } from "./LibraryType";

export interface LibraryGeneratorSchema {
  directory: string;
  type: LibraryType | 'backend' | 'frontend' | 'shared';
}