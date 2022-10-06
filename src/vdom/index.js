function vnode(vm,tag,key,props,children,text) { //该函数用于生成虚拟dom节点
    return {
        vm,
        tag,
        key,
        props,
        children,
        text
    }
}


export function createElementVNode(vm,tag,props,children) { //创建元素类型的虚拟节点
    if(!props) props = {};
    let key = props.key;
    if(props.key) delete props.key;
    //if(children && children.length === 1) children = [children];
    return vnode(vm,tag,key,props,children,undefined);
}

export function createTextVNode(vm,text) { //创建文本类型的节点
    return vnode(vm,undefined,undefined,undefined,undefined,text);
}