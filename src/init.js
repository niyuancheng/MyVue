import observe from "./data/index";
import Watcher from "./data/watcher";
import mergeOptions from "./globalAPI";
import { nextTick } from "./nextTick";
import compileToFunction from "./template/index.js";
import { callHooks } from './hooks'
import getFuncName from './utils/getFuncName'
import Dep from "./data/dep";
//该函数用于对Vue的状态进行初始化
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this;
        vm.$options = mergeOptions(Vue.options, options);
        callHooks(vm, 'beforeCreate')
        initState(vm); //对options中的所有配置选项进行初始化，包括data.props,method,watch,computed,direactives等
        callHooks(vm, 'created');
        initTemplate(vm); //在传入的配置选项全部初始化完成后开始执行模板的编译生成虚拟DOM
    }

    Vue.prototype.$mount = function (el) { //$mount函数的作用就是开始模板编译生成render函数的过程并且将render生成的虚拟DOM渲染成真实的DOM并且挂载到DOM树上
        let vm = this;
        let opts = vm.$options;
        if (!opts.render) { //如果没有render函数的话则需要进行模板编译
            let template;
            if (opts.template) { //template的优先级大于el
                template = opts.template;
            } else {
                template = document.querySelector(el).outerHTML;
            }
            opts.render = compileToFunction(template); //compileToFunction开始进入模板编译阶段
        } else { //如果有render函数的话则直接进行调用，无需经过模板编译的过程
            //此处直接跳过
        }
        mountComponent(el, vm); //生成并且渲染虚拟DOM上树
    }

    Vue.prototype.$nextTick = nextTick;
}

function initData(vm) {
    observe(vm.$options.data);
    let opts = vm.$options;
    vm._data = opts.data; //数据劫持
    for (let key in opts.data) {
        //直接将data中的属性绑定到vm实例上，进行了一次数据代理
        Object.defineProperty(vm, key, {
            get() {
                return opts.data[key];
            },
            set(val) {
                opts.data[key] = val;
            }
        })
    }
}


function getComputedProperty(context, key) {
    return function () {
        let watcher = context._computedWatchers[key]
        if (watcher.dirty) {
            watcher.value = watcher.evaluate(context);
            if(Dep.target) {
                watcher.depend();
            }
        }
        return watcher.value;
    }
}

function defineComputedProperty(vm, key, computed) {
    let getter = typeof computed === 'function' ? computed : computed.get;
    let setter = typeof computed === 'function' ? (() => { }) : (computed.set || (() => { }));
    let name = typeof computed === 'function' ? getFuncName(computed) : computed;

    Object.defineProperty(vm, name, {
        get: getComputedProperty(vm, key),
        set: setter
    });
}

function initComputed(vm) {
    let computeds = vm.$options.computed;
    let watchers = vm._computedWatchers = {};
    for (let key in computeds) {
        let getter = typeof computeds[key] === 'function' ? computeds[key] : computeds[key].get;
        console.log(getter)
        watchers[key] = new Watcher(vm, getter, { lazy: true });
        defineComputedProperty(vm, key, computeds[key]);
    }
}

function initState(vm) {
    let opts = vm.$options;
    if (opts.data) {
        initData(vm); //初始化数据
    }
    if (opts.computed) {
        initComputed(vm); //初始化计算属性
    }
}

function initTemplate(vm) {
    if (vm.$options.el) { //如果options中包含有el属性则自动调用$mount方法进行模板编译过程
        vm.$mount(vm.$options.el);
    }
}

function mountComponent(el, vm) {
    let updateComponet = () => { //模板的重新编译或者初次编译
        let dom = document.querySelector(el);
        // if(Vue._vnode) {
        //     dom = Vue._vnode; 
        // } else {
        //     dom = document.querySelector(el);
        // }
        console.log("视图开始渲染")
        vm._update(dom);
    }
    let watcher = new Watcher(vm, updateComponet); //watcher观察者，通常一个Vue实例或者一个Vue组件对应一个Watcher实例，也就是观察者对象

}