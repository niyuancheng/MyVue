import observe from "./index";

let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'sort'
]

var arrMethods = {}; //arrMethods用于拦截实例数组调用对应的方法

methods.forEach(el=>{
    let method = Array.prototype[el]; //将数组原型上的真正方法保存下来
    arrMethods[el] = function() {
        console.log(`触发了数组的${method}方法`)
        switch(el) { //判断具体的调用方法
            case "push":
            case "unshift":
                Array.from(arguments).forEach(item=>{
                    observe(item);
                })
                break;
            case "pop":
            case "shift":
                break;
            case "splice":
                Array.from(arguments).slice(2).forEach(item=>{
                    observe(item);
                })
                break;
            case 'sort':
                
                break;
        }
        this.__ob__.dep.notify();
        return method.apply(this,arguments);
    }
})

export default arrMethods