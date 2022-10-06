const ELEMENT_TYPE = 1; //元素节点
const TEXT_TYPE = 2; //文本节点
const textRegExp = /\{\{\s*(.+?)\}\}/g //匹配mustache模板字符串
function genText(text) { //用于生成mustache类型的模板字符串
    if(textRegExp.test(text)) {
        let match;
        let tokens = [];
        textRegExp.lastIndex = 0;
        let lastIndex = textRegExp.lastIndex;
        while(match = textRegExp.exec(text)) {
            let index = match.index;
            if(index>lastIndex) tokens.push(`${JSON.stringify(text.slice(lastIndex,index))}`);
            tokens.push(`_s(${match[1]})`);
            lastIndex = textRegExp.lastIndex;
        }
        tokens.push(`${JSON.stringify(text.slice(lastIndex))}`);
        console.log(tokens);
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
        if (attr.key !== "style") { //如果该属性值不为style的话
            return `${attr.key}:${JSON.stringify(attr.value)}`;
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
    }).join(",");
    res += `}`;
    return res;
}

export function genCode(node) { //根据AST语法树拼接JS字符串
    return `_c(${JSON.stringify(node.tagName)}${node.attrs.length === 0 ? ",undefined" : "," + genProps(node.attrs)}${node.children.length > 0 ? "," + genChildren(node.children) : ""})`
}