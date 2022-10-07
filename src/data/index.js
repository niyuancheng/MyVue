//此模块用于实现数据的响应式    

import arrMethods from "./array";
import Dep from "./dep";

function observe(obj) { //observe函数的中作用就是为了将obj对象中的属性都变为访问器属性
    let ob;
    if(typeof obj !== "object") return;
    if (obj.__ob__) { // 该对象有__ob__则不进行递归
        ob = obj.__ob__; //给对象添加__ob__表示该对象被观察了，方便程序员的调试
    } else {
        ob = new Observer(obj); //通过new Observer类来标记该对象，也就是给obj上添加__ob__属性来实现观测状态的标记，防止循环引用
    }
    return ob;
}

class Observer {
    constructor(obj) {
        obj.__ob__ = this;
        this.dep = new Dep(); //dep可以看成是依赖收集器
        Object.defineProperty(obj,"__ob__",{
            enumerable:false,
            writable:false,
            configurable:false
        })
        if(Array.isArray(obj)) {
            this.walkArray(obj)
        } else {
            this.walk(obj)
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(key=>{
            defineReactive(obj,key)
        })
    }

    walkArray(obj) {
        Object.setPrototypeOf(obj,arrMethods);
        for(let el of obj) {
            observe(el);
        }
    }
}

function dependArray(arr) { //递归地为每一个数组都添加dep收集器属性，一旦当发生数组的push,pop等改变原数组的方法时触发watcher的调用也就是模板的重新编译
    if(Array.isArray(arr)) {
        arr.__ob__.dep.depend();
        for(let el of arr) dependArray(el)
    }
}

//递归地定义响应式数据
function defineReactive(obj,key,data) {
    data = data || obj[key];
    let dep = new Dep(); //每一个属性都对应一个Dep的实例
    observe(obj[key]); //先将obj[key]对应的属性值也变成响应式的
    Object.defineProperty(obj,key,{
        get() { //get时收集依赖
            console.log(`触发了属性${key}的get方法`)
            if(Dep.target) {
                dep.depend();
                if(Array.isArray(data)) {
                    dependArray(data);
                }
            }
            return data;
        },
        set(newVal) { //set时触发依赖
            if(newVal !== data) {
                console.log(`属性值${key}发生了变化`)
                observe(newVal); //先将传入的newVal也变成访问器属性
                data = newVal;
                dep.notify();
            }
        }
    })
}

export default observe;