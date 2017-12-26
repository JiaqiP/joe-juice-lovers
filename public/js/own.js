
console.log("1");
var type = new Vue({
    el:"#type",
    mixins: [sharedVueStuff],
    data:{
       drink_type:{},
    },
    methods:{
        choose_smoothie: function(){
            this.drink_type = "smoothie";
            window.location.replace('own_size');
            
        },
        choose_juice: function(){
            this.drink_type = "juice";   
            window.location.replace('own_size');
        }
    }
})


console.log(type.data);

/*
Vue.component('check_ingredients',{
    template: '<button @click"on_click"></button>',
    
    methods:{
    on_click:function(){
    
    }
}
})

new Vue({
    el:"ingredient_buttom",
})
*/