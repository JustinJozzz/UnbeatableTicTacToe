# Introduction
This repository is a website created using HTML, CSS, and Javascript (with jQuery). The purpose is to create an unbeatable tic-tac-toe game where users play against their computer (CPU), and the CPU is incapable of losing. A demo of this website can be found at [justinjozzz.github.io/UnbeatableTicTacToe](https://justinjozzz.github.io/UnbeatableTicTacToe/). The algorithm used to calculate the CPU's next move is [Minimax](https://en.wikipedia.org/wiki/Minimax). 

# Minimax Implementation

The [minimax.js](https://github.com/JustinJozzz/UnbeatableTicTacToe/blob/master/js/minimax.js) file is a pure javascript implementation of minimax (it does use jQuery to make deep copies of objects). The work of constructing the full game tree takes place in the [miniMax.buildTree](https://github.com/JustinJozzz/UnbeatableTicTacToe/blob/a5ee9986cb3f51b7e49840867fb6710688bd80bb/js/minimax.js#L79) function. The function starts with a root node, which represents an empty board state. From here it creates new tree nodes that represent each possible board state in the game.

```javascript
function TreeNode (board, nextPlayerId, moves) {
    this.board = $.extend(true, [], board);
    this.nextPlayerId = nextPlayerId;
    this.moves = moves;
    this.value = 0;
    this.win = false;
    this.tie = false;
    this.children = [];
    ...
```

The above code snippet shows what the tree nodes look like and how they are able to represent a board state, using a 2d array. As each move is added to the board, The [TreeNode.addMove](https://github.com/JustinJozzz/UnbeatableTicTacToe/blob/a5ee9986cb3f51b7e49840867fb6710688bd80bb/js/minimax.js#L26-L79) function determines if the board has reached a state of win or tie. Once each node has reached a state of win or tie, the buildTree function has reached the bottom of the tree nodes and it is ready to calculate their values and connect them. 

As the build tree function is creating possible board states, it is also pushing the nodes onto a stack in preperation for a [postorder traversal](https://en.wikipedia.org/wiki/Tree_traversal#Post-order_(LRN)). Post order traversal is necessary in this case because a node's value is chosen based on the values of its children. 

At the leaf nodes of the tree, a win for the CPU is assigned a value of 100 minus the number of moves it took to reach this conclusion, and a win for the player is assigned a value of -100 plus the number of moves it took to reach this conclusion. A tie results in a value of 0.

```javascript
if (_this.win) {
    _this.value = (cpuId === id) ? 100  _this.moves : -100 + _this.moves;
} else if (_this.moves === 9) {
    _this.tie = true;
}
```

Wins by the CPU are a positive value because they are our desired outcome, while wins by the player are given a negative value because we want to avoid them. The number of moves are added or substracted from the value so the CPU will favor nodes that allow it to win in less moves. 

Once we know the values of the leaf nodes, we can move up the tree. If a parent node represents the CPU's turn, its value is the maximum value of its child nodes. The highest child node value is the optimal CPU move since it represents the node that has the most winning board states for the CPU.

If a parent node represents the user's turn, we assume that they make the best move possible. Therefore, the value of the parent node becomes the minimum value of it's child nodes. Although we cannot predict the user's moves, we minimize their best outcome by assumming they choose the best possible option.  

Once the tree has been traversed, each node should have a value that represents the number of positive outcomes below it. The CPU player determines its next move by looking at its current location in the game tree and choosing the child node with the highest possible value ([MiniMax.getNextMove](https://github.com/JustinJozzz/UnbeatableTicTacToe/blob/a5ee9986cb3f51b7e49840867fb6710688bd80bb/js/minimax.js#L141)). 

# Future Work
The size of the resulting game tree limits the speed of the algorithm. I do not believe that the size of the tree can be reduced, since values of the child nodes are used to determine the values of the parent nodes; however, operations such as adding the next move and determining if the board state is a win or tie could improve the speed of the algorithm, as they are called on each node in the tree. 

My original intent was to add a visual representation of the game tree so users would be able see their position in the game tree and understand the algorithm. Again, the size of the game tree made it difficult to display using any javascript visualization library that I tried.