export class ElementNotFoundError extends Error {
    constructor(selector: string | HTMLElement | ng.IAugmentedJQuery) {
        let sel = '';
        if (selector && typeof selector === 'string') {
            sel = `with selector ${selector}`;
        }
        super(`Element ${sel} not found.`);
        this.name = 'ElementNotFoundError';
        this.stack = new Error().stack;
    }
}
