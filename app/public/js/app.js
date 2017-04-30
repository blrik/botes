'use strict';


new Vue({
    http: {
        root: '/api',
    },
    el: '#app',
    data: {
        bote: {
            _id: null,
            title: null,
            body: null,
            last_saved: null
        },
        botes: [],
        save_timeout: null,
        store: false,
        search: '',
    },
    computed: {
        last_saved: function last_saved() {
            if (!this.bote.last_saved) {
                return moment(Date.now()).format('DD.MM.YYYY H:mm:ss');
            }
            return moment(this.bote.last_saved).format('DD.MM.YYYY H:mm:ss');
        },
        botes_sorted: function() {
            var botes_array = this.botes;
            var search = this.search;
            if (!this.search) {
                return botes_array.sort(function(a, b) {
                    return a['last_saved'] < b['last_saved'];
                });
            }
            search = search.trim().toLowerCase();
            botes_array = botes_array.filter(function(item) {
                if (item.title.toLowerCase().indexOf(search) !== -1) {
                    return item;
                }
            })
            return botes_array.sort(function(a, b) {
                return a['last_saved'] < b['last_saved'];
            });
        }
    },
    mounted: function mounted() {
        this.fetch_botes();
    },
    methods: {
        fetch_botes: function fetch_botes() {
            this.$http.get('/api').then(function(response) {
                this.$set(this, 'botes', response.data.botes);
                this.clear_timeout();
            });
        },
        store_bote: function store_bote() {
            if (!this.bote._id) {
                this.$http.post('/api/store', this.bote).then(function(response) {
                    this.bote._id = response.data.bote._id;
                    this.fetch_botes();
                    this.store = false;
                    this.clear_timeout();
                    this.touch_last_saved();
                });
            } else {
                this.$http.post('/api/update/' + this.bote._id, this.bote).then(function(response) {
                    this.fetch_botes();
                    this.store = false;
                    this.clear_timeout();
                    this.touch_last_saved();
                });
            }
        },
        delete_bote: function delete_bote(_id) {
            if (confirm('вы готовы удалить?')) {
                var check = this.checked(1, 99);
                var confirm_check = prompt('пожалуйста входите число: "' + check + '"', 1);
                if (confirm_check == check) {
                    this.$http.delete('/api/destroy/' + _id).then(function(response) {
                        this.clear_bote();
                        this.fetch_botes();
                        this.clear_timeout();
                    });
                }
            }
        },
        clear_bote: function clear_bote() {
            this.bote = {
                _id: null,
                title: null,
                body: null,
                last_saved: null
            };
        },
        open_bote: function open_bote(_id) {
            this.$http.get('/api/show/' + _id).then(function(response) {
                this.bote._id = response.data.bote._id
                this.bote.title = response.data.bote.title
                this.bote.body = response.data.bote.body
                this.bote.last_saved = response.data.bote.last_saved
            })
        },
        save_bote: function save_bote() {
            this.store = true;
            self = this;
            if (this.save_timeout !== null) return;
            this.save_timeout = setTimeout(function() {
                self.store_bote();
                self.clear_timeout();
            }, 5000);
        },
        clear_timeout: function clear_timeout() {
            clearInterval(this.save_timeout);
            this.save_timeout = null;
        },
        touch_last_saved: function touch_last_saved() {
            this.bote.last_saved = Date.now();
        },
        checked: function checked(min, max) {
            var rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }
    }
});