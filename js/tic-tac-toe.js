function Player (name, icon, order) {
    this.icon = icon;
    this.order = order;
    this.name = name;
    this.moves = [];
}

function Game (player1, player2) {
    var _this = this;

    this.turnPlayer = (player1.order < player2.order) ? player1 : player2;
    this.player1 = player1;
    this.player2 = player2;
    this.state = 'play';

    this.nextTurn = function () {
        if (_this.turnPlayer === _this.player1) {
            _this.turnPlayer = player2;
        } else {
            _this.turnPlayer = player1;
        }
    }

    this.takeTurn = function (move) {
        _this.turnPlayer.moves.push(move);
    }

    this.reset = function () {
        _this.player1.moves = [];
        _this.player2.moves = [];
        _this.state = 'play';
    }

    this.checkAvailable = function (move) {
        return _this.player1.moves.indexOf(move) === -1 && _this.player2.moves.indexOf(move) === -1;
    }

    this.checkWin = function () {
        if (_this.turnPlayer.moves.length >= 3) {
            var diag1 = [];
            var diag2 = [];

            for (var i = 0; i <= 2; i++) {
                var row = _this.turnPlayer.moves.filter(function(x) {
                   return x[0] === i;
                });

                var col = _this.turnPlayer.moves.filter(function(x) {
                    return x[1] === i;
                });

                if (row.length === 3 || col.length === 3) {
                    return true;
                }

                if (_this.turnPlayer.moves.filter(function(x) { return x[0] === i && x[1] === i; }).length > 0) {
                    diag1.push(_this.turnPlayer.moves.filter(function(x) { return x[0] === i && x[1] === i; })[0]);
                }

                if (_this.turnPlayer.moves.filter(function(x) { return x[0] === i && x[1] === Math.abs(i-2); }).length > 0) {
                    diag2.push(_this.turnPlayer.moves.filter(function(x) { return x[0] === i && x[1] === Math.abs(i-2); })[0]);
                }
            }

            if (diag1.length === 3 || diag2.length === 3) {
                return true;
            }
        }

        return false;
    }

    this.checkTie = function () {
        return this.turnPlayer.moves.length === 5;
    }
}

var player1 = new Player('Player1', 'close', 1);
var player2 = new Player('CPU', 'panorama_fish_eye', 2);
var game = new Game(player1, player2);

$(function() {
    $('.tic-tac-cell').click(function() {
        var move = $(this).data('pos');

        if (game.state === 'play') {
            if (game.checkAvailable(move)) {
                game.takeTurn(move);
                $(this).html('<i class="material-icons player-move">' + game.turnPlayer.icon + '</i>');

                if (game.checkWin()) {
                    game.state = 'over';
                    $('#game-message').text(game.turnPlayer.name + ' wins!')
                } else if (game.checkTie()) {
                    game.state = 'over';
                    $('#game-message').text('It\'s a tie!');
                }

                if (game.state === 'play') {
                    game.nextTurn();
                    $('#game-message').text('');
                } else {
                    $('#reset').removeClass('hide');
                    $('#reset').addClass('show');
                }
            } else {
                $('#game-message').text('Space already occupied!')
            }
        }
    });

    $('#reset').click(function () {
        game.reset();
        $('.tic-tac-board td').html('');
        $('#game-message').text('');
        $('#reset').addClass('hide');
        $('#reset').removeClass('show');
    });
});
