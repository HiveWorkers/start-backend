export function FormatDate(date: string | number) {
    let date2 = new Date(date);
    const Organize = function(element: number) {
        return (element < 10) ? `0${element}` : element;
    };
    
    return `${Organize(date2.getUTCDate())}-${Organize(date2.getUTCMonth())}-${Organize(date2.getUTCFullYear())} At ${Organize(date2.getUTCHours())}:${Organize(date2.getUTCMinutes())}:${Organize(date2.getUTCSeconds())}`
}

export const DateNow: number = Date.now();