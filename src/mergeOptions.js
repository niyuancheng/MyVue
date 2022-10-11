let LIFECYCLE = [ //存放Vue实例的生命周期数组
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destoryed'
]

let strategy = {} //策略数组

strategy['components'] = function(p,c) {
    if(p && c) {   
        
    }
}

LIFECYCLE.forEach(hook=>{ //对于所有的生命周期钩子其具体的更新策略
    strategy[hook] = function(p,c) {
        if(p) {
            if(c) {
                return p.concat(c);
            } else {
                return p;
            }
        } else {
            return [c];
        }
    }
})

export default function mergeOptions(parent,child) {

    const options = {};

    for(let key in parent) {
        mergeFiled(key);
    }
    for(let key in child) {
        if(!parent.hasOwnProperty(key)) mergeFiled(key);
    }

    function mergeFiled(key) { //对于不同的key有不同的合并策略，例如对于key = data时合并需要新的覆盖旧的选项，而对于key = created这种生命周期钩子则需要合并成一个数组
        if(strategy[key]) {
            options[key] = strategy[key](parent[key],child[key])
        } else { //如果对应的key在策略数组中不存在的话则进行默认的合并方式也就是新的覆盖旧的,子覆盖父
            options[key] = child[key] || parent[key];
        }
    }

    return options;
}