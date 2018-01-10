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
Vue.component('readymade', {
  props: ['item', 'type'],
  template: ' <div class="readymade">\
                <label>\
                  <h3>{{ item["rm_name"]}}</h3> \
                  <img src="../images/temp/carrot.png">\
                  <h4>Ingredients: {{item["rm_ingredients"]}} </h4>\
                 <button v-on:click="incrementCounter">{{ counter }}</button>\
                </label>\
            </div>',
  data: function () {
      return {
          counter: 0
      };
  },
  methods: {
      incrementCounter: function () {
          var i_flag = this.counter;
          this.counter = i_flag === 1?0:1;
          this.$emit('increment');
      },
      decreaseCounter: function () {
          console.log(this.type);
          this.counter -= 1;
          this.$emit('decrease');
      },
      resetCounter: function () {
          this.counter = 0;
      }
  }
});

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
          ingredients: 'none'
        }, {
          url:'/images/2.png',
          price: 3,
          name: 'tangerine',
          ingredients: 'none'
        }, {
          url:'/images/3.png',
          price: 3,
          name: 'pomegranate',
          ingredients: 'none'
        }, {
          url:'/images/4.png',
          price: 3,
          name: 'watermelon',
          ingredients: 'none'
        }, {
          url:'/images/5.png',
          price: 3,
          name: 'kiwifruit',
          ingredients: 'none'
        }, {
          url:'/images/6.png',
          price: 3,
          name: 'pineapple',
          ingredients: 'none'
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
