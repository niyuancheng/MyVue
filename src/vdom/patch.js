function appendAttrs(vnode) {
    for (let key in vnode.props) {
        if (key === 'style') {
            for (let item in vnode.props.style) {
                vnode.el.style[item] = vnode.props.style[item];
            }
        } else {
            vnode.el.setAttribute(key, vnode.props[key]);
        }
    }
}
function createElement(vnode) { //根据虚拟节点vnode创建对应的真实DOM元素
    if (vnode.tag) {
        vnode.el = document.createElement(vnode.tag);
        appendAttrs(vnode);
        if (vnode.children) {
            vnode.children.forEach(child => {
                vnode.el.appendChild(createElement(child));
            })
        }
    } else {
        vnode.el = document.createTextNode(vnode.text);
    }
    return vnode.el;

}

export function patch(oldVNode, newVNode,vm) {
    if (oldVNode.nodeType === 1) { //如果是真实的DOM元素的话则进行初次渲染
        let dom = createElement(newVNode);
        oldVNode.parentNode.insertBefore(dom, oldVNode.nextSibling);
        oldVNode.parentNode.removeChild(oldVNode);
    } else { //如果不是则需要进入diff算法环节比较新旧虚拟节点的差异

        /*
                diff算法
        */


        console.log("开始进行diff算法");
    }

    oldVNode.el = newVNode.el;
    vm._vnode = newVNode;
    vm._dom = oldVNode.el;
}