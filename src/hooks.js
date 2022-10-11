export function callHooks(vm,hooks) { //触发特定的生命周期钩子函数
    if(vm.$options[hooks]) {
        vm.$options[hooks].forEach(hook=>{
            hook.call(vm)
        });
    }
}