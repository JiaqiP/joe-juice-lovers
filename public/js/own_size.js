var type = new Vue({
    el:"#size",
    data:{
       drink_size:{},
    },
    methods:{
        choose_small: function(){
            this.drink_size = "smoothie";
            window.location.replace('own_ingredients');
            
        },
        choose_medium: function(){
            this.drink_size = "juice";   
            window.location.replace('own_ingredients');
        },
        choose_large: function(){
            this.drink_size = "juice";   
            window.location.replace('own_ingredients');
        }
    }
})
