export interface RollupAssetEntryOutput {
  regex: RegExp;
  output: (info: ({ name: string; })) => string;
}
