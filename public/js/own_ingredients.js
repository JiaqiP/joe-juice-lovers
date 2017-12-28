// 0. If using a module system, call Vue.use(VueRouter)
Vue.use(VueRouter);
// 1. Define route components.
// These can be imported from other files


const friut = {
    template: `<div>
    <ingredient
      ref="ingredient"
      type="smoothie"
      v-for="item in ingredients"
      v-if="item.vol_smoothie > 0"
      v-on:increment="addToOrder(item, \'smoothie\')"  
      :item="item" 
      :lang="lang"
      :key="item.ingredient_id">
    </ingredient>
    </div>`
}
const vegetables = { 
    template: `<div>
    <ingredient
      ref="ingredient"
      type="juice"
      v-for="item in ingredients"
      v-if="item.vol_juice > 0" 
      v-on:increment="addToOrder(item, \'juice\')" 
      :item="item"
      :lang="lang"
      :key="item.ingredient_id">
    </ingredient></div>`
}

const others = { 
    template: `<div>
    order
    </div>` 
}
const chk_ingredients = {
    template: `<div>
    {{ chosenIngredients.map(item => item["ingredient_"+lang]).join(\', \') }} {{ volume }} ml, {{size}}
    <button v-on:click="placeOrder()">{{ uiLabels.placeOrder }}</button></div>`

}

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/fruit', component: friut },
  { path: '/vegetables', component: vegetables },
  { path: '/others',component:others },
  { path: '/check_ingredients', component:chk_ingredients }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.

//const app = new Vue({  
  //router
//}).$mount('#route_type')



/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('ingredient', {
  props: ['item', 'type', 'lang','size'],
  template: `<div class="ingredient">
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
  el: '#route_type',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  data: {
    size:'medium',
    type: '',
    chosenIngredients: [],
    volume: 0,
  },
  methods: {
    addToOrder: function (item, type) {
      this.size="small";
      this.chosenIngredients.push(item);
      this.type = type;
      if (type === "smoothie") {
        this.volume += +item.vol_smoothie;
      } else if (type === "juice") {
        this.volume += +item.vol_juice;
      }
    },
    placeOrder: function () {
      var i,
      //Wrap the order in an object
        order = {
          size:this.size,
          ingredients: this.chosenIngredients,
          volume: this.volume,
          type: this.type,
        };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('order', {orderId: getOrderNumber(), order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.type = '';
      this.chosenIngredients = [];
    }
  },
    router,
});


// Now the app has started!