function Player (icon, order) {
    this.icon = icon;
    this.order = order;
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
}

var player1 = new Player('close', 1);
var player2 = new Player('panorama_fish_eye', 2);
var game = new Game(player1, player2);

$(function() {
    $('.tic-tac-cell').click(function() {
        var move = $(this).data('pos');

        if (game.state === 'play' && game.checkAvailable(move)) {
            game.takeTurn(move);
            $(this).html('<i class="material-icons player-move">' + game.turnPlayer.icon + '</i>');

            if (game.checkWin()) {
                game.state = 'win';
                console.log(game.turnPlayer + ' wins!');
            }

            if (game.state === 'play') {
                game.nextTurn();
            }
        } else {
            console.log('Space Already Taken');
        }
    });
});
