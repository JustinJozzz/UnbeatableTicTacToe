function Player (id, name, icon, order) {
    this.id = id;
    this.icon = icon;
    this.order = order;
    this.name = name;
}

function Board (playerId, cpuId) {
    var _this = this;

    this.board = [
        [-1,-1,-1],
        [-1,-1,-1],
        [-1,-1,-1]
    ];
    this.win = false;
    this.tie = false;
    this.value = 0;
    this.moves = 0;
    this.playerId = playerId;
    this.cpuId = cpuId;

    this.checkAvailable = function(row, col) {
        if (_this.board[row][col] === -1) {
            return true;
        } else {
            return false;
        }
    }

    this.addMove = function(row, col, id) {
        _this.board[row][col] = id;
        _this.moves++;

        if (_this.moves >= 5) {
            // check rows
            if (row === 0) {
                _this.win = _this.board[row+1][col] === id && _this.board[row+2][col] === id;
            } else if (row === 1) {
                _this.win = _this.board[row-1][col] === id && _this.board[row+1][col] === id;
            } else if (row === 2) {
                _this.win = _this.board[row-1][col] === id && _this.board[row-2][col] === id;
            }

            // check columns
            if (!_this.win) {
                if (col === 0) {
                    _this.win = _this.board[row][col+1] === id && _this.board[row][col+2] === id;
                } else if (col === 1) {
                    _this.win = _this.board[row][col-1] === id && _this.board[row][col+1] === id;
                } else if (col === 2) {
                    _this.win = _this.board[row][col-1] === id && _this.board[row][col-2] === id;
                }
            }

            // check diagonals
            if (!_this.win && _this.board[1][1] === id) {
                if (row === 0 && col === 0) {
                    _this.win = _this.board[row+2][col+2] === id;
                } else if (row === 0 && col === 2) {
                    _this.win = _this.board[row+2][col-2] === id;
                } else if (row === 1 && col === 1) {
                    _this.win = (_this.board[row-1][col-1] === id && _this.board[row+1][col+1] === id) || (_this.board[row-1][col+1] === id && _this.board[row+1][col-1] === id);
                } else if (row === 2 && col === 0) {
                    _this.win = _this.board[row-2][col+2] === id;
                } else if (row === 2 && col === 2) {
                    _this.win = _this.board[row-2][col-2] === id;
                }
            }
        }

        if (_this.win) {
            _this.value = (_this.cpuId === id) ? 1 : -1;
        } else if (_this.moves === 9) {
            _this.tie = true;
        }
    }
}

function Game (player1, player2, board) {
    var _this = this;

    this.turnPlayer = (player1.order < player2.order) ? player1 : player2;
    this.player1 = player1;
    this.player2 = player2;
    this.board = board;
    this.state = 'play';

    this.nextTurn = function () {
        if (_this.turnPlayer === _this.player1) {
            _this.turnPlayer = player2;
        } else {
            _this.turnPlayer = player1;
        }
    }

    this.takeTurn = function (move) {
        _this.board.addMove(move[0], move[1], _this.turnPlayer.id);
    }

    this.reset = function () {
        _this.state = 'play';
        _this.turnPlayer = (player1.order < player2.order) ? player1 : player2;
        _this.board = new Board(_this.player1.id, _this.player2.id);
    }

    this.checkAvailable = function (move) {
        return _this.board.checkAvailable(move[0], move[1]);
    }

    this.checkWin = function () {
       return _this.board.win;
    }

    this.checkTie = function () {
        return _this.board.tie;
    }
}

function updateBoard(move, element) {
    if (game.state === 'play') {
        if (game.checkAvailable(move)) {
            game.takeTurn(move);
            miniMax.moveToNode(move);
            $(element).html('<i class="material-icons player-move">' + game.turnPlayer.icon + '</i>');

            if (game.checkWin()) {
                game.state = 'over';
                $('#game-message').html('<span class="green-text accent-3">' + game.turnPlayer.name + ' wins!</span>')
            } else if (game.checkTie()) {
                game.state = 'over';
                $('#game-message').html('<span class="light-blue-text accent-4">It\'s a tie!</span>');
            }

            if (game.state === 'play') {
                game.nextTurn();
                $('#game-message').text('');
            } else {
                $('#reset').removeClass('hide');
                $('#reset').addClass('show');
                $('#new-game').removeClass('hide');
                $('#new-game').addClass('show');

            }
        } else {
            $('#game-message').html('<span class="yellow-text accent-4">Space already occupied!</span>')
        }
    }
}

var player1;
var player2;
var board;
var game;
var miniMax;
var clickEventsSet = false;
var modalOptions = {
    onCloseEnd: function() {
        var second = $('#order').prop('checked');
        player1 = new Player(1, $('#playerName').val(), 'close', (second) ? 2 : 1);
        player2 = new Player(2, 'CPU', 'panorama_fish_eye', (second) ? 1 : 2);
        board = new Board(player1.id, player2.id);
        game = new Game(player1, player2, board);
        miniMax = new MiniMax(game);

        if (!clickEventsSet) {
            $('.tic-tac-cell').click(function() {
                var _this = this;
                var move = $(_this).data('pos');
                updateBoard(move, _this);

                if (game.state === 'play' && game.turnPlayer.id === 2) {
                    var cpuMove = miniMax.getNextMove();
                    var targetElement = 'td[data-pos="[' + cpuMove + ']"]';
                    updateBoard(cpuMove, targetElement);
                }
            });

            $('#reset').click(function () {
                game.reset();
                miniMax.reset();
                $('.tic-tac-board td').html('');
                $('#game-message').text('');
                $('#reset').addClass('hide');
                $('#reset').removeClass('show');
                $('#new-game').addClass('hide');
                $('#new-game').removeClass('show');
                if (game.turnPlayer.id === 2) {
                    var cpuMove = miniMax.getNextMove();
                    var targetElement = 'td[data-pos="[' + cpuMove + ']"]';
                    updateBoard(cpuMove, targetElement);
                }
            });

            $('#new-game').click(function () {
                $('.modal').modal('open');
                $('#preloader-overlay,#preloader').show();
                $('.tic-tac-board td').html('');
                $('#game-message').text('');
                $('#reset').addClass('hide');
                $('#reset').removeClass('show');
                $('#new-game').addClass('hide');
                $('#new-game').removeClass('show');
            });
            clickEventsSet = true;
        }

        $('#preloader-overlay,#preloader').hide();

        if (game.turnPlayer.id === 2) {
            var cpuMove = miniMax.getNextMove();
            var targetElement = 'td[data-pos="[' + cpuMove + ']"]';
            updateBoard(cpuMove, targetElement);
        }
    }
};



$(function() {
    $('.modal').modal(modalOptions);
    $('.modal').modal('open');
    $('#playerName').val('Player1');
    M.updateTextFields();
    $('#preloader-overlay,#preloader').show();
});
