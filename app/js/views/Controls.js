var Controls = Backbone.View.extend({

  id: 'controls',

  events: {
    'click .btn-recenter': "onZoomRecenter",
    'click .btn-zoom-in': "onZoomIn",
    'click .btn-zoom-out': "onZoomOut",
  },

  initialize: function() {
  },

  onZoomRecenter: function(e) {
    e.preventDefault();

    Backbone.Dispatcher.trigger('/zoom/recenter');
  },

  onZoomIn: function(e) {
    e.preventDefault();

    Backbone.Dispatcher.trigger('/zoom/in');
  },

  onZoomOut: function(e) {
    e.preventDefault();

    Backbone.Dispatcher.trigger('/zoom/out');
  },

  render: function() {
    this.$el.html( Mustache.render(this.template) );

    return this;
  },

  template: '\
    <div class="btn-group btn-group-vertical">\
      <a class="btn-zoom-in btn btn-small btn-inverse" href="#"><i class="icon-plus icon-white"></i></a> \
      <a class="btn-zoom-out btn btn-small btn-inverse" href="#"><i class="icon-minus icon-white"></i></a> \
      <a class="btn-recenter btn btn-small btn-inverse" href="#" title="Recenter"><i class="icon-resize-small icon-white"></i></a> \
    </div>',
});