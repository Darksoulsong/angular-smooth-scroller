export class Easing {
    easeOutSine (pos: number): number {
        return Math.sin(pos * (Math.PI / 2));
    }

    easeInOutSine (pos: number): number {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    }

    easeInOutQuint (pos: number): number {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
    }
}
