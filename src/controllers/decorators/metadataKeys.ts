// use enum instead of union types
export enum MetaDataKeysEnum {
  method = "method",
  path = "path",
  middleware = "middleware",
  validator = "validator",
}

export type MetaDataKeys = "method" | "path" | "middleware" | "validator";
