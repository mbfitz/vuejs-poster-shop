// in es5 all caps tells you it's a constant and won't change
var PRICE = 9.99;
var LOAD_NUM = 10;

// vue constructor
new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        newSearch: '90s',
        lastSearch: '',
        loading: false,
        price: PRICE,
        results: []
    },
    // computed property
    computed: {
        noMoreItems: function() {
            return this.items.length === this.results.length && this.results.length > 0
        },
    },
    methods: {
        appendItems: function() {
            if (this.items.length < this.results.length) {
                // assign results to items property
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function() {
            if (this.newSearch.length) {
                // empty list for new searches
                this.items= [];
                this.loading = true;
                // vue resource, get method, returns promise (then)
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function(res){
                        // set last search data variable to last searched term
                        this.lastSearch = this.newSearch;
                        this.results = res.data;
                        this.appendItems();
                        // reset loading to false
                        this.loading = false;
                    });
            }
        },
        // someone adds item to cart
        addItem: function(index) {
            this.total += 9.99;
            // find the item from the array and assign to variable
            var item = this.items[index];
            var found = false;
            // iterate through cart, and if the item is found, just increase the quantity
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            // if item is not found, create new cart item and push to the cart
            if(!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },
        // increment quantity and price
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        // decrement quantitiy and price
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;
            // check to make sure cart doesn't go below 0
            if (item.qty <= 0) {
                // loop through items in cart
                for (var i = 0; i < this.cart.length; i++) {
                    // if this was just passed in, remove it
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break; // don't continue once you've found the item
                    }
                }
            }
        },
    }, 
    filters: {
        currency: function(price){
            // add dollar sign and toFixed string method for decimal places
            return '$'.concat(price.toFixed(2));
        }
    },
    // vue lifesycle hook
    mounted: function() {
        this.onSubmit();

        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function(){
            // because it's not a vue component we need to give this an alias
            vueInstance.appendItems();
        })
    }
});