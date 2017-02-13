'use strict';

import ApplicationService from './common/application-service.js';

import VmCpuUsageModule from './vm-cpu-usage/vm-cpu-usage-module.js';

const modules = [];
const bindPoints = [];

const rootAppSvc = new ApplicationService("ThermostatWeb", document.body);

const vmCpuUsageDiv = rootAppSvc.createElement('div', 'vmCpuUsageDiv');
bindPoints.push(vmCpuUsageDiv);

const vmCpuUsageModule = new VmCpuUsageModule(new ApplicationService('VmCpuUsage', vmCpuUsageDiv));
modules.push(vmCpuUsageModule);

window.addEventListener('load', () => {
    bindPoints.forEach(bindPoint => {
        rootAppSvc.appendChild(bindPoint);
    });

    modules.forEach(module => {
        module.onInit().call(module);
    });

    modules.forEach(module => {
        module.onStart().call(module);
    });
});

window.addEventListener('unload', () => {
    modules.forEach(module => {
        module.onStop().call(module);
    });

    modules.forEach(module => {
        module.onDestroy().call(module);
    });
});
