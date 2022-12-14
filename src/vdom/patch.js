import { callHooks } from "../hooks";
import { patchVNode } from "./patchVNode";

function appendAttrs(vnode) {
    for (let key in vnode.props) {
        if (key === 'style') {
            for (let item in vnode.props.style) {
                vnode.el.style[item] = vnode.props.style[item];
            }
        } else {
            if (typeof vnode.props[key] !== 'function') {
                vnode.el.setAttribute(key, vnode.props[key]);
            } else {
                vnode.el.addEventListener(key, vnode.props[key]);
            }
        }
    }
}

export function createElement(vnode, vm) { //根据虚拟节点vnode创建对应的真实DOM元素
    if (vnode.tag) {
        if (vnode.type === 'tag') {
            vnode.el = document.createElement(vnode.tag);
            appendAttrs(vnode);
            if (vnode.children) {
                vnode.children.forEach(child => {
                    vnode.el.appendChild(createElement(child, vm));
                })
            }
        } else if (vnode.type === 'component') {
            console.log(vm)
            let com = new vm.$options.components[vnode.tag](); //获得组件节点的实例对象
            com.$mount();

            return com._vnode.el;
        }

    } else {
        vnode.el = document.createTextNode(vnode.text || "");
    }
    return vnode.el;
}

export function isSame(vnode1, vnode2) { //判断是否为同一虚拟节点
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}

export function patch(oldVNode, newVNode, vm) {
    if (!oldVNode) { //当没有传入oldVNode时，代表该次渲染的节点为组件节点
        callHooks(vm, "beforeMount");
        let dom = createElement(newVNode, vm);
        callHooks(vm, "mounted");
        vm._vnode = newVNode;
    } else {
        if (oldVNode.nodeType === 1) { //如果是真实的DOM元素的话则进行初次渲染
            callHooks(vm, "beforeMount");
            let dom = createElement(newVNode, vm);
            oldVNode.parentNode.insertBefore(dom, oldVNode.nextSibling);
            oldVNode.parentNode.removeChild(oldVNode);
            callHooks(vm, "mounted");
        } else { //如果不是则需要进入diff算法环节比较新旧虚拟节点的差异
            callHooks(vm, "beforeUpdate");
            patchVNode(oldVNode, newVNode);
            newVNode.el = oldVNode.el;
            callHooks(vm, "updated");
        }
    }

    //根据diff算法更新旧的真实DOM节点
    vm._vnode = newVNode;
    return newVNode.el
}