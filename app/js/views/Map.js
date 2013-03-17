var Map = Backbone.View.extend({

  id: 'map',

  width: 1000,
  height: 750,
  maxScale: 4,
  scaleIncrement: 0.75,
  currentScale: 1,
  currentTranslate: [0, 0],

  initialize: function() {
    // listen for global dispatched events
    Backbone.on('/search',        _.bind(this.onSearch, this));
    Backbone.on('/search/cancel', _.bind(this.onSearchCancelled, this));
    Backbone.on('/zoom/recenter', _.bind(this.onZoomRecenter, this));
    Backbone.on('/zoom/in',       _.bind(this.onZoomIn, this));
    Backbone.on('/zoom/out',      _.bind(this.onZoomOut, this));

    this.zoom = d3.behavior.zoom()
      .scaleExtent([1, this.maxScale]);

    this.redrawPopovers = _.debounce(function () {
      this.$('#ConferenceRooms path[hover=1], #ConferenceRooms path[search=1]').popover('show');
    }, 200);
  },

  onZoomRecenter: function() {
    this.currentScale = 1;
    this.currentTranslate = [0, 0];
    this.rescale();
  },

  onZoomIn: function() {
    this.currentScale = Math.min(this.maxScale, this.currentScale + this.scaleIncrement);

    // TBD - fix translation points
    var newX = (this.width-(this.width * this.currentScale)) / 2;
    var newY = (this.height-(this.height * this.currentScale)) / 2;
    this.currentTranslate = [newX, newY];
    this.rescale();
  },

  onZoomOut: function() {
    this.currentScale = Math.max(1, this.currentScale - this.scaleIncrement);
    
    // TBD - fix translation points
    var newX = (this.width-(this.width * this.currentScale)) / 2;
    var newY = (this.height-(this.height * this.currentScale)) / 2;
    this.currentTranslate = [newX, newY];
    this.rescale();
  },

  onSearch: function(term) {
    // TBD - remove only the differences to reduce dom manipulations
    this.onSearchCancelled();

    if (term && term.length > 0) {    
      this.$rooms.filter(function() {
        var name = $(this).data('name');
        return (name && name.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      }).attr('search', 1).css('fill', '#4183C4').popover('show');
    }
  },

  onSearchCancelled: function() {
    $('.popover').remove();
    this.$rooms.removeAttr('style').removeAttr('search');
  },

  render: function() {
    // load the svg
    d3.xml(this.options.svgURL, "image/svg+xml", _.bind(this.onSVGLoaded, this));

    return this;
  },

  onSVGLoaded: function(xml) {
      
    // create the xml node representation
    var importedNode = document.importNode(xml.documentElement, true);
    this.el.appendChild(importedNode);

    // resize to fit container
    d3.select('svg')
      .attr("width", this.width)
      .attr("height", this.height)
      .call(this.zoom.on("zoom", _.bind(this.determineRescale, this))); // zoom/pan handler

    this.$('#Walls *, #Desks *').attr('stroke-width', 2);
    this.$('#People *').attr('fill', '#fff');

    // iterate over all rooms & people
    this.$rooms = this.$('#ConferenceRooms path, #People *');
    this.$rooms.each(function(index, node) {
      var $node = $(node);

      // add hover popovers
      $node.popover({
        title: $node.attr('data-name'),
        trigger: 'manual',
        placement: 'top', 
        container: '#map'
      });        

      // add hover/click handlers
      $node.on('mouseover', function() {
        $node.attr('hover', 1).popover('show');
      })
      $node.on('mouseout', function() {
        $node.attr('hover', 0).popover('hide');
      });
    });
  },

  determineRescale: function() {
    if (this.currentScale != d3.event.scale 
        || this.currentTranslate[0] != d3.event.translate[0] 
        || this.currentTranslate[1] != d3.event.translate[1]) {
      this.currentScale = d3.event.scale;
      this.currentTranslate = d3.event.translate;
      this.rescale();
    }
  },

  rescale: function() {
    // hide all current popovers
    $('.popover').remove();

    // update the zoom's internal values
    this.zoom.scale(this.currentScale).translate(this.currentTranslate);

    // magnification + transitions
    d3.select("#Content").attr("transform", "translate(" + this.currentTranslate + ")" + " scale(" + this.currentScale + ")");

    this.redrawPopovers();
  },

});