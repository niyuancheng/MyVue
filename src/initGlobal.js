import mergeOptions from "./mergeOptions"

export function initGlobal(Vue) {
    Vue.mixin = function(options) { //给Vue构造函数上添加全局的api函数
        Vue.options = mergeOptions(Vue ,options)
    }

    Vue.extend = function(options) { //该静态方法用于生成组件的实例对象

        function Sub() { //Sub是Vue的子类
            this._init(options);
        }

        Sub.prototype = Object.create(Vue.prototype);
        Sub.prototype.constructor = Sub;

        Sub.extendOptions = options;
        return Sub;
    }

    Vue.component = function(name,component) { //申明一个全局组件
        component = typeof component === 'function' ? component : Vue.extend(component);

        Vue.options.components[name] = component;
    }
}