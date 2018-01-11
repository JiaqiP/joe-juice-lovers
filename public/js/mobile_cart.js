Vue.component('cart-item', {
  props: ['item','lang'],
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
        <p v-if="item.order.flavor!=undefined">Main Flavor:{{item.order.flavor["ingredient_"+this.lang]}}</p>
        <p>Ingredients: {{item.order.ingredients}}</p>
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
          return Number(sum) + Number(item.order.price)
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
        if (window.confirm("Are you sure to delete it?")) {
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
    
       pay (){
           console.log(this.storegeData.length);
           
        for(i = 0; i < this.storegeData.length;i++){
            var order = this.storegeData[i].order
            console.log(order);
        
        //order_ingredients=order_ingredients.map(item=>item["ingredient_"+ this.lang]).join(", ");     
            
            var orderedStaffObj = {
              size:order.size,
              flavor:order.flavor,
              ingredients: order.ingredients,
              type: order.type,
              price: order.price
            };
           
            if (orderedStaffObj.flavor!=undefined)
               orderedStaffObj.flavor = orderedStaffObj.flavor["ingredient_"+this.lang];
       
           //socket.emit('order', {orderId: getOrderNumber(), order: orderdStaffObj}); 
           socket.emit('cart', {orderId: getOrderNumber(), order: orderedStaffObj}); 
            
            localStorage.clear();
            window.location.reload();
            
                                  
       //    socket.emit('cart', order);
        }
      }
      
    }
})
