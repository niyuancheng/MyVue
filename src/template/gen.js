const ELEMENT_TYPE = 1; //元素节点
const TEXT_TYPE = 2; //文本节点
const textRegExp = /\{\{\s*(.+?)\}\}/g //匹配mustache模板字符串
const vBindRegExp = /^v-bind|:([^\s]+)/
const vOnRegEXp = /^v-on|@([^\s]+)/

function include(attrs, directives) {
    if (typeof directives === 'string') {
        for (let attr of attrs) {
            if (attr.key === directives) return true;
        }
    } else if (directives instanceof RegExp) {
        for (let attr of attrs) {
            if (directives.test(attr.key)) return true;
        }
    }

    return false;
}


function genText(text) { //用于生成mustache类型的模板字符串
    if (textRegExp.test(text)) {
        let match;
        let tokens = [];
        textRegExp.lastIndex = 0;
        let lastIndex = textRegExp.lastIndex;
        while (match = textRegExp.exec(text)) {
            let index = match.index;
            if (index > lastIndex) tokens.push(`${JSON.stringify(text.slice(lastIndex, index))}`);
            tokens.push(`_s(${match[1]})`);
            lastIndex = textRegExp.lastIndex;
        }
        tokens.push(`${JSON.stringify(text.slice(lastIndex))}`);
        return `_v(${tokens.join("+")})`
    } else {
        return `_v(${JSON.stringify(text)})`
    }
}

function genChildren(children) { //生成子节点对应的字符串
    let res = ``;
    res += `[`;

    res += children.map(child => {
        //首先判断节点类型
        if (child.type === ELEMENT_TYPE) { //元素节点的话
            return `${genCode(child)}`;
        } else if (child.type === TEXT_TYPE) { //文本节点的话
            return `${genText(child.text)}`;
        }
    }).join(",");
    res += ']';
    return res;
}

function genProps(attrs) {
    let res = `{`;
    res += attrs.map(attr => {
        if (vBindRegExp.test(attr.key)) {
            let res = attr.key.match(vBindRegExp);
            let target = res[1];
            return `${JSON.stringify(target)}:${attr.value}`;
        } else if (vOnRegEXp.test(attr.key)) {
            let res = attr.key.match(vOnRegEXp);
            let target = res[1];
            let func = new Function(`${attr.value}.call(this)`);
            return `${JSON.stringify(target)}:${func}`
        } else {
            if (attr.key !== "style") { //如果该属性值不为style的话

                return `${JSON.stringify(attr.key)}:${JSON.stringify(attr.value)}`;
            } else {
                let str = ``;
                str += `style:{`;
                str += attr.value.split(";").map(obj => {
                    let [key, value] = obj.split(":");
                    return `${key}:${JSON.stringify(value)}`;
                }).join(",");
                str += `}`;
                return str;
            }
        }


    }).join(",");
    res += `}`;
    return res;
}

function genCommon(node) {
    return `_c(${JSON.stringify(node.tagName)}${node.attrs.length === 0 ? ",undefined" : "," + genProps(node.attrs)}${node.children.length > 0 ? "," + genChildren(node.children) : ""})`
}

function genVFor(node) {

    let vFor = null;
    let pos = 0;

    for (let index in node.attrs) {
        let attr = node.attrs[index];
        if (attr.key === "v-for") {
            vFor = attr.value;
            pos = index;
            break;
        }
    }

    let [key, value] = vFor.split(/\s+in\s+/);
    node.attrs.splice(pos, 1);

    if (/\(.+\)/.test(key)) {
        let res = key.match(/\(\s*([^\s]+)\s*,\s*([^\s]+)\s*\)/);
        let index = res[1], item = res[2];
        return `_l(${value},function(${index},${item}){
            return ${genCode(node)}
        })`
    } else {
        return `_l(${value},function(${key}){
            return ${genCode(node)}
        })`
    }
}

function genVIf(node) {
    let vIf = null, pos = 0;
    for (let index in node.attrs) {
        let attr = node.attrs[index];
        if (attr.key === 'v-if') {
            vIf = attr.value;
            pos = index;
            break;
        }
    }

    node.attrs.splice(pos, 1);
    return `${vIf} ? ${genCode(node)} : _c()`;
}

export function genCode(node) { //根据AST语法树拼接JS字符串
    if (include(node.attrs, "v-for")) {
        return genVFor(node);
    }
    if (include(node.attrs, "v-if")) {
        return genVIf(node);
    }
    return genCommon(node)
}