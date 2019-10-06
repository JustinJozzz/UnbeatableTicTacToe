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
            _this.value = (cpuId === id) ? 100 - _this.moves : -100 + _this.moves;
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
            var maximize = false;
            if (currNode.nextPlayerId === game.player2.id) {
                maximize = true;
            }
            if (!currNode.tie && !currNode.win) {
                if (maximize) {
                    var maxVal = currNode.children[0].value;

                    for (var i = 0; i < currNode.children.length; i++) {
                        if (currNode.children[i].value > maxVal) {
                            maxVal = currNode.children[i].value;
                        }
                    }

                    currNode.value = maxVal;
                } else {
                    var minVal = currNode.children[0].value;

                    for (var i = 0; i < currNode.children.length; i++) {
                        if (currNode.children[i].value < minVal) {
                            minVal = currNode.children[i].value;
                        }
                    }

                    currNode.value = minVal;
                }
            }
        }

        return root;
    }

    this.tree = _this.buildTree(game);
    this.root = _this.tree;

    this.getNextMove = function() {
        var maxIndex = -1;
        var maxValue = -99999999;
        for (var i = 0; i < this.tree.children.length; i++) {
            if (this.tree.children[i].value > maxValue) {
                maxValue = this.tree.children[i].value;
                maxIndex = i;
            }
        }
        return this.tree.children[maxIndex].lastMove;
    }

    this.moveToNode = function(move) {
        for (var i = 0; i < this.tree.children.length; i++) {
            if (this.tree.children[i].lastMove[0] === move[0] && this.tree.children[i].lastMove[1] === move[1]) {
                this.tree = this.tree.children[i];
                break;
            }
        }
    }

    this.reset = function() {
        this.tree = this.root;
    }
}
