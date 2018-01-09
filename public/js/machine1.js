/**
 * Created by wangyue on 2017-12-11.
 */
/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('ingredient', {
    props: ['item', 'type', 'lang'],
    template: ' <div class="ingredient">\
                  <label>\
                    <h3>{{ item["ingredient_en"]}}</h3> \
                    <img src="../images/temp/carrot.png">\
                    <h4>{{item.selling_price}}SEK</h4>\
                    <h4>{{lang}}</h4>\
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
            // if(i_flag) {
            //
            // } else {
            //
            // }
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
        price: 0,
        show_size:true,
        show_type:true,
        show_ingredient:true,
        show_border:false,
        flag: false
    },
    methods: {
        addTypeToOrder:function(type) {
            this.type = type;
            console.log(this.type);
            this.show_size=true;
        },
        addSizeToOrder:function(size) {
            this.size = size;
            console.log(this.size);
            this.show_ingredient = true;
            document.getElementById("notation3").innerHTML="Then choose your ingredients...";
        },

        // isChecked: function(item) {
        //     this.flag = this.show_border === true?false:true;
        //     console.log("view");
        //     console.log(flag);
        //     if(flag) {
        //         console.log(this);
        //         console.log("add border");
        //         this.style.border="3px solid  #febc44";
        //         this.chosenIngredients.push(item);
        //     }
        //     else {
        //         this.style.border="";
        //     }
        // },

        addToOrder: function (item) {
            this.flag = this.flag === true?false:true;
            if(this.flag) {
                // console.log(this.$el.innerHTML);
                // console.log("add border");

            }
            else {
                //this.style.border="";
            }
            this.chosenIngredients.push(item);
            var type = this.type;
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
                    size: this.size,
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
            this.size = 'default'
            this.chosenIngredients = [];
        }
    }
}


);


var btnlist = document.getElementById('ctype').getElementsByTagName('p');
console.log("show button");
console.log(btnlist);
var i=0;


for(var i=0; i<btnlist.length; i++) {
    btnlist[i].addEventListener('click',function(){
        for(var i=0; i<btnlist.length; i++) {
            btnlist[i].setAttribute('class','offclick');
            //btnlist[i].css("width", "200px");
        }
        this.setAttribute('class','onclick');
        document.getElementById("notation2").innerHTML="Then choose size...";
        //this.css("width", "200px");
    });
}
// for(var i=0; i<btnlist.length; i++) {
//     btnlist[i].setAttribute("width","200px");
// }