'use strict';

export default class View {
    constructor(appSvc, bindPoint) {
        this.appSvc = appSvc;
        this.bindPoint = bindPoint;
    }

    showDialog(msg) {
        this.appSvc.showDialog(msg);
    }

    log(msg) {
        this.appSvc.log(msg);
    }

    destroy() {}

    setPlaceholder() {}
}
