new Vue({
    el:"#app",
    data () {
      return {
        storegeData: [],
      }
    },
    mounted () {
      this.storegeData = JSON.parse(localStorage.getItem('order')) || []
    }
})
