import type { ApplicationType } from "./ApplicationType";

export interface ApplicationGeneratorSchema {
  directory: string;
  type: ApplicationType | 'backend' | 'frontend';
}