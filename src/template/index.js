import { genCode } from "./gen"
import { parseHTML } from "./parse"

//该模块用于模板编译功能的实现
export default function compileToFunction(html) {
    //1.生成AST抽象语法树
    let ast = parseHTML(html);
    console.log(ast);
    //2.根据抽象语法树生成JS字符串
    let code = genCode(ast.children[0]);

    let render = new Function(`with(this){return ${code}}`); //通过new Function这种形式形成最终的render函数

    console.log(render);

    return render;
}