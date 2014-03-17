var Cell = Backbone.Model.extend({

  defaults: {
    isBomb: false,
    isRevealed: false,
    isFlagged: false
  },

  isBomb: function() {
    return this.get('isBomb');
  },

  plantBomb: function() {
    this.set('isBomb', true);
  },

  isRevealed: function() {
    return this.get('isRevealed');
  },

  reveal: function() {
    this.set('isRevealed', true);
  },

  isFlagged: function() {
    return this.get('isFlagged');
  },

  toggleFlag: function() {
    if (!this.isRevealed()) this.set('isFlagged', !this.get('isFlagged'));
  },

  numAdjBombs: function() {
    return this.neighbors.reduce(function (sum, neighbor) {
      return sum + (neighbor.isBomb() ? 1 : 0);
    }, 0);
  },

  isZero: function() {
    return this.numAdjBombs() === 0;
  }

});
