//该模块用于解析虚拟DOM中的指令

let directives = /(^v-.+)|(^@.+)|(^:.+)/g; //用于匹配属性的正则表达式

function isDirective(key) { //判断对应的键是否为指令
    return directives.test(key);
}

function genFunc(code) {
    return new Function(`with(this){return ${code}}`);
}

function parseDirectives(key, vnode) {
    directives.lastIndex = 0;
    if (isDirective(key)) {
        if (/^v-([^:]+)(.*)/.test(key)) {
            let res = key.match(/^v-([^:]+):?(.*)/);
            let direc = res[1], target = res[2];
            switch (direc) {
                case "bind":
                    vnode.props[target] = genFunc(vnode.props[key]).call(vnode.vm);
                    break;
                case "on":
                    let funcName = vnode.props[key]; //保存指令中的函数名
                    vnode.props[target] = function() {
                        console.log(funcName)
                        vnode.vm[funcName].call(vnode.vm);
                    }
                    break;
                case "for":
                    
                case "if":

                case "show":


            }
        } else if (/^@(.+)/.test(key)) {
            let res = key.match(/^@(.+)/);
            let target = res[1];
            let funcName = vnode.props[key]
            console.log(target)
            vnode.props[target] = function() {
                vnode.vm[funcName].call(vnode.vm);
            }
        } else if (/^:(.+)/.test(key)) {
            let res = key.match(/^:(.+)/);
            let target = res[1];
            vnode.props[target] = genFunc(vnode.props[key]).call(vnode.vm);
        }
        delete vnode.props[key];
    } 
}

export function parseProps(vnode) {
    let props = vnode.props || [];
    for (let key in props) {
        
        parseDirectives(key, vnode);
    }

    if (vnode.children) {
        vnode.children.forEach(child => {
            parseProps(child);
        })
    }
}