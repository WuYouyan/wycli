
type NonUndefined<T> = T extends undefined ? never : T;

export function removeUndefinedKeys<T extends Record<string, any>>(directive: T): Record<keyof T, NonUndefined<any>> {
    Object.keys(directive).forEach((key) => {
        if (directive[key as keyof T] === undefined) {
            delete directive[key as keyof T];
        }
    });
    return directive;
}