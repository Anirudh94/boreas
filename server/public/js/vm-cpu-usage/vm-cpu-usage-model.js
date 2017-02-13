'use strict';

import BasicModel from '../common/basic-model.js';

export default class VmCpuUsageModel extends BasicModel {
    constructor(appSvc) {
        super();
        this.appSvc = appSvc;
        this.keys = ['date'];
        this.maxAge = -1;
        
        this.timeStamp = 0;
    }

    initKeys(onSuccess, onFailure) {
        this.appSvc.submitJsonRequest('api/agents/all/vms/all?size=50',
            json => {
                for (let i = 0; i < Object.keys(json.response).length; i++) {
                    this.keys.push(json.response[i].vmId);
                }
                onSuccess(this.keys);
            },
            onFailure
        );
        this.appSvc.submitJsonRequest('plugins/vm-cpu-stats/agents/all/vms/all',
            json => {
                this.timeStamp = json.response[0].timeStamp.$numberLong;
            },
            onFailure
        );
    }

    update(onSuccess, onFailure) {
        if (this.timeStamp == 0) {
            return;
        }

        var items = [];
        const date = new Date(parseInt(this.timeStamp));
        items.push(date);

        for (let i = 1; i < this.keys.length; i++) {    
            this.appSvc.submitSynchronousJsonRequest('plugins/vm-cpu-stats/agents/all/vms/' + this.keys[i] + '?minTimestamp=' + this.timeStamp,
                json => {
                    if (json.response[0] != null) {
                        const resp = json.response[0];
                        this.timeStamp = resp.timeStamp.$numberLong;   
                        items.push(resp.cpuLoad);
                    } else {
                        items.push(0);
                    }
                },
                onFailure
            );
        }
        if (items.length > 1) {
            console.log(items);
            this.data.push(items);    
            onSuccess(this.keys, this.data);
            this.trim();
        }

    }

    trim() {
        while (this.data.length > 0) {
            const now = Date.now();
            const oldest = this.data[0];
            const age = (now - oldest[0]) / 1000;
            
            if (this.maxAge > 0 && age > this.maxAge) {
                this.data.shift();
            } else {
                break;
            }
        }
    }
}
