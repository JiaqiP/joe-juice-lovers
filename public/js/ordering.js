/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('ingredient', {
  props: ['item', 'type', 'lang','size'],
  template: ` <div class="ingredient">
                  <label>
                    <button v-on:click="incrementCounter">{{ counter }}</button>
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
            <span align="center">{{ item["ingredient_"+ lang]}}</span>
            <button id="flavor" class="button button-plain button-borderless"><i class="far fa-heart"></i></button>

            <button id="delete_ingr" class="button button-plain button-borderless"><i class="far fa-trash-alt"></i></button>
            </div>`,
    methods:{
        //delete
        
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

var vm = new Vue({
  el: '#ordering',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  data: {
    size:'',
    flavor:'',
    type: '',
    chosenIngredients: [],
    volume: 0,
    price: 0,
    others_show: false,
    vegetables_show: false,
    fruit_show: true,
    info_show:false
    
  },
  methods: {
    addToOrder: function (item, type) {
      this.size="small";
      this.flavor="",
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
      var i,
      //Wrap the order in an object
        order = {
          size:this.size,
          flavor:this.flavor,
          ingredients: this.chosenIngredients,
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
    goto_cart: function(){
      
    }
  }
});