const cname = `[a-zA-Z_][\\-\\.a-zA-Z0-9_]*` //标签可能出现的所有标签名
const qnameCapture = `((?:${cname}:)?${cname})` //考虑到带有命名空间的标签出现的情况因此在此处使用(?:${cname}:)?表明括号中的捕获重复0-1次
const startTagOpen = new RegExp(`^<${qnameCapture}`) //开始标签的前面open部分，也就是 < 往后的标签名部分
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const startTagClosed = /^\s*(\/)?>/ //开始标签的结束部分，(\/)?是防止该标签是自闭合标签 ，例如<input xx />
const attribute = /^\s*([^\s'"<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"|'([^']*)'|([^\s'"<>\/=]+)))?/ //匹配标签中的属性，格式为key= value

//parseHtml用于解析模板生成AST抽象语法树
export function parseHTML(html) {
    const ELEMENT_TYPE = 1; //元素节点
    const TEXT_TYPE = 2; //文本节点
    const ROOT_TYPE = 3;
    const root = {
        children:[],
        type:ROOT_TYPE,
        parent:null,
        tagName:"Root"
    }
    const stack = [root];
    let textEnd;
    function advance(n) {
        html = html.slice(n);
    }

    function parseStartTagOpen() {
        let tagName = html.match(startTagOpen)[1];
        let resName = html.match(startTagOpen)[0];

        let tag = {
            tagName,
            parent: stack[stack.length - 1] || null,
            children: [],
            attrs: [],
            type:ELEMENT_TYPE
        }
        stack[stack.length-1].children.push(tag);
        stack.push(tag);
        
        advance(resName.length);
    }
    function parseAttrs() { //解析标签中的所有属性
        let currentNode = stack[stack.length - 1];
        while (!startTagClosed.test(html)) {
            let resArry = html.match(attribute);
            let attr = {
                key: resArry[1],
                value: resArry[3] || resArry[4] || resArry[5] || true
            }
            currentNode.attrs.push(attr);
            advance(html.match(attribute)[0].length);
        }
    }

    function parseStartTagClosed() { //处理开始标签的末尾/结束部分
        let resName = html.match(startTagClosed)[0];
        advance(resName.length);
    }

    function parseEndTag() {
        let resName = html.match(endTag)[0];
        stack.pop();
        advance(resName.length);
    }

    function parseText() {
        let text = html.substr(0, textEnd);
        if(/[^\s]+/.test(text)) stack[stack.length-1].children.push({
            text,
            type:TEXT_TYPE,
            parent:stack[stack.length-1] || null
        })
        advance(text.length);
    }

    while (html.length) {
        textEnd = html.indexOf("<");
        if (textEnd === 0) {
            if (!endTag.test(html)) { //如果该<字符是开始标签上的字符时
                parseStartTagOpen();
                parseAttrs();
                parseStartTagClosed();
            } else {
                parseEndTag();
            }
        } else {
            parseText();
        }
    }

    return root;

}