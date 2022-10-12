function vnode(vm,tag,key,props,children,text,type) { //该函数用于生成虚拟dom节点
    return {
        vm,
        tag,
        key,
        props,
        children,
        text,
        type
    }
}


export function createElementVNode(vm,tag,props,children) { //创建元素类型的虚拟节点
    if(!props) props = {};
    let key = props.key;
    if(props.key) delete props.key;
    return vnode(vm,tag,key,props,children,undefined,"tag");
}

export function createTextVNode(vm,text) { //创建文本类型的节点
    return vnode(vm,undefined,undefined,undefined,undefined,text,"text");
}

export function createComponentVNode(vm,tag,props,children) { //创建组件类型的虚拟节点
    return vnode(vm,tag,undefined,props,children,undefined,"component");
}