import { createElementVNode, createTextVNode } from "./vdom/index" //创建不同类型的虚拟节点
function appendAttrs(vnode) {
    for(let key in vnode.props) {
        if(key === 'style') {
            let res = ``
            for(let item in vnode.props.style) {
                res += `${item}:${vnode.props.style[item]};`;
            }
            console.log(res);
            vnode.el.setAttribute("style",res);
        } else {
            vnode.el.setAttribute(key,vnode.props[key]);
        }
    }
}
function createElement(vnode) { //根据虚拟节点vnode创建对应的真实DOM元素
    if(vnode.tag) {
        vnode.el = document.createElement(vnode.tag);
        appendAttrs(vnode);
        if(vnode.children) {
            vnode.children.forEach(child=>{
                vnode.el.appendChild(createElement(child));
            })
        }
    } else {
        vnode.el = document.createTextNode(vnode.text);
    }
    return vnode.el;
    
}

function patch(oldVNode,newVNode) {
    if(oldVNode.nodeType === 1) { //如果是真实的DOM元素的话则进行初次渲染
        let dom = createElement(newVNode);
        oldVNode.parentNode.insertBefore(dom,oldVNode.nextSibling);
        oldVNode.parentNode.removeChild(oldVNode);
    } else { //如果不是则需要进入diff算法环节比较新旧虚拟节点的差异
        console.log("开始进行diff算法");
    }

    Vue._vnode = newVNode;
}

export function initLifeCycle(Vue) {
    Vue.prototype._c = function(tag,props,children) { //创建元素节点
        return createElementVNode(this,...arguments);
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
        let vdom = vm._render();
        patch(el,vdom);
    }
}
