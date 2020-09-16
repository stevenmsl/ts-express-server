import "reflect-metadata";
import { MetaDataKeysEnum } from "./metadataKeys";

export function bodyValidator(...keys: string[]) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetaDataKeysEnum.validator, keys, target, key);
  };
}
