import babel from 'rollup-plugin-babel'

export default {
    input:"./src/index.js",
    output:{
        file:"./dist/vue.js",
        name:"Vue",
        format:"umd",//指定打包文件的格式
        sourcemap:"true"
    },
    plugins:[
        babel({
            exclude:"node_modules/**" //忽略对node_modules下的文件的打包
        })
    ]
}