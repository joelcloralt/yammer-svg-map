var Header = Backbone.View.extend({

  el: '#header',

  events: {
    "keyup .navbar-search input[type=text]": "onKeyUp"
  },

  onKeyUp: function(e) {

    // esc
    if (e.keyCode == 27) {
      this.$searchInput.blur();
      this.$searchInput.val('');
      Backbone.trigger('/search/cancel');
      return;
    }

    Backbone.trigger('/search', $.trim(this.$searchInput.val()));
  },

  render: function() {
    var bookmarkletCode = 'javascript:void((function(){yam.publish("/ui/lightbox/open", [{html: \'<iframe id="conferenceRoomView" src="http://chennney.github.com/yammer-svg-map/app/" style="width: 1200px; height: 800px;">\'}]);})());';

    this.$el.html( Mustache.render(this.template, {bookmarkletCode: bookmarkletCode}) );

    this.$searchInput = this.$('.navbar-search input[type=text]');

    return this;
  },

  template: '\
    <div class="navbar navbar-inverse navbar-fixed-top">\
      <div class="navbar-inner">\
        <div class="container">\
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
          </a>\
          <a class="brand" onclick="alert(\'Drag me to the bookmarks bar!\'); return false;" href="{{bookmarkletCode}}">Yammer SVG Map</a>\
          <div class="nav-collapse collapse">\
            <div style="display: inline-block;" class="pull-right">\
              <form class="navbar-search pull-right">\
                <input type="text" class="search-query" placeholder="Search">\
              </form>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>',
});