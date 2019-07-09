class MVVM{
	constructor(options){
		this.$el=options.el;
		this.$data=options.data;
		if(this.$el){
			new Observer(this.$data)
			//编译模板
			new Compile(this.$el,this)
		}
	}
}