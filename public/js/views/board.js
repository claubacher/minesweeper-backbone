var BoardView = Backbone.View.extend({
  el: '.board',

  events: {
    'click #reset-board': 'resetBoard'
  },
  
  resetBoard: function() {
    this.board.reset();

    this.numRows = +$('#numRows').val();
    this.numCols = +$('#numCols').val();
    this.numBombs = Math.floor(this.numRows * this.numCols / 4);

    this.render();
  },

  initialize: function() {
    this.board = new Board();
    this.numRows = 6;
    this.numCols = 6;
    this.numBombs = 12;
    this.render();
  },

  render: function() {
    this.$el.find('.cells').empty();
    this.$el.find('.cells').css({ height: this.numRows * 50,
                                  width: this.numCols * 50 });

    for (var i = 0, len = this.numRows * this.numCols; i < len; i++) {
      var cell = new Cell({ id: i })
      this.board.add(cell);
    }

    this.board.each(this.addCellView, this);
    this.setBombs(this.numBombs);
    this.assignNeighbors();
    this.listenTo(this.board, 'change:isRevealed', this.checkForWin);
    this.listenToOnce(this.board, 'gameOver', this.gameOver);
  },

  addCellView: function(cell) {
    var cellView = new CellView({ model: cell });

    cellView.$el.css({ height: this.$el.find('.cells').height() / this.numRows,
                       width: this.$el.find('.cells').width() / this.numCols });

    this.listenToOnce(cellView, 'clickedOnZero', this.revealMore);

    cellView.listenToOnce(this.board, 'gameOver', cellView.disableClick);
    
    this.$el.find('.cells').append( cellView.render().el );
  },

  setBombs: function(numBombs) {
    for (var i = 0; i < numBombs; i++) {
      var cell = this.randomCell();
      while (cell.isBomb()) cell = this.randomCell();
      cell.plantBomb();
    }
  },

  randomCell: function() {
    var rand = Math.floor( Math.random() * this.board.size() );
    return this.board.at(rand);
  },

  assignNeighbors: function() {
    this.board.each(function (cell) {
      cell.neighbors = this.neighbors(cell);
    }, this);
  },

  neighbors: function(cell) {
    return this.neighborCoords(cell.id).map(function (coords) {
      var id = coords.row * this.numCols + coords.col;
      return this.board.at(id);
    }, this);
  },

  neighborCoords: function(id) {
    var row = Math.floor(id / this.numCols)
      , col = id % this.numCols 
      , maxRows = this.numRows - 1
      , maxCols = this.numCols - 1
      , nCoords = [ { row: row - 1, col: col - 1 }
                  , { row: row - 1, col: col     }
                  , { row: row - 1, col: col + 1 }
                  , { row: row    , col: col - 1 }
                  , { row: row    , col: col + 1 }
                  , { row: row + 1, col: col - 1 }
                  , { row: row + 1, col: col     }
                  , { row: row + 1, col: col + 1 } ];

    return _.reject(nCoords, function (coords) {
      return coords.row < 0 || coords.row > maxRows || coords.col < 0 || coords.col > maxCols;
    });
  },

  gameOver: function() {
    this.stopListening(this.board);

    this.board.each(function (cell) {
      cell.reveal();
    });

    this.appendMsg('BOOM! Sorry, you lose.', 'lose');
  },

  checkForWin: function() {
    if (this.hasWon()) this.appendMsg('You win!', 'win');
  },

  hasWon: function() {
    var notBombs = this.board.filter(function (cell) {
      return !cell.isBomb();
    })
    
    return _.every(notBombs, function (cell) {
      return cell.isRevealed();
    });
  },

  appendMsg: function(msg, type) {
    this.$el.append( '<div class="msg ' + type  + '">' + msg + '</div>' );
  }
});
