import Dep from "./Dep";
import {nextTick} from '../nextTick'
let id = 0;

class Watcher {
    constructor(vm,fn) {
        this.id = id++;
        this.getter = fn; //fn为渲染视图的函数
        this.deps = []; //deps数组中存储着该观察者订阅了多少了变量对象
        this.get();
    }

    get() {
        Dep.target = this;
        this.getter();
        Dep.target = null;
    }

    update() { //当watcher依赖的属性发生变化的时候执行watcher中的update方法
        queueWatcher(this);    
    }

    run() { //启动watcher的执行
        this.get();
    }
}

let queue = [];
let has = {};
let pending = false;

function flushScheduleQueue() {
    let coppyQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    coppyQueue.forEach(watcher=>{
        watcher.run();
    })
}

function queueWatcher(watcher) {
    const id = watcher.id;
    if(!has[id]) {
        queue.push(watcher);
        has[id] = true;
        if(!pending) {
            pending = true;
            nextTick(flushScheduleQueue);
        }
    }
}

export default Watcher;