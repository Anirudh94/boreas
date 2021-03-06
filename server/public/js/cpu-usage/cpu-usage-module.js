'use strict';

import Module from '../common/module.js';
import BasicChartController from '../common/basic-chart-controller.js';
import CpuUsageModel from './cpu-usage-model.js';
import TimeSeriesSplineView from '../common/time-series-spline-view.js';

export default class CpuUsageModule extends Module {
    constructor(appSvc) {
        super(appSvc);
    }

    onStart() {
        return () => {
            this.cpuStatsController.start.call(this.cpuStatsController);
        };
    }

    onStop() {
        return () => {
            this.cpuStatsController.stop.call(this.cpuStatsController);
        };
    }

    onInit() {
        return () => {
            var chartDiv = this.appSvc.createElement('div', 'chart');
            this.appSvc.appendChild(chartDiv);

            this.cpuStatsController = new BasicChartController(this.appSvc, new CpuUsageModel(this.appSvc), new TimeSeriesSplineView(this.appSvc, chartDiv));

            var createOption = (label, value, selected) => {
                var opt = this.appSvc.createElement('option');
                opt.value = value;
                opt.innerHTML = label;
                if (selected) {
                    opt.selected = true;
                }
                return opt;
            }

            var createSelectForm = (id, labelText) => {
                var form = this.appSvc.createElement('form');
                var label = this.appSvc.createElement('label');
                var select = this.appSvc.createElement('select');

                select.id = id;
                select.name = id;

                label.innerHTML = labelText;
                label.for = id;

                form.appendChild(label);
                form.appendChild(select);

                return { form: form, select: select, appendChild: c => select.appendChild(c) };
            };

            var updatePeriod = createSelectForm(this.appSvc.createId('updatePeriodSelect'), 'Update Period');
            updatePeriod.appendChild(createOption('Disabled', -1));
            updatePeriod.appendChild(createOption('1 Second', 1000, true));
            updatePeriod.appendChild(createOption('2 Seconds', 2000));
            updatePeriod.appendChild(createOption('5 Seconds', 5000));
            this.appSvc.appendChild(updatePeriod.form);

            var dataAge = createSelectForm(this.appSvc.createId('dataAgeSelect'), 'Data Age Limit');
            dataAge.appendChild(createOption('None', -1));
            dataAge.appendChild(createOption('10 Seconds', 10, true));
            dataAge.appendChild(createOption('30 Seconds', 30));
            dataAge.appendChild(createOption('1 Minute', 60));
            dataAge.appendChild(createOption('5 Minutes'), 300);
            dataAge.appendChild(createOption('10 Minutes', 600));
            dataAge.appendChild(createOption('30 Minutes', 1800));
            dataAge.appendChild(createOption('1 Hour', 3600));
            this.appSvc.appendChild(dataAge.form);

            updatePeriod.select.addEventListener('change', v => { this.setUpdatePeriod(v.currentTarget.value); });

            dataAge.select.addEventListener('change', v => { this.setDataAgeLimit(v.currentTarget.value); });

            this.cpuStatsController.setUpdatePeriod.call(this.cpuStatsController, updatePeriod.select.value);
            this.cpuStatsController.setMaxAge.call(this.cpuStatsController, dataAge.select.value);
        };
    }

    onDestroy() {
        return () => {
            this.cpuStatsController.reset.call(this.cpuStatsController);
        };
    }

    setUpdatePeriod(v) {
        this.cpuStatsController.stop.call(this.cpuStatsController);
        this.cpuStatsController.setUpdatePeriod.call(this.cpuStatsController, v);
        this.cpuStatsController.start.call(this.cpuStatsController);
    }

    setDataAgeLimit(v) {
        this.cpuStatsController.setMaxAge.call(this.cpuStatsController, v);
    }
}
