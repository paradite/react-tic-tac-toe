import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = props.winningLocation === true ? 'emphasis square' : 'square';
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningLocation = false;
    if (this.props.winningLocations && this.props.winningLocations.includes(i)) {
      winningLocation = true;
    }

    return (
        <Square 
          key={i}
          value={this.props.squares[i]}
          winningLocation={winningLocation}
          onClick={() => this.props.onClick(i)}
        />
      );
  }

  renderRow(row) {
    const rowContent = [0, 1, 2].map((col) => {
      return this.renderSquare(row * 3 + col);
    });
    return (
      <div className="board-row" key={row}>
        {rowContent}
      </div>
    );
  }

  renderBoard() {
    return [0, 1, 2].map((i) => {return (this.renderRow(i));});
  }

  render() {
    const board = this.renderBoard();
    return (
      <div>
        {board}
      </div>
      );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const { winner, } = calculateWinner(squares);

    if (winner || squares[i] === 'X' || squares[i] === 'O') {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i
      }]),
      stepNumber: history.length, // old history reference, length = index of newly inserted step
      xIsNext: !this.state.xIsNext
    });
  }

  toggleOrder() {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext : (step % 2) ? false : true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, winningLocations } = calculateWinner(current.squares);
    const orderToggleText = this.state.ascendingOrder ? 'Ascending' : 'Descending';

    const moves = history.map((step, move) => {
      const desc = move ?
        '#' + move + ': ' + getDisplayedLocation(step.location):
        '#0 Game start';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'emphasis' : ''}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
        );
    });

    const sortedMoves = this.state.ascendingOrder ? 
      moves :
      moves.reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningLocations={winningLocations}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleOrder()}>{orderToggleText}</button>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getDisplayedLocation(i) {
  return '(' + (Math.floor(i / 3) + 1) + ', '  + ((i % 3) + 1) + ')';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLocations: [a, b, c] };
    }
  }
  return { winner: null, winningLocations: null };
}