/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('ingredient', {
  props: ['item', 'type', 'lang','size'],
  template: ` <div class="ingredient">
                  <label @click="toggle">
                    <img v-bind:src="item.image" width="20px" height="20px">
                    {{item["ingredient_"+ lang]}}, {{item.stock}} pcs
                  </label>
                    <span style = "float: right>
                    {{item.select ? '{{uiLabels.select}}':''}}</span>
              </div>`,
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
//  incrementCounter: function () {
//      this.counter += 1;
//      this.$emit('increment');
//    },
    toggle:function(){
        this.$emit('select');
    },
      
    resetCounter: function () {
      this.counter = 0;
    }
  }
});

Vue.component('check_ingredients',{
    props:['item','lang'],
    template: `<div id="modify_ingredients">
            <img v-bind:src="item.image" width="20px" height="20px">
            <span align="center">{{ item["ingredient_"+ lang]}}</span>
            <button @click="emit_toggle_flavor_event" class="button button-plain">
            <i v-if="item.flavor" class="far fa-heart"></i>
            <i v-else class="far fa-heart-o"></i>
            </button>

            <button v-on:click="emit_delet_ingre_event" class="button button-plain"><i class="far fa-trash-alt"></i></button>
            </div>`,
    methods:{
        emit_delet_ingre_event:function(){
          this.$emit('delet_ingre_event',this.item);
        },
        emit_toggle_flavor_event () {
          this.$emit('toggle_flavor_event',this.item);
        }

        //mainflavor
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


var type = new Vue({
    el:"#app",
    mixins: [sharedVueStuff],
    data:{
        id: '',
        drink_type:"smoothie",

        current_page:1,
        pre_page:1,
        cart_from_page:1,

        size:'small',
        flavor:null,

        type: '',
        chosenIngredients: [],
        volume: 0,
        price: 0,
        others_show: false,
        vegetables_show: false,
        fruit_show: true,
        info_show:false,
        storegeData: [],
        },
    mounted () {
      this.id = getOrderNumber()
      this.storegeData = JSON.parse(localStorage.getItem('order')) || []
    },
    methods:{
        choose_smoothie: function(){
            this.drink_type = "smoothie";
            this.current_page=2;
            this.pre_page=1;
           // window.location.replace('own_size');
        },
        choose_juice: function(){
            this.drink_type = "juice";
            this.current_page=2;
            this.pre_page=1;
            //window.location.replace('own_size');
        },
        choose_small:function(){
            this.size="small";
            this.price=45;
            this.current_page=3;
            this.pre_page=2;
        },
        choose_medium:function(){
            this.size="medium";
            this.price=55;
            this.current_page=3;
            this.pre_page=2;
        },
        choose_large:function(){
            this.size="large";
            this.price=65;
            this.current_page=3;
            this.pre_page=2;
        },
        
        
        checkIngredients (item) {
          if (item.select) return true
          const len = this.chosenIngredients.length
          if (this.size === 'small') {
            if (len === 3) {
              alert('can\'t select more')
              return false
            }
          } else if (this.size === 'medium') {
            if (len === 4) {
              alert('can\'t select more')
              return false
            }
          } else if (this.size === 'large') {
            if (len === 5) {
              alert('can\'t select more')
              return false
            }
          }
          return true
        },
        select: function (item, type) {
          if (!this.checkIngredients(item)) return
          const ele = this.ingredients.find(ele => ele.ingredient_en === item.ingredient_en)
          ele.select = !ele.select
        
        

        addToOrder: function (size,item, type) {
          this.size=size;

       //   this.chosenIngredients.push(item);
         
          const index = this.chosenIngredients.findIndex(ele => ele.ingredient_en === item.ingredient_en)
    
            
            
        if (index === -1) {
            this.chosenIngredients.push(item);
            if (type === "smoothie") {
              this.volume += +item.vol_smoothie;
            } else if (type === "juice") {
              this.volume += +item.vol_juice;
            }
          } else {
            this.chosenIngredients.splice(index, 1);
            if (type === "smoothie") {
              this.volume -= +item.vol_smoothie;
            } else if (type === "juice") {
              this.volume -= +item.vol_juice;
            }
        },

        getOrder () {
          var order_ingredients;
          //process chosenIngredients
          order_ingredients=this.chosenIngredients;
          order_ingredients=order_ingredients.map(item=>item["ingredient_"+ this.lang]).join(", ");
          return {
            size: this.size,
            flavor: this.flavor,
            amount: 1,
            ingredients: order_ingredients,
            volume: this.volume,
            type: this.type,
            price: this.price,
            recommendation: false
          };
        },
        storeData () {
          const item = {
            id: this.id,
            order: this.getOrder()
          }
          let storegeData = localStorage.getItem('order')
          if (storegeData) {
            storegeData = JSON.parse(storegeData)
            storegeData.push(item)
          } else {
            storegeData = [item]
          }
          localStorage.setItem('order', JSON.stringify(storegeData))
        },
        placeOrder: function () {
          var i,order;
          //Wrap the order in an object
          order = this.getOrder()
          // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
          socket.emit('order', {orderId: this.id, order: order});

          //set all counters to 0. Notice the use of $refs
          for (i = 0; i < this.$refs.ingredient.length; i += 1) {
            this.$refs.ingredient[i].resetCounter();
          }
          this.volume = 0;
          this.price = 0;
          this.type = '';
          this.flavor=[];
          this.chosenIngredients = [];
          this.id = getOrderNumber()
        },

        show_vegetables: function () {
            this.others_show = false;
            this.vegetables_show = true;
            this.fruit_show = false;
            console.log("show_vegetables");
        },

        show_fruit: function () {
            this.others_show = false;
            this.vegetables_show = false;
            this.fruit_show = true;
            console.log("show_fruit");
        },

        show_others: function () {
            this.others_show = true;
            this.vegetables_show = false;
            this.fruit_show = false;
            console.log("show_others");
        },

        show_ingredient: function () {
            this.info_show = true;
            console.log("show_ingredient");
        },

        hide_ingredient: function () {
            this.info_show = false;
        },

        goto_cart: function(cart_from_page){
          console.log("cart");
          this.cart_from_page=cart_from_page;
          this.current_page=4;
        },

        goto_pre_page: function(){
          console.log("prepage");
          switch(this.current_page)
          {
          case 1:
            this.current_page=0;
            break;
          case 2:
            this.current_page=1;
            break;
          case 3:
            this.current_page=2;
            break;
          default:
          }

        },

        goto_cart_from_page: function(){
          console.log("prepage");
          this.current_page=this.cart_from_page;
        },

        delete_ingredient:function(item){
        if (confirm("Are you sure to delete this?")) {
            item.select = !item.select
            var index=this.chosenIngredients.indexOf(item);
            this.chosenIngredients.splice(index, 1);
          }
        },
            

        toggleFlavor (item) {
+          if (!this.flavor) {
            this.flavor = item
            var index = this.ingredients.indexOf(item);
            this.ingredients[index].flavor = true
          } else {
            this.flavor.splice(index,1)
            if (this.flavor == item) {
              var index = this.ingredients.indexOf(this.flavor);
              this.ingredients[index].flavor = false
              this.flavor = null
            } else {
              var index = this.ingredients.indexOf(this.flavor);
              console.log(index);
              this.ingredients[index].flavor = false
              this.flavor = item
              var index = this.ingredients.indexOf(this.flavor);
              this.ingredients[index].flavor = true
            }
          }
        },
            
        toCart () {
          this.storeData()
          window.location.href = '/mobile/cart'
        }
    }
})
// Still problems with flavor