'use strict';

export default class BasicChartController {
    constructor(appSvc, model, view) {
        this.model = model;
        this.view = view;
        this.view.setPlaceholder();
        this.enabled = true;
        this.timer = appSvc.createTimer(this.update.bind(this));

        this.model.initKeys(
            keys => {
                this.view.init(keys,
                    (d, i) => { this.enabled = false; },
                    (d, i) => { this.enabled = true; }
                );
            },
            () => { this.view.log('Key initialization failed'); this.reset(); }
        );
    }

    reset() {
        stop();
        this.view.destroy();
        this.model.clearData();
        this.model.clearKeys();
    }

    stop() {
        this.timer.stop();
    }

    start() {
        if (this.timer.isRunning()) {
            stop();
        }
        this.timer.start();
    }

    setUpdatePeriod(period) {
        this.timer.updatePeriod = period;
    }

    update() {
        this.model.update(
            (keys, data) => {
                if (!this.enabled) {
                    return;
                }
                this.view.setData([keys].concat(data));
            },
            () => { this.view.log('Update failed'); this.stop(); }
        );
    }

    setMaxAge(maxAge) {
        this.model.maxAge = maxAge;
        this.model.trim();
        this.view.setData([this.model.keys].concat(this.model.data));
    }
}
