export default {
  install(Vue) {
    Vue.filter('transformValue', (value) => {
      if(!isNaN(value)){
        value = value.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        value = value.split("").reverse().join("").replace(/^[\.]/, "");
        return value;
      }
    })
  }
}