export function callHooks(vm,hooks) {
    if(vm.$options[hooks]) {
        vm.$options[hooks].forEach(hook=>{
            hook.call(vm)
        });
    }
}