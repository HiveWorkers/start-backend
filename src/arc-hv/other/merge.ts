export function Merge (...arg: any[]) {
    var result: any = {};
    arg.forEach((value: any, index: number) => {
        Object.keys(value).forEach((key: string, index2: number) => {
            result[key] = value[key];
        });
    });
    return result;
}