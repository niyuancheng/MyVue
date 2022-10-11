import mergeOptions from "./mergeOptions";
import { initMixin } from "./initMixin";
import { initLifeCycle } from "./initLifecycle";
import { initGlobal } from "./initGlobal";

function Vue(options) {
    this._init(options); //初始化Vue
}

Vue.options = {};//全局的公共配置选项
Vue.options.components = {}

//init...方法是向vue实例的原型对象上添加方法
initLifeCycle(Vue);
initMixin(Vue);
initGlobal(Vue);

export default Vue;