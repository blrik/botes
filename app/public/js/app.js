'use strict';


new Vue({
    http: {
        root: '/api',
    },
    el: '#app',
    data: {
        bote: {
            id: null,
            body: null,
            last_saved: null
        },
        botes: [],
        save_timeout: null,
        store: false,
        search: '',
    },
    computed: {
        word_count: function word_count() {
            if (!this.bote.body || this.bote.body.trim() === '') {
                return 0;
            }
            return this.bote.body.trim().split(' ').length;
        },
        last_saved: function last_saved() {
            if (!this.bote.last_saved) {
                return 'soon';
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
                if (item.body.toLowerCase().indexOf(search) !== -1) {
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
                this.$set(this, 'botes', response.data);
            });
        },
        store_botes: function store_botes() {
            this.touch_last_saved();
            if (!this.bote.id) {
                this.bote.id = Date.now();
                this.$http.post('/api/store', this.bote).then(function(response) {
                    this.botes.unshift(response.data);
                });
            } else {
                this.$http.post('/api/update', this.bote).then(function(response) {
                    this.botes.unshift(response.data);
                });
            }
            this.fetch_botes();
            this.store = false;
        },
        delete_bote: function delete_bote(id) {
            this.$http.delete('/api/destroy/' + id);
            this.clear_bote();
            this.fetch_botes();
        },
        clear_bote: function clear_bote() {
            this.bote = {
                id: null,
                body: null,
                last_saved: null
            };
        },
        open_bote: function open_bote(id) {
            this.$http.get('/api/show/' + id).then(function(response) {
                this.bote.id = response.data.bote.id
                this.bote.body = response.data.bote.body
                this.bote.last_saved = response.data.bote.last_saved
            })
        },
        save_bote: function save_bote() {
            this.store = true;
            self = this;
            if (this.save_timeout !== null) return;
            this.save_timeout = setTimeout(function() {
                self.store_botes();
                self.clear_timeout();
            }, 5000);
        },
        clear_timeout: function clear_timeout() {
            clearInterval(this.save_timeout);
            this.save_timeout = null;
        },
        touch_last_saved: function touch_last_saved() {
            this.bote.last_saved = Date.now();
        }
    }
});