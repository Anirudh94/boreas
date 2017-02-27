'use strict';

import Module from '../common/module.js';
import BasicChartController from '../common/basic-chart-controller.js';
import VmCpuUsageModel from './vm-cpu-usage-model.js';
import TimeSeriesLineView from '../common/time-series-line-view.js';

export default class VmCpuUsageModule extends Module {
    constructor(appSvc) {
        super(appSvc);
    }

    onStart() {
        return () => {
            this.vmCpuStatsController.start.call(this.vmCpuStatsController);
        };
    }

    onStop() {
        return () => {
            this.vmCpuStatsController.stop.call(this.vmCpuStatsController);
        };
    }

    onInit() {
        return () => {
            var chartDiv = this.appSvc.createElement('div', 'chart');
            this.appSvc.appendChild(chartDiv);

            this.vmCpuStatsController = new BasicChartController(this.appSvc, new VmCpuUsageModel(this.appSvc), new TimeSeriesLineView(this.appSvc, chartDiv));

            this.vmCpuStatsController.setUpdatePeriod.call(this.vmCpuStatsController, 1000 * 1);
            this.vmCpuStatsController.setMaxAge.call(this.vmCpuStatsController, 30 * 1);
        };
    }

    onDestroy() {
        return () => {
            this.vmCpuStatsController.reset.call(this.vmCpuStatsController);
        };
    }

    setUpdatePeriod(v) {
        this.vmCpuStatsController.stop.call(this.vmCpuStatsController);
        this.vmCpuStatsController.setUpdatePeriod.call(this.vmCpuStatsController, v);
        this.vmCpuStatsController.start.call(this.vmCpuStatsController);
    }

    setDataAgeLimit(v) {
        this.vmCpuStatsController.setMaxAge.call(this.vmCpuStatsController, v);
    }
}
