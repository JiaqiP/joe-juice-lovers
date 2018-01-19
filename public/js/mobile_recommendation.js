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
          url:"https://www.joejuice.com/media/2337/pickmeofhindbaer.jpg",
          price: 30,
          name: 'Pick me up',
          ingredients: 'Raspberry, banana, apple'
        }, {
          url:'https://www.joejuice.com/media/2355/energizer.jpg',
          price: 30,
          name: 'Energizer',
          ingredients: 'Red grapefruit, ginger, apple'
        }, {
          url:'https://www.joejuice.com/media/2334/ironman.jpg',
          price: 30,
          name: 'Iron man',
          ingredients: 'pomegranate juice, water,sugar '
        }, {
          url:'https://www.joejuice.com/media/2309/amg.jpg',
          price: 30,
          name: 'Joe\'s AMG',
          ingredients: 'watermelon juice, water,sugar '
        }, {
          url:'https://www.joejuice.com/media/2343/stressdown.jpg',
          price: 3,
          name: 'Stress down',
          ingredients: 'kiwifruit juice, water,sugar '
        }, {
          url:'https://www.joejuice.com/media/2331/hangoverheaven.jpg',
          price: 30,
          name: 'Heaven',
          ingredients: 'Apple, elderflower, mint'
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
      var order = {
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
      console.log("rec send to kitchen");
      console.log(order);
       
          
          //Do not need direct send here any more
          //socket.emit('order', {orderId: this.id, order: order});
          
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
