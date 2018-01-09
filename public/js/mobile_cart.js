Vue.component('cart-item', {
  props: ['item'],
  template: `
    <div class="cart-item">
      <div class="item-title">
        <span>{{item.order.name}}</span>
        <span>{{item.order.size[0].toUpperCase()}}</span>
        <span>
          <button @click="subtract" class="button button-caution button-square button-small"><i class="fa fa-minus"></i></button>
          <button class="button button-primary button-square button-small">{{item.order.amount}}</button>
          <button @click="add" class="button button-action button-square button-small"><i class="fa fa-plus"></i></button>
        </span>
        <span>{{item.order.price}}</span>
      </div>
      <div class="item-extra">
        <p>{{uiLabels.mainFlavor}}: {{item.order.flavor}}</p>
        <p>{{uiLabels.otherIngre}}: {{item.order.ingredients}}</p>
      </div>
      <div class="item-delete">
        <button class="button button-plain" @click="remove">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `,
  data () {
    return {

    }
  },
  methods: {
    subtract () {
      this.$emit('subtract', this.item.id)
    },
    add () {
      this.$emit('add', this.item.id)
    },
    remove () {
      this.$emit('remove', this.item.id)
    }
  }
})

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
      totalMoney () {
        return this.itemsAdpter.reduce((sum, item) => {
          return sum + item.order.price
        }, 0)
      }
    },
    methods: {
      subtract (id) {
        const index = this.storegeData.findIndex(ele => {
          return ele.id === id
        })
        const amount = this.storegeData[index].order.amount
        if (amount === 1) {
          return
        } else {
          this.storegeData[index].order.amount--
          this.storegeData[index].order.price = (this.storegeData[index].order.price / amount) * (amount - 1)
        }
        this.storeData()
      },
      add (id) {
        const index = this.storegeData.findIndex(ele => {
          return ele.id === id
        })
        const amount = this.storegeData[index].order.amount
        this.storegeData[index].order.price = (this.storegeData[index].order.price / amount) * (amount + 1)
        this.storegeData[index].order.amount++
        this.storeData()
      },
      remove (id) {
        if (window.confirm('Are you sure do delete it?')) {
          const index = this.storegeData.findIndex(ele => {
            return ele.id === id
          })
          this.storegeData.splice(index,1)
          this.storeData()
        }
      },
      storeData () {
        localStorage.setItem('order', JSON.stringify(this.storegeData))
      },
    
       pay () {
        socket.emit('order', {'order': this.storegeData});
      }
    }
})
