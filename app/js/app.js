$(function() {

  // add Dispatcher object to Backbone
  Backbone.Dispatcher = _.extend({}, Backbone.Events);
 
  // add the header to the page
  var header = new Header();
  header.render();

  var map = new Map({svgURL: 'img/floorplan.svg'});
  $('#container').append(map.render().el);

  // add the header to the page
  var controls = new Controls();
  $('#container').append(controls.render().el);

});