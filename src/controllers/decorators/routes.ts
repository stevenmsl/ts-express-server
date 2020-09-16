import "reflect-metadata"; // This will introduce a global variable Reflect
import { Methods } from "./methods";
import { MetaDataKeys, MetaDataKeysEnum } from "./metadataKeys";
/* 
  decorator factory
  - customize how a decorator is applied to a declaration
  - allows you to pass in additional configuration
  - returns a function  
*/

function routeBinder(method: Methods) {
  return function (path: string) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
      // remeber what the confgiured path is
      // on which method so we can add it
      // to the router later
      Reflect.defineMetadata(MetaDataKeysEnum.path, path, target, key);
      Reflect.defineMetadata(MetaDataKeysEnum.method, method, target, key);
    };
  };
}

export const get = routeBinder("get");
export const put = routeBinder("put");
export const post = routeBinder("post");
export const del = routeBinder("delete");
export const patch = routeBinder("patch");
