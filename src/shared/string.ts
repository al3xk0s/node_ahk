export abstract class StringUtils {
    private constructor() {}

    static readonly toTitleCase = (source: string) => {
        return source.split(' ')
            .filter(e => e != null && e !== '')
            .map(e => e.substring(0, 1).toUpperCase() + e.substring(1))
            .join(' ');
    }
}