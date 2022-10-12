import Dep from "./dep";
import { nextTick } from '../nextTick'
let id = 0;

let stack = [];
function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
}

function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
}

class Watcher {
    constructor(vm, fn, options,cb) {
        this.vm = vm;
        this.id = id++;
        this.getter = fn; //fn很大概率为渲染视图的函数
        this.deps = []; //deps数组中存储着该观察者订阅了多少了变量对象
        this.cb = cb || (()=>{});
        if(options) {
            this.lazy = options.lazy || false;
            this.dirty = this.lazy;
            this.user = options.user;
        }
        
        if(!this.dirty) this.value = this.get();
    }

    evaluate() {
        this.dirty = false;
        return this.get();
    }

    depend() {
        this.deps.forEach(dep=>{
            dep.depend();
        })
    }

    get() {
        pushTarget(this);
        let value = this.getter.call(this.vm);
        popTarget();
        return value;
    }

    update() { //当watcher依赖的属性发生变化的时候执行watcher中的update方法
        if(this.user) { 
            let oldVal = this.value;
            let newVal = this.get();
            this.cb.call(this.vm,newVal,oldVal);
        } else {
            if(this.lazy) {
                this.dirty = true;
            } else {
                queueWatcher(this);
            }
        }
    }

    run() { //启动watcher的执行
        this.get();
    }
}

let queue = [];
let has = {};
let pending = false;

function flushScheduleQueue() { //实现视图的异步更新
    let coppyQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    coppyQueue.forEach(watcher => {
        watcher.run();
    })
}

function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
            pending = true;
            nextTick(flushScheduleQueue);
        }
    }
}

export default Watcher;