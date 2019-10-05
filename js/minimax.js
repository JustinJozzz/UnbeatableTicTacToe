function TreeNode (board, nextPlayerId, moves) {
    var _this = this;

    this.board = $.extend(true, [], board);
    this.nextPlayerId = nextPlayerId;
    this.moves = moves;
    this.value = 0;
    this.win = false;
    this.tie = false;
    this.children = [];

    this.getOpenMoves = function() {
        var rslt = [];

        for (var i = 0; i < _this.board.length; i++) {
            for (var j = 0; j < _this.board[i].length; j++) {
                if (_this.board[i][j] === -1) {
                    rslt.push([i,j]);
                }
            }
        }

        return rslt;
    }

    this.addMove = function(row, col, id, cpuId) {
        _this.board[row][col] = id;
        _this.moves++;
        _this.lastMove = [row, col];

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
            _this.value = (cpuId === id) ? 1 : -1;
        } else if (_this.moves === 9) {
            _this.tie = true;
        }
    }
}

function MiniMax (game) {
    var _this = this;

    this.buildTree = function(game) {
        var root = new TreeNode(game.board.board, game.turnPlayer.id, game.board.moves);
        var parentStack = [ root ];
        var childStack = [];

        while (parentStack.length !== 0) {
            childStack.push(parentStack.pop());
            if (!childStack[childStack.length - 1].win && !childStack[childStack.length - 1].tie) {
                var moves = childStack[childStack.length - 1].getOpenMoves()
                for (var i = 0; i < moves.length; i++) {
                    var newNode = new TreeNode(childStack[childStack.length - 1].board, childStack[childStack.length - 1].nextPlayerId, childStack[childStack.length - 1].moves);
                    newNode.addMove(moves[i][0], moves[i][1], newNode.nextPlayerId, game.player2.id);
                    if (newNode.nextPlayerId === game.player1.id) {
                        newNode.nextPlayerId = game.player2.id;
                    } else {
                        newNode.nextPlayerId = game.player1.id;
                    }

                    childStack[childStack.length - 1].children.push(newNode);
                    parentStack.push(newNode);
                }
            }

        }

        while (childStack.length !== 0) {
            var currNode = childStack.pop();
            if (!currNode.tie && !currNode.win) {
                for (var i = 0; i < currNode.children.length; i++) {
                    currNode.value += currNode.children[i].value;
                }
            }
        }

        return root;
    }

    this.tree = _this.buildTree(game);

    this.getNextMove = function() {
        var minIndex = -1;
        var minValue = 9999999999;
        for (var i = 0; i < this.tree.children.length; i++) {
            if (this.tree.children[i].value < minValue) {
                minValue = this.tree.children[i].value;
                minIndex = i;
            }
        }

        return this.tree.children[minIndex].lastMove;
    }
}
