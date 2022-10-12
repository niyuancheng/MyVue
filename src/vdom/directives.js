//该模块用于解析虚拟DOM中的指令

let directives = /^v-|^@|^:.*/g; //用于匹配属性的正则表达式

function isDirective(key) {
    return directives.test(key);
}

function genFunc(code) {
    return new Function(`with(this){return ${code}}`);
}

function parseDirectives(key, vnode) {
    if (isDirective(key)) {
        if (/^v-([^:]+)(.*)/.test(key)) {
            let res = key.match(/^v-([^:]+):?(.*)/);
            let direc = res[1];
            switch (direc) {
                case "bind":
                    let target = res[2];
                    vnode.props[target] = genFunc(vnode.props[key]).call(vnode.vm);
                    break;
                case "on":
                case "for":
                case "if":
                case "show":
            }
        } else if (/^@/.test(key)) {

        } else if (/^:/.test(key)) {

        }
        delete vnode.props[key];
    } else {
        return ;
    }

}

export function parseProps(vnode) {
    let props = vnode.props || [];
    for(let key in props) {
        parseDirectives(key,vnode);
    }

    if(vnode.children) {
        vnode.children.forEach(child=>{
            parseProps(child);
        })
    }
}