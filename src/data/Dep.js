let id = 0;

class Dep {
    constructor() {
        this.id = id++; //id唯一标识一个watcher，也就是说每一个watcher都有一个独有的id号
        this.subs = []; //存储着dep的监听者也就是观察者，当Dep实例对应的属性发生改变时，对应subs中存储的观察者就会触发调用
    }

    depend() {
        if(!this.subs.includes(Dep.target)) {
            this.subs.push(Dep.target);
            if(!Dep.target.deps.includes(this)){
                Dep.target.deps.push(this);
            }
        }
    }

    notify() {
        this.subs.forEach(watcher=>{
            watcher.update();
        })
    }
}

export default Dep;