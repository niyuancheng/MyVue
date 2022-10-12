import { isSame } from "./patch";
import { patchVNode } from "./patchVNode";

export function updateChildren(parentNode, oldCh, newCh) {
    //我们需要注意的是diff算法本质上比较的是新旧虚拟节点，改变的是真正的DOM元素
    //新旧指针
    let oldStartIdx = 0,
        oldEndIdx = oldCh.length - 1,
        newStartIdx = 0,
        newEndIdx = newCh.length - 1;
    //新旧节点
    let oldStartVnode = oldCh[0],
        oldEndVnode = oldCh[oldEndIdx],
        newStartVnode = newCh[0],
        newEndVnode = newCh[newEndIdx];

    let map = {}; //进行旧节点上key和下标index之间的映射，也就是缓存策略
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        map[oldCh[i].key] = i;
    }
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        //开始进行四次命中策略
        // 1.旧前和新前对比,命中是同一个节点的话，更新这两个节点
        if (isSame(oldStartVnode, newStartVnode)) {
            // console.log("旧前和新前命中");
            patchVNode(oldStartVnode, newStartVnode); //对于相同的节点调用patchVnode对节点的内部进行最小量更新
            oldStartVnode = oldCh[++oldStartIdx];
            if (!oldStartVnode) oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];//指针向下移
        } else if (isSame(oldEndVnode, newEndVnode)) {
            // console.log("旧后和新后命中");
            patchVNode(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            if (!oldEndVnode) oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSame(oldStartVnode, newEndVnode)) {
            // console.log("旧前和新后命中");
            patchVNode(oldStartVnode, newEndVnode);
            // 意味着此时需要移动旧前指向的节点
            parentNode.insertBefore(oldStartVnode.dom, oldEndVnode.dom.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            if (!oldStartVnode) oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSame(oldEndVnode, newStartVnode)) {
            // console.log("旧后和新前命中");
            patchVNode(oldEndVnode, newStartVnode);

            parentNode.insertBefore(oldEndVnode.dom, oldStartVnode.dom); //将旧后节点插入到旧前的节点之前

            oldEndVnode = oldCh[--oldEndIdx];
            if (!oldEndVnode) oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else { //如果四种情况都没有命中的话，则需要查找newStartVnode对应的在老节点中的下标
            let vnodeInOld = map[newStartVnode.key] || undefined;
            if (vnodeInOld !== undefined) {
                parentNode.insertBefore(oldCh[vnodeInOld].dom, oldCh[oldStartIdx].dom);
                oldCh[vnodeInOld] = undefined;
            } else { //如果查找新节点在老节点中不存在的话则直接创建并且插入到oldStartIdx之前
                parentNode.insertBefore(createElement(newCh[newStartIdx]), oldCh[oldStartIdx].dom);
            }
            newStartVnode = newCh[++newStartIdx];
        }

    }
    //1. 在所有循环都结束后来查看指针的情况，看看还有没有节点遗留在外面的
    if (newStartIdx <= newEndIdx) { //说明有新的节点需要插入到老节点中去
        let pivot = oldCh[oldEndIdx] ? oldCh[oldEndIdx].dom.nextSibling : null;
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            parentNode.insertBefore(createElement(newCh[i]), pivot);
        }
    } else if (oldStartIdx <= oldEndIdx) { //说明还有老节点需要删除
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldCh[i].dom) {
                parentNode.removeChild(oldCh[i].dom);
            }
        }
    }
}
