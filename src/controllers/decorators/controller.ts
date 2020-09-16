import "reflect-metadata";
import { AppRouter } from "../../AppRouter";
import { Methods } from "./methods";
import { MetaDataKeys, MetaDataKeysEnum } from "./metadataKeys";
import { Request, Response, NextFunction, RequestHandler } from "express";
/*
  - this decorator will be applied to classes
  - the target received by the decorator is 
    the constructor function of the class
  - class decorator (controller) runs last, and that's why 
    you can retrieve the metadata stored by each method
    decorator (route).
  - class methods are defined in constructor function's
    prototype : target.prototype  
*/

function bodyValidators(keys: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send("Invalid request");
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing property ${key}`);
        return;
      }
    }
    next();
  };
}

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();
    // loop through the prototype of
    // the constructor function
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      // retrieve the metadata stored by each route decorator
      const path = Reflect.getMetadata(
        // seems enum is a better choic than union types
        MetaDataKeysEnum.path,
        target.prototype,
        key
      );

      // use type annotation to narrow the type
      const method: Methods = Reflect.getMetadata(
        MetaDataKeysEnum.method,
        target.prototype, // where methods are defined
        key
      );

      const middlewares =
        Reflect.getMetadata(
          MetaDataKeysEnum.middleware,
          target.prototype,
          key
        ) || [];

      const requiredBodyProps =
        Reflect.getMetadata(
          MetaDataKeysEnum.validator,
          target.prototype,
          key
        ) || [];

      const validator = bodyValidators(requiredBodyProps);

      if (path) {
        // type is narrowed so now TS can
        // check if you are really calling
        // a function
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler
        );
      }
    }
  };
}
