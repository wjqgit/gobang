import RechargeArea0 from './RechargeArea0.js';
import RechargeArea1 from './RechargeArea1.js';
import {
    VERSION
} from './Configurations.js';

/**
 * @author wjq / http://wangjiaqi.xyz
 */

var RechargeArea;

(function() {
    switch (VERSION) {
        case 0:
            RechargeArea = RechargeArea0;
            break;
        case 1:
            RechargeArea = RechargeArea1;
            break;
        default:
            console.warn(`Version ${VERSION} is not supported `);
            RechargeArea = RechargeArea1;
    }
})();

export default RechargeArea
