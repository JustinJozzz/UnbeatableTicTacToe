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
}

var player1 = new Player('close', 1);
var player2 = new Player('panorama_fish_eye', 2);
var game = new Game(player1, player2);

$(function() {
    $('.tic-tac-cell').click(function() {
        var move = $(this).data('pos');

        if (game.checkAvailable(move)) {
            game.takeTurn(move);
            $(this).html('<i class="material-icons player-move">' + game.turnPlayer.icon + '</i>');

            if (game.state === 'play') {
                game.nextTurn();
            }
        }
    });
});
