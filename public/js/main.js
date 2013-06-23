$(function() {

  var app = {

    init: function() {
      _.bindAll(this);
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
      this.$albumLists  = $('.collections.album-list');
    },

    bindEls: function() {
      this.$fetchBtn.click(this.fetchCollections);
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
      this.$albumLists.empty();

      $.get('/compare', {
        user1_email: email1,
        user2_email: email2
      }).done(function(data) {
        var collections = data.collections,
            comparedCollections;

        comparedCollections = self.compareCollections(
          collections[email1],
          collections[email2]
        );

        self.$loading.hide();
        self.render(comparedCollections);
        self.$fetchBtn.removeAttr('disabled');
      });
    },

    /**
     * compareCollections adds a "belongsTo" attribute to each
     * collection album so they can be sorted. It returns a master
     * array containing all albums from both collections.
     **/
    compareCollections: function(collection1, collection2) {
      var c1 = collection1, c2 = collection2,
          names1 = _.pluck(c1, 'name'),
          names2 = _.pluck(c2, 'name'),
          allAlbums = [],
          allAlbumsNames = [],
          index;

      _.each(names1, function(name1, i) {
        index = names2.indexOf(name1);

        if (index > -1) {
          c1[i].belongsTo = 'both';
        } else {
          c1[i].belongsTo = 'collection1';
        }

        allAlbums.push(c1[i]);
        allAlbumsNames.push(name1);
      });

      _.each(names2, function(name2, j) {
        index = allAlbumsNames.indexOf(name2);

        if (index === -1) {
          c2[j].belongsTo = 'collection2';
          allAlbums.push(c2[j]);
        }
      });

      return this.sortAlphabetically(allAlbums, 'name');
    },

    sortAlphabetically: function(collection, key) {
      collection.sort(function(a, b){
       var valA = a[key].toLowerCase(),
           valB = b[key].toLowerCase();

        if (valA < valB) return -1;
        if (valA > valB) return 1;

        return 0;
      });
      return collection;
    },

    render: function(comparedCollections) {
      var htmls = {
            'collection1': '',
            'collection2': '',
            'both':        ''
          },
          albumTemplate = Handlebars.templates['album'];

      _.each(comparedCollections, function(album) {
        htmls[album.belongsTo] += albumTemplate(album);
      });

      _.each(htmls, function(listHtml, className) {
        var $el = $('.'+className+' ul');
        $el.html(listHtml);
      });
    }

  }

  app.init();

});
