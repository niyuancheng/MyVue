(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var LIFECYCLE = [//存放Vue实例的生命周期数组
    'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destoryed'];
    var strategy = {}; //策略数组

    LIFECYCLE.forEach(function (hook) {
      //对于所有的生命周期钩子其具体的更新策略
      strategy[hook] = function (p, c) {
        if (p) {
          if (c) {
            return p.concat(c);
          } else {
            return p;
          }
        } else {
          return [c];
        }
      };
    });
    function mergeOptions(parent, child) {
      var options = {};

      for (var key in parent) {
        mergeFiled(key);
      }

      for (var _key in child) {
        if (!parent.hasOwnProperty(_key)) mergeFiled(_key);
      }

      function mergeFiled(key) {
        //对于不同的key有不同的合并策略，例如对于key = data时合并需要新的覆盖旧的选项，而对于key = created这种生命周期钩子则需要合并成一个数组
        if (strategy[key]) {
          options[key] = strategy[key](parent[key], child[key]);
        } else {
          //如果对应的key在策略数组中不存在的话则进行默认的合并方式也就是新的覆盖旧的,子覆盖父
          options[key] = child[key] || parent[key];
        }
      }

      return options;
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;

          var F = function () {};

          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = it.call(o);
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    var methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort'];
    var arrMethods = {}; //arrMethods用于拦截实例数组调用对应的方法

    methods.forEach(function (el) {
      var method = Array.prototype[el]; //将数组原型上的真正方法保存下来

      arrMethods[el] = function () {
        console.log("\u89E6\u53D1\u4E86\u6570\u7EC4\u7684".concat(method, "\u65B9\u6CD5"));

        switch (el) {
          //判断具体的调用方法
          case "push":
          case "unshift":
            Array.from(arguments).forEach(function (item) {
              observe(item);
            });
            break;

          case "pop":
          case "shift":
            break;

          case "splice":
            Array.from(arguments).slice(2).forEach(function (item) {
              observe(item);
            });
            break;
        }

        this.__ob__.dep.notify();

        return method.apply(this, arguments);
      };
    });

    var id$1 = 0;

    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);

        this.id = id$1++; //id唯一标识一个watcher，也就是说每一个watcher都有一个独有的id号

        this.subs = []; //存储着dep的监听者也就是观察者，当Dep实例对应的属性发生改变时，对应subs中存储的观察者就会触发调用
      }

      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          //get时添加依赖
          if (!this.subs.includes(Dep.target)) {
            this.subs.push(Dep.target);

            if (!Dep.target.deps.includes(this)) {
              Dep.target.deps.push(this);
            }
          }
        }
      }, {
        key: "notify",
        value: function notify() {
          //set时触发依赖
          this.subs.forEach(function (watcher) {
            watcher.update();
          });
        }
      }]);

      return Dep;
    }();

    function observe(obj) {
      //observe函数的中作用就是为了将obj对象中的属性都变为访问器属性
      var ob;
      if (_typeof(obj) !== "object") return;

      if (obj.__ob__) {
        // 该对象有__ob__则不进行递归
        ob = obj.__ob__; //给对象添加__ob__表示该对象被观察了，方便程序员的调试
      } else {
        ob = new Observer(obj); //通过new Observer类来标记该对象，也就是给obj上添加__ob__属性来实现观测状态的标记，防止循环引用
      }

      return ob;
    }

    var Observer = /*#__PURE__*/function () {
      function Observer(obj) {
        _classCallCheck(this, Observer);

        obj.__ob__ = this;
        this.dep = new Dep(); //dep可以看成是依赖收集器

        Object.defineProperty(obj, "__ob__", {
          enumerable: false,
          writable: false,
          configurable: false
        });

        if (Array.isArray(obj)) {
          this.walkArray(obj);
        } else {
          this.walk(obj);
        }
      }

      _createClass(Observer, [{
        key: "walk",
        value: function walk(obj) {
          Object.keys(obj).forEach(function (key) {
            defineReactive(obj, key);
          });
        }
      }, {
        key: "walkArray",
        value: function walkArray(obj) {
          Object.setPrototypeOf(obj, arrMethods);

          var _iterator = _createForOfIteratorHelper(obj),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var el = _step.value;
              observe(el);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }]);

      return Observer;
    }();

    function dependArray(arr) {
      //递归地为每一个数组都添加dep收集器属性，一旦当发生数组的push,pop等改变原数组的方法时触发watcher的调用也就是模板的重新编译
      if (Array.isArray(arr)) {
        arr.__ob__.dep.depend();

        var _iterator2 = _createForOfIteratorHelper(arr),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var el = _step2.value;
            dependArray(el);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } //递归地定义响应式数据


    function defineReactive(obj, key, data) {
      data = data || obj[key];
      var dep = new Dep(); //每一个属性都对应一个Dep的实例

      observe(obj[key]); //先将obj[key]对应的属性值也变成响应式的

      Object.defineProperty(obj, key, {
        get: function get() {
          //get时收集依赖
          console.log("\u89E6\u53D1\u4E86\u5C5E\u6027".concat(key, "\u7684get\u65B9\u6CD5"));

          if (Dep.target) {
            dep.depend();

            if (Array.isArray(data)) {
              dependArray(data);
            }
          }

          return data;
        },
        set: function set(newVal) {
          //set时触发依赖
          if (newVal !== data) {
            console.log("\u5C5E\u6027\u503C".concat(key, "\u53D1\u751F\u4E86\u53D8\u5316"));
            observe(newVal); //先将传入的newVal也变成访问器属性

            data = newVal;
            dep.notify();
          }
        }
      });
    }

    function nextTick(fn) {
      Promise.resolve().then(function () {
        return fn();
      });
    }

    var id = 0;
    var stack = [];

    function pushTarget(watcher) {
      stack.push(watcher);
      Dep.target = watcher;
    }

    function popTarget() {
      stack.pop();
      Dep.target = stack[stack.length - 1];
    }

    var Watcher = /*#__PURE__*/function () {
      function Watcher(vm, fn, options, cb) {
        _classCallCheck(this, Watcher);

        this.vm = vm;
        this.id = id++;
        this.getter = fn; //fn很大概率为渲染视图的函数

        this.deps = []; //deps数组中存储着该观察者订阅了多少了变量对象

        this.cb = cb || function () {};

        if (options) {
          this.lazy = options.lazy || false;
          this.dirty = this.lazy;
          this.user = options.user;
        }

        if (!this.dirty) this.value = this.get();
      }

      _createClass(Watcher, [{
        key: "evaluate",
        value: function evaluate() {
          this.dirty = false;
          return this.get();
        }
      }, {
        key: "depend",
        value: function depend() {
          this.deps.forEach(function (dep) {
            dep.depend();
          });
        }
      }, {
        key: "get",
        value: function get() {
          pushTarget(this);
          var value = this.getter.call(this.vm);
          popTarget();
          return value;
        }
      }, {
        key: "update",
        value: function update() {
          //当watcher依赖的属性发生变化的时候执行watcher中的update方法
          if (this.user) {
            var oldVal = this.value;
            var newVal = this.get();
            this.cb.call(this.vm, newVal, oldVal);
          } else {
            if (this.lazy) {
              this.dirty = true;
            } else {
              queueWatcher(this);
            }
          }
        }
      }, {
        key: "run",
        value: function run() {
          //启动watcher的执行
          this.get();
        }
      }]);

      return Watcher;
    }();

    var queue = [];
    var has = {};
    var pending = false;

    function flushScheduleQueue() {
      //实现视图的异步更新
      var coppyQueue = queue.slice(0);
      queue = [];
      has = {};
      pending = false;
      coppyQueue.forEach(function (watcher) {
        watcher.run();
      });
    }

    function queueWatcher(watcher) {
      var id = watcher.id;

      if (!has[id]) {
        queue.push(watcher);
        has[id] = true;

        if (!pending) {
          pending = true;
          nextTick(flushScheduleQueue);
        }
      }
    }

    var ELEMENT_TYPE = 1; //元素节点

    var TEXT_TYPE = 2; //文本节点

    var textRegExp = /\{\{\s*(.+?)\}\}/g; //匹配mustache模板字符串

    function genText(text) {
      //用于生成mustache类型的模板字符串
      if (textRegExp.test(text)) {
        var match;
        var tokens = [];
        textRegExp.lastIndex = 0;
        var lastIndex = textRegExp.lastIndex;

        while (match = textRegExp.exec(text)) {
          var index = match.index;
          if (index > lastIndex) tokens.push("".concat(JSON.stringify(text.slice(lastIndex, index))));
          tokens.push("_s(".concat(match[1], ")"));
          lastIndex = textRegExp.lastIndex;
        }

        tokens.push("".concat(JSON.stringify(text.slice(lastIndex))));
        return "_v(".concat(tokens.join("+"), ")");
      } else {
        return "_v(".concat(JSON.stringify(text), ")");
      }
    }

    function genChildren(children) {
      //生成子节点对应的字符串
      var res = "";
      res += "[";
      res += children.map(function (child) {
        //首先判断节点类型
        if (child.type === ELEMENT_TYPE) {
          //元素节点的话
          return "".concat(genCode(child));
        } else if (child.type === TEXT_TYPE) {
          //文本节点的话
          return "".concat(genText(child.text));
        }
      }).join(",");
      res += ']';
      return res;
    }

    function genProps(attrs) {
      var res = "{";
      res += attrs.map(function (attr) {
        if (attr.key !== "style") {
          //如果该属性值不为style的话
          return "".concat(attr.key, ":").concat(JSON.stringify(attr.value));
        } else {
          var str = "";
          str += "style:{";
          str += attr.value.split(";").map(function (obj) {
            var _obj$split = obj.split(":"),
                _obj$split2 = _slicedToArray(_obj$split, 2),
                key = _obj$split2[0],
                value = _obj$split2[1];

            return "".concat(key, ":").concat(JSON.stringify(value));
          }).join(",");
          str += "}";
          return str;
        }
      }).join(",");
      res += "}";
      return res;
    }

    function genCode(node) {
      //根据AST语法树拼接JS字符串
      return "_c(".concat(JSON.stringify(node.tagName)).concat(node.attrs.length === 0 ? ",undefined" : "," + genProps(node.attrs)).concat(node.children.length > 0 ? "," + genChildren(node.children) : "", ")");
    }

    var cname = "[a-zA-Z_][\\-\\.a-zA-Z0-9_]*"; //标签可能出现的所有标签名

    var qnameCapture = "((?:".concat(cname, ":)?").concat(cname, ")"); //考虑到带有命名空间的标签出现的情况因此在此处使用(?:${cname}:)?表明括号中的捕获重复0-1次

    var startTagOpen = new RegExp("^<".concat(qnameCapture)); //开始标签的前面open部分，也就是 < 往后的标签名部分

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
    var startTagClosed = /^\s*(\/)?>/; //开始标签的结束部分，(\/)?是防止该标签是自闭合标签 ，例如<input xx />

    var attribute = /^\s*([^\s'"<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"|'([^']*)'|([^\s'"<>\/=]+)))?/; //匹配标签中的属性，格式为key= value
    //parseHtml用于解析模板生成AST抽象语法树

    function parseHTML(html) {
      var ELEMENT_TYPE = 1; //元素节点

      var TEXT_TYPE = 2; //文本节点

      var ROOT_TYPE = 3;
      var root = {
        children: [],
        type: ROOT_TYPE,
        parent: null,
        tagName: "Root"
      };
      var stack = [root];
      var textEnd;

      function advance(n) {
        html = html.slice(n);
      }

      function parseStartTagOpen() {
        var tagName = html.match(startTagOpen)[1];
        var resName = html.match(startTagOpen)[0];
        var tag = {
          tagName: tagName,
          parent: stack[stack.length - 1] || null,
          children: [],
          attrs: [],
          type: ELEMENT_TYPE
        };
        stack[stack.length - 1].children.push(tag);
        stack.push(tag);
        advance(resName.length);
      }

      function parseAttrs() {
        //解析标签中的所有属性
        var currentNode = stack[stack.length - 1];

        while (!startTagClosed.test(html)) {
          var resArry = html.match(attribute);
          var attr = {
            key: resArry[1],
            value: resArry[3] || resArry[4] || resArry[5] || true
          };
          currentNode.attrs.push(attr);
          advance(html.match(attribute)[0].length);
        }
      }

      function parseStartTagClosed() {
        //处理开始标签的末尾/结束部分
        var resName = html.match(startTagClosed)[0];
        advance(resName.length);
      }

      function parseEndTag() {
        var resName = html.match(endTag)[0];
        stack.pop();
        advance(resName.length);
      }

      function parseText() {
        var text = html.substr(0, textEnd);
        if (/[^\s]+/.test(text)) stack[stack.length - 1].children.push({
          text: text,
          type: TEXT_TYPE,
          parent: stack[stack.length - 1] || null
        });
        advance(text.length);
      }

      while (html.length) {
        textEnd = html.indexOf("<");

        if (textEnd === 0) {
          if (!endTag.test(html)) {
            //如果该<字符是开始标签上的字符时
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

    function compileToFunction(html) {
      //1.生成AST抽象语法树
      var ast = parseHTML(html);
      console.log(ast); //2.根据抽象语法树生成JS字符串

      var code = genCode(ast.children[0]);
      var render = new Function("with(this){return ".concat(code, "}")); //通过new Function这种形式形成最终的render函数

      console.log(render);
      return render;
    }

    function callHooks(vm, hooks) {
      if (vm.$options[hooks]) {
        vm.$options[hooks].forEach(function (hook) {
          hook.call(vm);
        });
      }
    }

    function getFunctionName(fun) {
      if (fun.name !== undefined) return fun.name;
      var ret = fun.toString();
      ret = ret.substr('function '.length);
      ret = ret.substr(0, ret.indexOf('('));
      return ret;
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        vm.$options = mergeOptions(Vue.options, options);
        callHooks(vm, 'beforeCreate');
        initState(vm); //对options中的所有配置选项进行初始化，包括data.props,method,watch,computed,direactives等

        callHooks(vm, 'created');
        initTemplate(vm); //在传入的配置选项全部初始化完成后开始执行模板的编译生成虚拟DOM
      };

      Vue.prototype.$mount = function (el) {
        //$mount函数的作用就是开始模板编译生成render函数的过程并且将render生成的虚拟DOM渲染成真实的DOM并且挂载到DOM树上
        var vm = this;
        var opts = vm.$options;

        if (!opts.render) {
          //如果没有render函数的话则需要进行模板编译
          var template;

          if (opts.template) {
            //template的优先级大于el
            template = opts.template;
          } else {
            template = document.querySelector(el).outerHTML;
          }

          opts.render = compileToFunction(template); //compileToFunction开始进入模板编译阶段
        }

        mountComponent(el, vm); //生成并且渲染虚拟DOM上树
      };

      Vue.prototype.$nextTick = nextTick;

      Vue.prototype.$watch = function (expr, cb) {
        var _this = this;

        var fn = function fn() {
          return _this[expr];
        };

        return new Watcher(this, fn, {
          user: true
        }, cb);
      };
    }

    function initData(vm) {
      observe(vm.$options.data);
      var opts = vm.$options;
      vm._data = opts.data; //数据劫持

      var _loop = function _loop(key) {
        //直接将data中的属性绑定到vm实例上，进行了一次数据代理
        Object.defineProperty(vm, key, {
          get: function get() {
            return opts.data[key];
          },
          set: function set(val) {
            opts.data[key] = val;
          }
        });
      };

      for (var key in opts.data) {
        _loop(key);
      }
    }

    function getComputedProperty(context, key) {
      return function () {
        var watcher = context._computedWatchers[key];

        if (watcher.dirty) {
          watcher.value = watcher.evaluate();

          if (Dep.target) {
            watcher.depend();
          }
        }

        return watcher.value;
      };
    }

    function defineComputedProperty(vm, key, computed) {
      typeof computed === 'function' ? computed : computed.get;
      var setter = typeof computed === 'function' ? function () {} : computed.set || function () {};
      var name = typeof computed === 'function' ? getFunctionName(computed) : computed;
      Object.defineProperty(vm, name, {
        get: getComputedProperty(vm, key),
        set: setter
      });
    }

    function initComputed(vm) {
      //初始化计算属性
      var computeds = vm.$options.computed;
      var watchers = vm._computedWatchers = {};

      for (var key in computeds) {
        var getter = typeof computeds[key] === 'function' ? computeds[key] : computeds[key].get;
        console.log(getter);
        watchers[key] = new Watcher(vm, getter, {
          lazy: true
        });
        defineComputedProperty(vm, key, computeds[key]);
      }
    }

    function initWatch(vm) {
      //初始化监视属性
      var watches = vm.$options.watch;

      for (var key in watches) {
        var watch = watches[key];
        var handler = typeof watch === 'function' ? watch : watch.handler;
        var propName = typeof watch === 'function' ? getFunctionName(watch) : key;
        console.log(propName, handler);
        vm.$watch(propName, handler);
      }
    }

    function initState(vm) {
      var opts = vm.$options;

      if (opts.data) {
        initData(vm); //初始化数据
      }

      if (opts.computed) {
        initComputed(vm); //初始化计算属性
      }

      if (opts.watch) {
        initWatch(vm);
      }
    }

    function initTemplate(vm) {
      if (vm.$options.el) {
        //如果options中包含有el属性则自动调用$mount方法进行模板编译过程
        vm.$mount(vm.$options.el);
      }
    }

    function mountComponent(el, vm) {
      var updateComponet = function updateComponet() {
        //模板的重新编译或者初次编译
        var dom;

        if (Vue._vnode) {
          dom = Vue._vnode;
        } else {
          dom = document.querySelector(el);
        }

        vm._update(dom);
      };

      new Watcher(vm, updateComponet); //watcher观察者，通常一个Vue实例或者一个Vue组件对应一个Watcher实例，也就是观察者对象
    }

    function vnode(vm, tag, key, props, children, text) {
      //该函数用于生成虚拟dom节点
      return {
        vm: vm,
        tag: tag,
        key: key,
        props: props,
        children: children,
        text: text
      };
    }

    function createElementVNode(vm, tag, props, children) {
      //创建元素类型的虚拟节点
      if (!props) props = {};
      var key = props.key;
      if (props.key) delete props.key; //if(children && children.length === 1) children = [children];

      return vnode(vm, tag, key, props, children, undefined);
    }
    function createTextVNode(vm, text) {
      //创建文本类型的节点
      return vnode(vm, undefined, undefined, undefined, undefined, text);
    }

    function appendAttrs(vnode) {
      for (var key in vnode.props) {
        if (key === 'style') {
          for (var item in vnode.props.style) {
            vnode.el.style[item] = vnode.props.style[item];
          }
        } else {
          vnode.el.setAttribute(key, vnode.props[key]);
        }
      }
    }

    function createElement(vnode) {
      //根据虚拟节点vnode创建对应的真实DOM元素
      if (vnode.tag) {
        vnode.el = document.createElement(vnode.tag);
        appendAttrs(vnode);

        if (vnode.children) {
          vnode.children.forEach(function (child) {
            vnode.el.appendChild(createElement(child));
          });
        }
      } else {
        vnode.el = document.createTextNode(vnode.text);
      }

      return vnode.el;
    }

    function patch(oldVNode, newVNode, vm) {
      if (oldVNode.nodeType === 1) {
        //如果是真实的DOM元素的话则进行初次渲染
        var dom = createElement(newVNode);
        oldVNode.parentNode.insertBefore(dom, oldVNode.nextSibling);
        oldVNode.parentNode.removeChild(oldVNode);
      } else {
        //如果不是则需要进入diff算法环节比较新旧虚拟节点的差异

        /*
                diff算法
        */
        console.log("开始进行diff算法");
      }

      oldVNode.el = newVNode.el;
      vm._vnode = newVNode;
      vm._dom = oldVNode.el;
    }

    function initLifeCycle(Vue) {
      Vue.prototype._c = function (tag, props, children) {
        //创建元素节点
        return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };

      Vue.prototype._s = function (val) {
        if (_typeof(val) === 'object') {
          val = JSON.stringify(val); //触发了data中数据的set方法
        }

        return val;
      };

      Vue.prototype._v = function (text) {
        //创建文本节点
        return createTextVNode(this, text);
      };

      Vue.prototype._render = function () {
        //调用vm实例上的render函数创建对应的虚拟DOM
        var vm = this;
        return vm.$options.render.call(vm); //所谓的render函数就是之前拼接字符串生成的函数
      };

      Vue.prototype._update = function (el) {
        //将虚拟DOM转变为真实DOM并且挂载到DOM树上
        var vm = this;

        var vdom = vm._render();

        patch(el, vdom, vm);
      };
    }

    function Vue$1(options) {
      this._init(options); //初始化Vue

    }

    Vue$1.options = {}; //全局的公共配置选项
    //init...方法是向vue实例的原型对象上添加方法

    initLifeCycle(Vue$1);
    initMixin(Vue$1);

    Vue$1.mixin = function (options) {
      //给Vue构造函数上添加全局的api函数
      Vue$1.options = mergeOptions(Vue$1.options, options);
    };

    return Vue$1;

}));
//# sourceMappingURL=vue.js.map
