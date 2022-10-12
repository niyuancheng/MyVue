import isNativeTag from "./utils/isNativeTag";
import { parseProps } from "./vdom/direvtives";
import { createComponentVNode, createElementVNode, createTextVNode } from "./vdom/index" //创建不同类型的虚拟节点
import { patch } from "./vdom/patch";


export function initLifeCycle(Vue) {
    Vue.prototype._c = function(tag,props,children) { //创建元素节点
        if(isNativeTag(tag)) {
            return createElementVNode(this,...arguments);
        }
        return createComponentVNode(this,...arguments);
    }

    Vue.prototype._s = function(val) { 
        if(typeof val ==='object') {
            val = JSON.stringify(val); //触发了data中数据的set方法
        }
        return val;
    }

    Vue.prototype._v = function(text) { //创建文本节点
        return createTextVNode(this,text);
    }

    Vue.prototype._render = function() { //调用vm实例上的render函数创建对应的虚拟DOM
        let vm = this;
        return vm.$options.render.call(vm); //所谓的render函数就是之前拼接字符串生成的函数
    }

    Vue.prototype._update = function(el) { //将虚拟DOM转变为真实DOM并且挂载到DOM树上
        let vm = this;
        let vdom = vm._render(); //调用render函数生成虚拟节点
        console.log(vdom)
        parseProps(vdom);
        patch(el,vdom,vm);
    }
}
