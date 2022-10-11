import { createElement, isSame } from "./patch";
import { updateChildren } from "./updateChildren";

export function patchVNode(oldVNode, newVNode) { //该函数用于比较两个虚拟节点进行最小量的更新
    if (!isSame(oldVNode, newVNode)) {
        //如果不是相同节点，则拆除旧的，用新的节点来替换
        let dom = createElement(newVNode);
        oldVNode.el.parentNode.replaceChild(dom, oldVNode.el);
    } else {
        if (newVNode.text) {
            oldVNode.el.parentNode.innerHTML = newVNode.text;
        } else {
            if (oldVNode.text) {
                let dom = createElement(newVNode);
                oldVNode.el.parentNode.appendChild(dom);
                oldVNode.el.parentNode.removeChild(oldVNode.el);
            } else {
                //如果是相同的节点则先更新节点的属性
                updateProps(oldVNode, newVNode);
                if (!oldVNode.children) {
                    let children = newVNode.children || [];
                    for (let child of children) {
                        let dom = createElement(child);
                        oldVNode.el.appendChild(dom);
                    }
                } else if (!newVNode.children) {
                    oldVNode.el.innerHTML = "";
                } else if (oldVNode.children && newVNode.children) {
                    updateChildren(oldVNode.el, oldVNode.children, newVNode.children);
                }
            }
        }

    }
}

export function updateProps(oldVNode, newVNode) {
    let oldProps = oldVNode.props;
    let newProps = newVNode.props;

    for (let key in newProps) {
        if (key === 'style') {
            for (let item in newProps.style) {
                oldVNode.el.style[item] = newProps.style[item];
            }
        } else {
            oldVNode.el[key] = newProps[key];
        }
    }

    for (let key in oldProps) {
        if (!newProps[key]) {
            oldVNode.el.removeAttribute(key);
        } else {
            if (key === 'style') {
                let oldStyle = oldProps.style;
                let newStyle = newProps.style;
                updateStyle(oldStyle, newStyle, oldVNode.el);
            }
        }
    }
}

function updateStyle(oldStyle, newStyle, el) {
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style.removeAttribute(key);
        }
    }

    for (let key in newStyle) {
        el.style[key] = newStyle[key];
    }
}