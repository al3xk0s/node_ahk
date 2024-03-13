declare interface String {
    toTitleCase(): string;
}

String.prototype.toTitleCase = function() {
    return this.split(' ')
        .filter(e => e != null && e !== '')
        .map(e => e.substring(0, 1).toUpperCase() + e.substring(1))
        .join(' ');
}
