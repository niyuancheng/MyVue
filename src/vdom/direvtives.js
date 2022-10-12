function genFunc(code) {
    return new Function(`with(this){return ${code}}`);
}

export function parseDirectives(key, vnode) {
    if (/^v-([^:]+)(.*)/.test(key)) {
        let res = key.match(/^v-([^:]+):?(.*)/);
        let direc = res[1];
        switch (direc) {
            case "bind":
                let target = res[2];
                vnode.el.setAttribute(target,genFunc(vnode.props[key]).call(vnode.vm));
                break;
            case "on":
            case "for":
            case "if":
            case "show":
        }
    } else if (/^@/.test(key)) {

    } else if (/^:/.test(key)) {

    }
}