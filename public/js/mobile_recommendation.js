function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function getOrderNumber() {
  // It's probably not a good idea to generate a random order number, client-side.
  // A better idea would be to let the server decide.
  return "#" + getRandomInt(1, 1000000);
}
Vue.component('cart-item', {
  props: ['item'],
  template: `
    <div class="cart-item">

    </div>
  `,
  data () {
    return {

    }
  },
  methods: {

  }
})

new Vue({
    el:"#app",
    mixins: [sharedVueStuff],
    data () {
      return {
        id: '',
        storegeData: [],
        isShowModal: false,
        choose: {
          name: '',
          ingredients: '',
          price: 0
        },
        recommendation: [{
          url:'/images/1.png',
          price: 3,
          name: 'carambola',
          ingredients: 'carambola juice, water,sugar '
        }, {
          url:'/images/2.png',
          price: 3,
          name: 'tangerine',
          ingredients: 'tangerine juice, water,sugar '
        }, {
          url:'/images/3.png',
          price: 3,
          name: 'pomegranate',
          ingredients: 'pomegranate juice, water,sugar '
        }, {
          url:'/images/4.png',
          price: 3,
          name: 'watermelon',
          ingredients: 'watermelon juice, water,sugar '
        }, {
          url:'/images/5.png',
          price: 3,
          name: 'kiwifruit',
          ingredients: 'kiwifruit juice, water,sugar '
        }, {
          url:'/images/6.png',
          price: 3,
          name: 'pineapple',
          ingredients: 'pineapple juice, water,sugar '
        }]
      }
    },
    mounted () {
      this.storegeData = JSON.parse(localStorage.getItem('order')) || []
      this.id = getOrderNumber()
    },
    computed: {
      itemsAdpter () {
        let i = 1
        return this.storegeData.map(item => {
          if (!item.order.recommendation) {
            item.order.name = `Own Juice ${i++}`
          }
          return item
        })
      },

    },
    methods: {
      showMadal (item) {
        this.isShowModal = true
        this.choose.name = item.name
        this.choose.price = item.price
        this.choose.ingredients = item.ingredients
      },
      closeModal () {
        this.isShowModal = false
      },
      processData (size, volume, price) {
        const order = {
          size: size,
          flavor: null,
          amount: 1,
          ingredients: this.choose.ingredients,
          volume: volume,
          type: null,
          price: price,
          name: this.choose.name,
          recommendation: true
        }
        socket.emit('order', {orderId: this.id, order: order});
        const item = {
          id: this.id,
          order
        }
        let storegeData = localStorage.getItem('order')
        if (storegeData) {
          storegeData = JSON.parse(storegeData)
          storegeData.push(item)
        } else {
          storegeData = [item]
        }
        localStorage.setItem('order', JSON.stringify(storegeData))
        window.location.href = '/mobile/cart'
      },
      storeData () {
        localStorage.setItem('order', JSON.stringify(this.storegeData))
      }
    }
})
