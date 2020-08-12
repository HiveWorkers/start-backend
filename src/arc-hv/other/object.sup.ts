import { Entity } from "../db/Entity";
import { CModel, CViewModel } from "../db/model";


export function InstantiateGenericType<T> (type: (new () => T)): T {
    return new type();
}

export function InstantiateGenericTypeEntity<E extends Entity<IE>, IE> (
    type: (new (argsEntity?: IE) => E),
    argsEntity?: IE
): E {
    return new type(argsEntity);
}


export function InstantiateGenericTypeModel <
    IE,
    E extends Entity<IE>,
    M extends CModel<E, IE>
> (
    type: (new (
        argModel: (new (argsEntity?: IE) => E)
    ) => M),
    argModel: (new (argsEntity?: IE) => E)
): M {
    return new type(argModel);
}
export function InstantiateGenericTypeViewModel <
    IE,
    M extends CViewModel<IE>
> (
    type: (new () => M)
): M {
    return new type();
}