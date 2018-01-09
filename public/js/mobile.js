new Vue({
    el:"#app",
    mixins: [sharedVueStuff],
    data () {
      return {
        storegeData: [],
      }
    },
    mounted () {
      this.storegeData = JSON.parse(localStorage.getItem('order')) || []
    }
})
