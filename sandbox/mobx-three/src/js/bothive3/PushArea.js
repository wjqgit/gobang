import PushArea0 from './PushArea0.js';
import PushArea1 from './PushArea1.js';
import {
    VERSION
} from './Configurations.js';


/**
 * @author wjq / http://wangjiaqi.xyz
 */

var PushArea;

(function () {
  switch (VERSION) {
      case 0:
          PushArea = PushArea0;
          break;
      case 1:
          PushArea = PushArea1;
          break;
      default:
          console.warn(`Version ${VERSION} is not supported `);
          PushArea = PushArea1;
  }
})();

export {
    PushArea
}
