import list from "./studentList.vue"
const List = {}
// 注册List
List.install = function(Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const ListConstructor = Vue.extend(list)
  // 生成一个该子类的实例
  const instance = new ListConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement("div"));
  document.body.appendChild(instance.$el);
  /*
    instance.$el.onloadeddata = this.playerready;
    instance.$el.onended = this.playerended;
    instance.$el.onerror = this.playererror;
  */
  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$list = (title, list, callback) => {
    instance.show(title, list, callback)
  }
  Vue.prototype.$listClose = () => {
    instance.close()
  }
}
export default List
