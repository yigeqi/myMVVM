class Watcher{
    constructor(vm,expr,cb){
        this.vm=vm
        this.expr=expr
        this.cb=cb
        this.value=this.get()
    }
    get(){
        Dep.target=this
        let val=this.getVal()
        Dep.target=null
        return val
    }
    getVal(){
        return this.expr.split('.').reduce((p,c)=>{
            return p[c]
        },this.vm.$data)
    }
    update(){
        let oldVal=this.value
        let newVal=this.getVal()
        if(oldVal!==newVal){
            this.cb(newVal)
        }
    }
}
class Dep{
    constructor(){
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>{
            watcher.update()
        })
    }
}