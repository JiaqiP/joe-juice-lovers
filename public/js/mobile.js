/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('ingredient', {
  props: ['item', 'type', 'lang','size'],
  template: ` <div class="ingredient">
                  <label>
                    <button v-on:click="incrementCounter">{{ counter }}</button>
                    <img v-bind:src="item.image" width="20px" height="20px"> 
                    {{item["ingredient_"+ lang]}} ({{ (type=="smoothie") ? item.vol_smoothie:item.vol_juice }} ml), {{item.selling_price}}:-, {{item.stock}} pcs             
                  </label>
              </div>`,
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1;
      this.$emit('increment');
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
            <button class="button button-plain"><i class="far fa-heart"></i></button>

            <button v-on:click="emit_delet_ingre_event" class="button button-plain"><i class="far fa-trash-alt"></i></button>
            </div>`,
    methods:{
        emit_delet_ingre_event:function(){
          this.$emit('delet_ingre_event',this.item);
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
        drink_type:"smoothie",

        current_page:1,
        pre_page:1,
        cart_from_page:1,

        size:'small',      
        flavor:'', //填加size，flavor数据,传给kitchen

        type: '',
        chosenIngredients: [],
        volume: 0,
        price: 0,
        others_show: false,
        vegetables_show: false,
        fruit_show: true,
        info_show:false
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
            this.current_page=3;
            this.pre_page=2;  
        },
        choose_medium:function(){
            this.size="medium";
            this.current_page=3;
            this.pre_page=2;  
        },
        choose_large:function(){
            this.size="large";
            this.current_page=3;
            this.pre_page=2;  
        },

        addToOrder: function (size,flavor,item, type) { //增加2个参数，size,flavor
          this.size=size;
          this.flavor=flavor,     //order.html 监听事件increment, 添加size,flavor数据

          this.chosenIngredients.push(item);
          this.type = type;
          if (type === "smoothie") {
            this.volume += +item.vol_smoothie;
          } else if (type === "juice") {
            this.volume += +item.vol_juice;
          }
          this.price += +item.selling_price;
        },


        placeOrder: function () {
          var i,order_ingredients,order;
            //process chosenIngredients
            order_ingredients=this.chosenIngredients;           
            order_ingredients=order_ingredients.map(item=>item["ingredient_"+ this.lang]).join(", ");
            
          //Wrap the order in an object
            order = {
              size:this.size,
              flavor:this.flavor, //添加size,flavor数据

              //ingredients: this.chosenIngredients,
              ingredients: order_ingredients,
              volume: this.volume,
              type: this.type,
              price: this.price
            };
          // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
          socket.emit('order', {orderId: getOrderNumber(), order: order});

          //set all counters to 0. Notice the use of $refs
          for (i = 0; i < this.$refs.ingredient.length; i += 1) {
            this.$refs.ingredient[i].resetCounter();
          }
          this.volume = 0;
          this.price = 0;
          this.type = '';
          this.flavor='';
          this.flavor='';
          this.chosenIngredients = [];
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
          console.log("gggggggg");
          console.log(item);
          var index=this.chosenIngredients.indexOf(item);
          this.chosenIngredients.splice(index,1);
        }
    }
})

