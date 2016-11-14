export class ElementHelper {
    mainContainer: HTMLElement;

    isHTMLElement (el: any): boolean {
		return el.constructor.name.toLowerCase().indexOf('html') !== -1;
	}

    isJQuery (el: any): boolean {
        return el.constructor.name === 'Object' && 'bind' in el;
    }

    elementHasScrollbar (el: HTMLElement, horizontal?: boolean): boolean {
		let method = horizontal ? 'Width' : 'Height';
		let gap = 30;
		let elementHasLayout = el[`scroll${method}`] > 0;
		let hasScrollbar;

		// check if element has layout
		if (!elementHasLayout) {
			el.style.display = 'block';
			el.style.overflow = 'auto';
		}

		hasScrollbar = (el[`scroll${method}`]) > (el[`client${method}`] + gap);

		if (!elementHasLayout) {
			el.style.display = '';
			el.style.overflow = '';
		}

		return hasScrollbar;
	}

    getElementY (element: any): number {
		let scrollableParent = this.mainContainer || this.getFirstParentNodeWithScrollbars(element);
		let parentTop = scrollableParent.offsetTop;
		let elementTop = element.offsetTop;
		let elementDistanceFromTop = elementTop -  parentTop;
		return elementDistanceFromTop;
	}

    getFirstParentNodeWithScrollbars (el: any): HTMLElement {
		let elem: Node = typeof el === 'string' ? document.querySelector(el) : el;
		while (elem) {
			if (this.elementHasScrollbar(elem as HTMLElement)) {
				break;
			} else {
				elem = elem.parentNode;
			}
		}
		return elem as HTMLElement;
	}

    setMainContainer (containerElementId: string | HTMLElement | ng.IAugmentedJQuery) {
		let container;

		if (typeof containerElementId === 'string') {
			container = document.querySelector(containerElementId);
		}
		if (this.isHTMLElement(containerElementId)) {
			container = containerElementId;
		}
		if (this.isJQuery(containerElementId)) {
			container = containerElementId[0];
		}

		this.mainContainer = container;
	}

    getPosition (elem: HTMLElement | Window): number {
		if (elem instanceof Window) {
			return elem.pageYOffset;
		}
		return elem.scrollTop;
	}
}
