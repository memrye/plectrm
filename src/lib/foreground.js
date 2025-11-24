export class Foreground {
    constructor(_foregroundEl) {
        this.foregroundElement = _foregroundEl;
        this.el.classList.toggle('active', true);
    }

    get el() {
        if (this.foregroundElement) { return this.foregroundElement; };
        const foregroundList = document.getElementsByClassName('foreground');
        if (foregroundList.length == 1) {
            return foregroundList.item(0);
        } else if (foregroundList.length > 1){
            console.warn('Foreground object missing element and cannot resolve it from document as there are multiple')
            return foregroundList.item(foregroundList.length - 1);
        };
    };

    active(isActive = true) {
        this.el.classList.toggle('active', isActive);
    };

    newWindow(userFunction = () => { return; }){
        userFunction();
    }
}
