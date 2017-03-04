'use strict';


new Vue({
    http: {
		root: '/api',
	},
    el: '#app',
    data: {
        note: {
			id: null,
			title: null,
			body: null,
			last_saved: null
		},
        notes: [],
        save_timeout: null,
        i_date: Date.now(),
    },
    computed: {
        word_count: function word_count() {
            if (!this.note.body || this.note.body.trim() === '') {
                return 0;
            }
            return this.note.body.trim().split(' ').length;
        },
        notes_sorted: function notes_sorted() {
            return this.notes.sort(function(a, b) {
                return a['last_saved'] < b['last_saved'];
            });
        },
        last_saved: function last_saved() {
            if (!this.note.last_saved) {
                return 'Soon';
            }
            return moment(this.note.last_saved).format('DD.MM.YYYY H:mm:ss');
        },
    },
    mounted: function mounted() {
		this.fetch_notes();
	},
    methods: {
        fetch_notes: function fetch_notes() {
			this.$http.get('/api').then(function (response) {
				this.$set(this, 'notes', response.data);
			});
		},
        store_notes: function store_notes() {
            this.$http.post('/api/update', this.note).then(function (response) {
                console.log(response.data);
            });
            this.fetch_notes();
        },
        delete_note: function delete_note(id) {
			this.$http.delete('/api/destroy/' + id);
            this.fetch_notes();
        },
        clear_note: function clear_note() {
            this.note = {
                id: null,
                title: null,
                body: null,
                last_saved: null
            };
        },
        open_note: function open_note(id) {
            this.$http.get('/api/show/' + id).then(function(response) {
				this.note.id = response.data.bote.id
				this.note.title = response.data.bote.title
				this.note.body = response.data.bote.body
				this.note.last_saved = response.data.bote.last_saved
			})
        },
        save_note: function save_note() {
            this.touch_last_saved();
            if (!this.note.id) {
                this.i_date = Date.now();
                this.note.id = this.i_date;
                this.$http.post('/api/store', this.note).then(function (response) {
                    console.log(response.data);
                });
            }
            this.start_timeout();
        },
        start_timeout: function start_timeout() {
            self = this;
            if (this.save_timeout !== null) return;
            this.save_timeout = setTimeout(function() {
                self.store_notes();
                self.clear_timeout();
            }, 5000);
        },
        clear_timeout: function clear_timeout() {
            clearInterval(this.save_timeout);
            this.save_timeout = null;
        },
        touch_last_saved: function touch_last_saved() {
            this.note.last_saved = Date.now();
        }
    }
});