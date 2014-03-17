var CellView = Backbone.View.extend({

  tagName: 'li',

  className: 'cell',

  events: {
    'click': 'parseClick'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'change:isRevealed', this.reveal);
    this.listenTo(this.model, 'change:isFlagged', this.toggleFlag);
  },

  parseClick: function(e) {
    if (e.shiftKey) this.model.toggleFlag();
    else if (!this.model.isFlagged()) {
      this.disableClick();
      this.reveal();
    }
  },

  disableClick: function() {
    this.$el.off('click');
  },

  toggleFlag: function() {
    this.$el.toggleClass('showing flag');
  },

  reveal: function() {
    this.model.reveal();

    if (this.model.isBomb()) {
      this.$el.addClass('showing bomb');
      this.model.trigger('gameOver');
    } else if (this.model.isZero()) {
      this.$el.addClass('showing zero');
      this.model.neighbors.forEach(function (neighbor) {
        if (!neighbor.isBomb() && !neighbor.isRevealed() && !neighbor.isFlagged()) {
          neighbor.reveal();
        }
      });
    } else {
      this.$el.addClass('showing number');
      this.$el.attr('data-content', this.model.numAdjBombs());
    }
  }
});
