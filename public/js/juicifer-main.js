/*jslint es5:true, indent: 2 */
/*global io, Vue */
/*exported sharedVueStuff */
'use strict';

var socket = io();

/*
Vue.component('order-item', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div>{{orderId}} {{order.size}} {{order.flavor}} {{order.type}} {{uiLabels.ingredients}}: {{ order.ingredients.map(item=>item["ingredient_"+ lang]).join(", ") }} </div>'
});   //add {{order.size}} {{order.flavor}}
*/
Vue.component('order-item', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: `<div>
                <div>{{orderId}} {{order.size}} {{order.flavor}}</div>
                <div>{{order.type}} {{uiLabels.ingredients}}: {{ order.ingredients}} </div>
              </div>`,
});   //add{{order.size}} {{order.flavor}}，

// Stuff that is used both in the ordering system and in the kitchen
var sharedVueStuff = {
  data: {
    orders: {},
    uiLabels: {},
    ingredients: {},
    lang: "en",
    readymade: {},

  },
  created: function () {
    socket.on('initialize', function (data) {
      this.size = data.size;
      this.flavor = data.flavor;
      this.orders = data.orders;
      this.uiLabels = data.uiLabels;
      //this.ingredients = data.ingredients;
      this.ingredients = data.ingredients.map(item => {
        item.flavor = false
        item.select = false
        return item
      });
      this.readymade = data.readymade;
      this.lang = localStorage.getItem('lang');
    }.bind(this));

    socket.on('switchLang', function (data) {
      this.uiLabels = data;
    }.bind(this));

    socket.on('currentQueue', function (data) {
      this.orders = data.orders;
      if (typeof data.ingredients !== 'undefined') {
        this.ingredients = data.ingredients;
        this.type = data.type;
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
        localStorage.setItem('lang', 'sv');
      } else {
        this.lang = "en";
        localStorage.setItem('lang', 'en');
      }
      socket.emit('switchLang', this.lang);
    }
  }
};