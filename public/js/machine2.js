/**
 * Created by wangyue on 2017-12-11.
 */
/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

function showCreation() {
    var creation = document.getElementById('creation');
    var recommendation = document.getElementById('recommendation');
    creation.style.display = 'inline';
    document.getElementById("tag_R").style.backgroundColor = "orange";
    document.getElementById("tag_C").style.backgroundColor = "orangered";
    recommendation.style.display = 'none';
}
function showRecommendation() {
    var creation = document.getElementById('creation');
    var recommendation = document.getElementById('recommendation');
    document.getElementById("tag_C").style.backgroundColor = "orange";
    document.getElementById("tag_R").style.backgroundColor = "orangered";
    creation.style.display = 'none';
    recommendation.style.display = 'inline';
}

Vue.component('ingredient', {
    props: ['item', 'type', 'lang'],
    template: ' <div class="ingredient">\
                  <label>\
                    <button v-on:click="incrementCounter">{{ counter }}</button>\
                    {{item["ingredient_"+ lang]}} ({{ (type=="smoothie") ? item.vol_smoothie:item.vol_juice }} ml), {{item.selling_price}}:-, {{item.stock}} pcs\
                  </label>\
              </div>',
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
    el: '#fruit',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        type: '',
        chosenIngredients: [],
        volume: 0,
        price: 0
    },
    methods: {
        addToOrder: function (item, type) {
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
            this.chosenIngredients = [];
        }
    }
}


);