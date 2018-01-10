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
                    <img v-bind:src="item.image">\
                    <h4>{{item.selling_price}}SEK</h4>\
                    \
                   <button v-on:click="incrementCounter">{{ counter }}</button>\
                   <p>{{string}}</p>\
                  </label>\
                  \
              </div>',
    data: function () {
        return {
            counter: 0,
            string:""
        };
    },
    methods: {
        incrementCounter: function () {
            var i_flag = this.counter;
            this.counter = i_flag === 1?0:1;
            if(i_flag) {
                this.string="Select";
            } else {
                this.string="Delete";
            }
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


Vue.component('check_ingredients',{
    props:['item','lang'],
    template: '<div id="modify_ingredients">\
            <img v-bind:src="item.image" width="20px" height="20px">\
            <span align="center">{{ item["ingredient_"+ lang]}}</span>\
            <button v-on:click="beMainFlavor(item)" class="button button-plain"><i class="fa fa-heart-o"></i></button>\
            <button v-on:click="emit_delet_ingre_event" class="button button-plain"><i class="fa fa-trash" aria-hidden="true"></i></button>\
            </div>',
    methods:{
        emit_delet_ingre_event:function(){
            this.$emit('delet_ingre_event',this.item);
        },
        emit_toggle_flavor_event: function () {
            this.$emit('toggle_flavor_event',this.item);
        }

        //mainflavor
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
        show_ingredient:false,
        show_border:false,
        flag: false,
        last_id:[],
        flavor:[]
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
            this.show_type = false;
            document.getElementById("notation3").innerHTML="Then choose your ingredients...";
        },
        showType:function() {this.show_type = true;},
        showSize:function() {this.show_size = true;},
        confirmSizeType: function() {
            this.show_type = false;
            this.show_size = false;
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
            console.log(this.size);
            var size = this.size;
            var max_num = 0;
            if(size=="small"){
                max_num = 3;
            } else if (size=="medium") {
                max_num = 4;
            } else {
                max_num =5;
            }
            //this.flag = this.flag === true?false:true;
            var temp_id = item.ingredient_id;
            console.log("check index");
            console.log(this.chosenIngredients.indexOf(item));
            if(this.chosenIngredients.indexOf(item)==-1) {
                this.flag = true;
                this.last_id.push[temp_id];
                console.log(this.last_id[0]);
            } else {
                this.flag=false;
            }
            //to store ingredient ids

            //console.log(this.flag);
            //console.log("log item id");
            //console.log(item.ingredient_id);
            if(this.flag) {
                this.chosenIngredients.push(item);
            }
            else {
                console.log("delete number");
                console.log(this.chosenIngredients.ingredient_id);
                //remove it from last_id[]
                //this.last_id.splice(isRepeated(temp_id,this.last_id),1);
                var index=this.chosenIngredients.indexOf(item);
                this.chosenIngredients.splice(index,1);
            }

            if(this.chosenIngredients.length > max_num) {
                var string_alert="Maximum number of ingredients is " + max_num + " for " + this.size + " size.";
                alert(string_alert);
                this.chosenIngredients.splice(this.chosenIngredients.length-1,1);
            }
            //this.chosenIngredients.push(item);
            //console.log(this.chosenIngredients[0].ingredient_id);
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
            this.size = '';
            this.chosenIngredients = [];
        },

        delete_ingredient:function(item){
            //console.log("gggggggg");
            console.log(item);
            var index=this.chosenIngredients.indexOf(item);
            this.chosenIngredients.splice(index,1);
        },
        toggleFlavor: function(item) {
            console.log(this.flavor);
            const index = (this.flavor || []).indexOf(item)
            if (index === -1) {
                this.flavor ? this.flavor.push(item) : this.flavor = [item]
            } else {
                this.flavor.splice(index,1)
            }
        },
        beMainFlavor: function(item) {
            //...
        }
    }
}


);

function isRepeated(temp, arr) {
    console.log(temp);
    console.log(arr);
    for(var i=0; i<arr.length; i++) {
        if(arr[i]==temp){
            console.log("is repeated");
            return i;
            break;
        }
    }
    return false;
}

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
        document.getElementById("notation2").innerHTML="Second, choose size...";
        //this.css("width", "200px");
    });
}

// var btnlist2 = document.getElementById('size').getElementsByTagName('button');
//
//
// for(var j=0; i<btnlist2.length; j++) {
//     btnlist[j].addEventListener('click',function(){
//         for(var j=0; j<btnlist2.length; j++) {
//             btnlist2[j].style.backgroundColor="#bbbbbb";
//             //btnlist[i].css("width", "200px");
//         }
//         this.setAttribute('class','onclick').style.backgroundColor="#febc44";
//     });
// }


// for(var i=0; i<btnlist.length; i++) {
//     btnlist[i].setAttribute("width","200px");
// }