type TEasingFn = (pos: number) => number;
type TEasingExecute = (name: string, pos: number) => number;

class Easing {
    constructor (public name: string, public fn: TEasingFn) {}
}

interface IEasingFunctions {
    has: (fnName: string) => boolean;
    list: () => Array<string>;
    execute: TEasingExecute;
}

export class EasingFunctions implements IEasingFunctions {
    private easings: Array<Easing> = [];

    constructor () {
        this.init();
    }

    has (fnName: string): boolean {
        let found = false;
        for (let i = 0; i < this.easings.length; i++) {
            let easing = this.easings[i];
            if (easing.name === fnName) {
                found = true;
            }
        }

        return found;
    }

    list (): Array<string> {
        return this.easings.map((easing) => {
            return easing.name;
        });
    }

    execute (name: string, pos: number): number {
        let fn  = this.get(name);
        return fn(pos);
    }

    /**
     * Create easing functions.
     * Easing equations from https://github.com/danro/easing-js/blob/master/easing.js 
     */
    private init () {
        this.set('easeOutSine', (pos: number) => {
            return Math.sin(pos * (Math.PI / 2));
        });

        this.set('easeInOutSine', (pos: number) => {
            return (-0.5 * (Math.cos(Math.PI * pos) - 1));
        });

        this.set('easeInOutQuint', (pos: number) => {
            if ((pos /= 0.5) < 1) {
                return 0.5 * Math.pow(pos, 5);
            }
            return 0.5 * (Math.pow((pos - 2), 5) + 2);
        });
    }

    private set (name: string, fn: TEasingFn) {
        const easing = new Easing(name, fn);
        this.easings.push(easing);
    }

    private get (name: string) {
        let easingFn;
        this.easings.forEach((easing) => {
            if (easing.name === name) {
                easingFn = easing.fn;
            }
        });
        return easingFn;
    }
}
