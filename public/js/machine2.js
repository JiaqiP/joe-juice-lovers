/* show products */
Vue.component('readymade', {
    props: ['item', 'type'],
    template:
        '<div class="readymade">\
            <label>\
                <h3>{{ item.rm_name }}</h3> \
                <img v-bind:src="item.rm_image">\
                <h4>{{ item.rm_ingredients }} </h4>\
                <button v-on:click="addMe">Order me!</button>\
            </label>\
        </div>',
    methods: {
        addMe: function () {
            //console.log('Add me!');
            this.$emit('add', this.item);
        }
    }
});

Vue.component('orderedReadymade', {
    props: ['item', 'type'],
    template:
        '<tr>\
        <td class="Odel_check">\
            <button v-on:click="deleteMe">\
            <img src="images/trashcan_useful.png" width="20px">\
            </button>\
        </td>\
        <td class="Oitem">{{ item.rm_name }}</td>\
        <td class="Osize">{{ item.size_tag }}</td>\
        <td class="Oquantity">{{ item.amount }}</td>\
        <td class="Oprice">{{ item.price }}</td>\
        </tr>',
        methods: {
            deleteMe: function () {
                //console.log('Delete me!');
                this.$emit('delete', this.item);
            }
        }
});

function payalert() {
    alert("Order SUCCESS!");
}