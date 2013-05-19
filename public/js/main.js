$(function() {

  var app = {

    init: function() {
      this.cacheEls();
      this.bindEls();
    },

    cacheEls: function() {
      this.$fetchBtn    = $('.btn.fetch');
      this.$loading     = $('.loading');
      this.$input1      = $('.email1');
      this.$input2      = $('.email2');
      this.$collection1 = $('.collection1');
      this.$collection2 = $('.collection2');
      this.$collections = $('.collections');
    },

    bindEls: function() {
      this.$fetchBtn.click($.proxy(this.fetchCollections, this));
    },

    fetchCollections: function(e) {
      e.preventDefault();

      var email1 = this.$input1.val(),
          email2 = this.$input2.val(),
          emails = [email1, email2],
          self = this;

      if (!email1.length || !email2.length) {
        alert('Please enter two emails!');
        return false;
      }

      this.$fetchBtn.attr('disabled', true);

      this.$loading.show();
      this.$collections.empty();

      $.get('/compare', {
        user1_email: email1,
        user2_email: email2
      }).done(function(data) {
        self.$loading.hide();
        $(emails).each(function(i, email) {
          var collection = data.collections[email];
          self.renderCollection(email, collection);
        });
        self.$fetchBtn.removeAttr('disabled');
      });
    },

    renderCollection: function(email, collection) {
      // Move this into a template... jQuery DOM building is stupid.
      var $el = $('<div>').addClass('span6'),
          $ul = $('<ul>').appendTo($el);

      this.sortAlphabetically(collection, 'name');

      $(collection).each(function(i, album) {
        var $li = $('<li>').appendTo($ul);
        var $img = $('<img>').attr('src', album.icon);
        $li.append($img);
      });

      this.$collections.append($el);
    },

    sortAlphabetically: function(collection, key) {
      collection.sort(function(a, b){
       var valA = a[key].toLowerCase(),
           valB = b[key].toLowerCase();

        if (valA < valB) return -1;
        if (valA > valB) return 1;

        return 0;
      });
    }
  }

  app.init();

});
