import "reflect-metadata";
import { RequestHandler } from "express";
import { MetaDataKeysEnum } from "./metadataKeys";

// you can apply use decorator multiple times on a method
// to add multiple middlewares
export function use(middleware: RequestHandler) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const middlewares =
      Reflect.getMetadata(MetaDataKeysEnum.middleware, target, key) || [];
    // add the middleware to the array
    Reflect.defineMetadata(
      MetaDataKeysEnum.middleware,
      [...middlewares, middleware],
      target,
      key
    );
  };
}
