//
class Observer{
    constructor(obj){
        this.observe(obj)
    }
    observe(obj){
        if(!obj||typeof obj!=='object'){
            return;
        }
        Object.keys(obj).forEach(key=>{
            this.defineReactive(obj,key,obj[key])  //用于vm.$data={message:...}
            this.observe(obj[key])  //用于message={a:...,b:...}
        })
    }
    defineReactive(obj,key,val){
        let that = this
        let dep = new Dep()
        Object.defineProperty(obj,key,{
            set(newVal){
              if(newVal!==val){
                    that.observe(newVal)  //用于赋新值也要observer，如message={c:...}
                    val=newVal
                    dep.notify()
              }  
            },
            get(){
                Dep.target&&dep.addSub(Dep.target)
                return val
            }
        })
    }
}