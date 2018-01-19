/*jslint es5:true, indent: 2 */
/*global io, Vue */
/*exported sharedVueStuff */
'use strict';

var socket = io();

//For ivy
Vue.component('order-item1', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: `<div>
              <div>{{orderId}}: {{order.name}} - {{order.size}} {{order.flavor}} {{order.type}}</div>
              <div>{{uiLabels.ingredients}}: {{ order.ingredients.map(item=>item["ingredient_"+ lang]).join(", ") }}</div>
            </div>`
});   //add {{order.size}} {{order.flavor}}

Vue.component('order-item', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: `<div>
                <div>{{orderId}}: {{order.name}} - {{order.size}} {{order.flavor}}</div>
                <div>{{uiLabels.ingredients}}: {{ order.ingredients}} </div>
              </div>`,
});   //add{{order.size}} {{order.flavor}}，

// Stuff that is used both in the ordering system and in the kitchen
var sharedVueStuff = {
  data: {
    orders: {},
    uiLabels: {},
    ingredients: {},
    lang: 'en',
    readymade: {},
    flavor:{},
    size:{},
    prize:{},
    amount:{},

  },
  created: function () {
    if(localStorage.lang!=undefined)
        this.lang = localStorage.getItem('lang');
    else {
        this.lang = 'en';
        localStorage.setItem('lang','en');
    }
    socket.emit('switchLang', this.lang);
    //  console.log(this.lang);
    socket.on('initialize', function (data) {
      this.size = data.size;
      this.flavor = data.flavor;
      this.prize = data.prize;
      this.orders = data.orders;
      this.uiLabels = data.uiLabels;
      this.ingredients = data.ingredients.map(item => {
        item.flavor = false
        item.select = false
        return item
      });
      this.readymade = data.readymade;
    }.bind(this));

    socket.on('switchLang', function (data) {
      this.uiLabels = data;
    }.bind(this));

    socket.on('currentQueue', function (data) {
      this.orders = data.orders;
      if (typeof data.ingredients !== 'undefined') {
        this.ingredients = data.ingredients;
        this.type = data.type;
        this.size = data.size;
        console.log("ingredients not empty");
      }
      else{
        console.log("ingredients empty");
      }

    }.bind(this));
  },
  methods: {
    switchLang: function () {
      if (this.lang === "en") {
        this.lang = "sv";
      //    console.log(this.lang);
        localStorage.setItem('lang','sv');
      } else {
        this.lang = "en";
     //     console.log(this.lang);
        localStorage.setItem('lang','en');
      }
      socket.emit('switchLang', this.lang);
      
    }
  }
};
