export interface RouteDefinition {
    data: any;
    // Path to our route
    path: string;
    // HTTP Request method (get, post, ...)
    requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put' | 'all';
    // Method name within our class responsible for this route
    methodName: string;
}

export const Route = (method: 'get' | 'post' | 'delete' | 'options' | 'put' | 'all', thePath: string, theData: any = []) =>
{
    return (target: any, thePropertyKey: string, descriptor: PropertyDescriptor) =>
    {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
          Reflect.defineMetadata('routes', [], target.constructor);
        }
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;
        routes.push({
          requestMethod: method,
          path: thePath,
          data: theData,
          methodName: thePropertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
};

export const All = (path: string, data: any = []) =>
{
    return Route('all', path, data);
};

export const Delete = (path: string, data: any = []) =>
{
    return Route('delete', path, data);
};

export const Get = (path: string, data: any = []) =>
{
  return Route('get', path, data);
};

export const Options = (path: string, data: any = []) =>
{
  return Route('options', path, data);
};

export const Post = (path: string, data: any = []) =>
{
  return Route('post', path, data);
};

export const Put = (path: string, data: any = []) =>
{
  return Route('put', path, data);
};