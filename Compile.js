class Compile{
	constructor(el,vm){
		this.el=this.isElementNode(el)?el:document.querySelector(el);
		//判断参数el是‘#app'或直接是个节点如document.getElementById('app')
		this.vm=vm;
		let fragment = this.node2Fragment(this.el)
		//把实际节点转为内存中的fragment
		this.compile(fragment)
		//编译fragment中节点的v-modal和{{}}
		this.el.appendChild(fragment)
		//把fragment重新插入文档中
	}
	isElementNode(node){
		return node.nodeType===1;
	}
	compile(fragment){
		let childNodes = fragment.childNodes
		Array.from(childNodes).forEach(node=>{
			if(this.isElementNode(node)){
				//元素节点 v-modal
				//console.log(node)
				this.compileElement(node)
				this.compile(node)//针对嵌套节点
			}else{
				//文本节点{{}}
				//console.log(node)
				this.compileText(node)
			}
		})
	}
	compileElement(node){
		//获取属性v-modal v-text的值替换成vm.$data里的值
		let attrs = node.attributes;
		Array.from(attrs).forEach(attr=>{
			let name=attr.name
			if(name.includes('v-')){
				let type=name.split('-')[1]
				let expr=attr.value // message.a
				//console.log(val)
				CompileUtil[type](node,expr,this.vm)
			}
		})
	}
	compileText(node){
		//获取{{}}的值替换成vm.$data里的值
		let text=node.textContent
		//console.log(text)
		let reg=/\{\{([^}]+)\}\}/g
		if(reg.test(text)){
			CompileUtil['text'](node,text,this.vm)
		}
	}
	node2Fragment(node){
		let fragment=document.createDocumentFragment()
		let firstChild;
		while(firstChild=node.firstChild){
			fragment.append(firstChild)
		}
		return fragment
	}
}
let CompileUtil={
	getVal(expr,vm){
		return expr.split('.').reduce((p,c)=>{
			return p[c]
		},vm.$data)
	},
	// 除了支持v-modal指令外，可以在这里增加其他的指令
	modal(node,expr,vm){
		let fn=this.updater.modalUpdater
		fn&&fn(node,this.getVal(expr,vm))
	},
	text(node,text,vm){
		let fn=this.updater.textUpdater
		let val=text.replace(/\{\{([^}]+)\}\}/g,(text,expr)=>{
			//console.log(expr) //利用带分组的正则的replace方法可以把text中的{{}}全部替换掉，详细见.replace用法
			return this.getVal(expr,vm)
		})
		fn&&fn(node,val)
	},
	updater:{
		modalUpdater(node,val){
			node.value=val
		},
		textUpdater(node,val){
			node.textContent=val
		}
	}
}