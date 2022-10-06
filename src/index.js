import mergeOptions from "./globalAPI";
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";

function Vue(options) {
    this._init(options); //初始化Vue
}
Vue.options = {};//全局的公共配置选项

//init...方法是向vue实例的原型对象上添加方法
initLifeCycle(Vue);
initMixin(Vue);

Vue.mixin = function(options) {
    Vue.options = mergeOptions(Vue.options,options)
}

export default Vue;