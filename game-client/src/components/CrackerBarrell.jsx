import React from 'react';
//import ReactDOM from 'react-dom';

import GameBoard from './GameBoard';
import MenuBar from './MenuBar';
import GameOverPanel from './GameOverPanel';
import HowToPlayModal from './HowToPlayModal';
import PlayerNameModal from './PlayerNameModal';
import GameHistoryModal from './GameHistoryModal';
import PlayerAvatar from './PlayerAvatar';
import { Container, Header } from 'semantic-ui-react';

const ANIMATION_DURATION = 420; // ms

// Returns the pixel center (x, y) of a hole within the .pegs container coordinate space
function getPegPosition(holeIndex) {
	const pegDiameter = 66;
	const triangleBase = 660;
	const triangleHeight = 572;
	const rowHeight = triangleHeight / 5 - 5; // 99px

	let row = 0, col = 0, count = 0;
	outer: for (let i = 0; i <= 4; i++) {
		for (let j = 0; j <= i; j++) {
			if (count === holeIndex) { row = i; col = j; break outer; }
			count++;
		}
	}

	const rowPadding = (triangleBase / 2) - (pegDiameter * (row + 1) / 2) - (pegDiameter * row / 2);
	const cellwidth = (pegDiameter * (2 * row + 1)) / (row + 1);
	const x = rowPadding + col * cellwidth + cellwidth / 2;
	const y = row * rowHeight + rowHeight / 2;
	return { x, y };
}

export default class CrackerBarrell extends React.Component {
	constructor(props) {
		super(props);

		this.unselectPeg = this.unselectPeg.bind(this);

		let pegLocations = this.getPegLocations(this.props.emptyPeg);
		let selectablePegs = this.getSelectablePegs(pegLocations);

		const savedName = localStorage.getItem('playerName');
		const savedUserId = localStorage.getItem('userId');

		this.state = {
			history: [{
				selectedPeg: null,
				pegLocations: pegLocations,
				selectablePegs: selectablePegs,
				selectableHoles: null,
			}],

			gameOver: false,
			pegsRemaining: null,
			oldGames: null,
			showHelp: false,
			showHistory: false,
			animatingJump: null,
			playerName: savedName || '',
			userId: savedUserId ? parseInt(savedUserId) : null,
			showNameModal: !savedName,
		};
	}

	getPegLocations(emptyPeg) {
		return Array(15).fill(0).map((_, idx) => {
			if (idx === emptyPeg) return 0;
			return Math.floor(Math.random() * 6) + 1;
		});
	}

	getSelectablePegs(pegLocations) {
		return pegLocations.map((hasPeg, idx) => {
			if (hasPeg === 0) return 0;

			const moves = this.props.validMoves[idx];
			let retVal = 0;

			for (let move of moves) {
				if (pegLocations[move[0]] !== 0 && pegLocations[move[1]] === 0)
					retVal = 1;
			}

			return retVal;
		});
	}

	getSelectableHoles(pegLocations, selectedPeg) {
		return pegLocations.map((hasPeg, idx) => {
			if (hasPeg !== 0) return 0;

			const moves = this.props.validMoves[selectedPeg];
			let retVal = 0;

			for (let move of moves) {
				if (move[1] === idx && pegLocations[move[0]] !== 0) retVal = 1;
			}

			return retVal;
		});
	}

	unselectPeg(e) {
		document.removeEventListener('click', this.unselectPeg, false);

		const tmpHistory = this.state.history.slice(0, this.state.history.length - 1);

		if (tmpHistory.length > 0) {
			this.setState({ history: tmpHistory });
		}
	}

	resetGame() {
		const emptyPeg = Math.floor(Math.random() * Math.floor(14));
		const pegLocations = this.getPegLocations(emptyPeg);
		const selectablePegs = this.getSelectablePegs(pegLocations);

		this.setState({
			history: [{
				selectedPeg: null,
				pegLocations: pegLocations,
				selectablePegs: selectablePegs,
				selectableHoles: null,
			}],
			gameOver: false,
			pegsRemaining: null,
			animatingJump: null,
		});
	}

	undoMove(e) {
		e.nativeEvent.stopImmediatePropagation();
		if (this.state.animatingJump) return;

		const selectedPeg = this.state.history[this.state.history.length - 1].selectedPeg;

		if (this.state.gameOver === false) {
			if (selectedPeg == null && this.state.history.length > 2) {
				let tmpHistory = this.state.history.slice(0, this.state.history.length - 2);
				document.removeEventListener('click', this.unselectPeg, false);
				this.setState({ history: tmpHistory });
			} else if (selectedPeg != null && this.state.history.length > 3) {
				let tmpHistory = this.state.history.slice(0, this.state.history.length - 3);
				document.removeEventListener('click', this.unselectPeg, false);
				this.setState({ history: tmpHistory });
			}
		}
	}

	showHelp() {
		this.setState({ showHelp: true });
	}

	hideHelp() {
		this.setState({ showHelp: false });
	}

	showHistory() {
		this.setState({ showHistory: true });
	}

	hideHistory() {
		this.setState({ showHistory: false });
	}

	saveName(name, userId) {
		localStorage.setItem('playerName', name);
		localStorage.setItem('userId', userId);
		this.setState({ playerName: name, userId, showNameModal: false });
	}

	cancelNameModal() {
		this.setState({ showNameModal: false });
	}

	postGameHistory(score) {
		const { userId } = this.state;
		if (!userId) return;
		fetch(`${process.env.REACT_APP_API_URL}/api/gamehistory`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId, score }),
		});
	}

handleClick(i) {
		if (this.state.animatingJump) return;

		let history = this.state.history.slice(0);
		const current = history[history.length - 1];
		let gameOver = this.state.gameOver;

		if (gameOver !== true) {
			const selectedPeg = current.selectedPeg;
			const pegLocations = current.pegLocations.slice(0);
			const selectablePegs = current.selectablePegs.slice(0);
			const validMoves = this.props.validMoves;

			if (selectedPeg === null) {
				// User selected a peg
				if (selectablePegs[i]) {
					document.addEventListener('click', this.unselectPeg, false);
					const selectableHoles = this.getSelectableHoles(pegLocations, i);
					history.push({
						selectedPeg: i,
						pegLocations: pegLocations,
						selectablePegs: selectablePegs,
						selectableHoles: selectableHoles,
					});
					this.setState({ history });
				}
			} else {
				// User selected a destination hole
				const selectableHoles = current.selectableHoles.slice(0);

				if (selectableHoles[i]) {
					const lastMove = validMoves[selectedPeg].filter(move => move[1] === i);
					const jumpedHole = lastMove[0][0];

					// Compute the resulting game state up front
					const newPegLocations = pegLocations.slice(0);
					newPegLocations[jumpedHole] = 0;
					newPegLocations[i] = newPegLocations[selectedPeg];
					newPegLocations[selectedPeg] = 0;

					const newSelectablePegs = this.getSelectablePegs(newPegLocations);

					let newGameOver = false;
					let newPegsRemaining = null;
					if (newSelectablePegs.indexOf(1) === -1) {
						newPegsRemaining = newPegLocations.filter(itm => itm !== 0).length;
						newGameOver = true;
						const score = newPegsRemaining === 1 ? 5 : newPegsRemaining === 2 ? 3 : newPegsRemaining === 3 ? 1 : 0;
						this.postGameHistory(score);
					}

					// Calculate pixel offset for the arc animation
					const fromPos = getPegPosition(selectedPeg);
					const toPos = getPegPosition(i);

					document.removeEventListener('click', this.unselectPeg, false);

					// Start animation — keep current board state visible during animation
					this.setState({
						animatingJump: {
							from: selectedPeg,
							over: jumpedHole,
							to: i,
							dx: toPos.x - fromPos.x,
							dy: toPos.y - fromPos.y,
						}
					});

					// After animation completes, apply the real state update
					setTimeout(() => {
						const latestHistory = this.state.history.slice();
						// Replace the "peg selected" snapshot with the post-jump result
						latestHistory.push({
							selectedPeg: null,
							pegLocations: newPegLocations,
							selectablePegs: newSelectablePegs,
							selectableHoles: null,
						});

						this.setState({
							animatingJump: null,
							history: latestHistory,
							gameOver: newGameOver,
							pegsRemaining: newPegsRemaining,
						});
					}, ANIMATION_DURATION);
				}
			}
		}
	}

	render() {
		const gameOver = this.state.gameOver;
		const pegsRemaining = this.state.pegsRemaining;
		const showHelp = this.state.showHelp;
		const animatingJump = this.state.animatingJump;
		const history = this.state.history;
		const current = history[history.length - 1];
		const selectedPeg = current.selectedPeg;
		const pegLocations = current.pegLocations;
		const selectablePegs = current.selectablePegs;
		const selectableHoles = current.selectableHoles;
		const { playerName, showNameModal } = this.state;

		return (
			<Container>
				{playerName && (
					<div className="player-name-badge">
						<PlayerAvatar playerName={playerName} onChangeName={() => this.setState({ showNameModal: true })} />
					</div>
				)}
				<Header as='h1'>Peg Game</Header>
				<Container className="game-container">
					<MenuBar
						resetGameHandler={this.resetGame.bind(this)}
						undoMoveHandler={this.undoMove.bind(this)}
						showHelpHandler={this.showHelp.bind(this)}
						showHistoryHandler={this.showHistory.bind(this)}
						playerName={playerName}
						onChangeNameHandler={() => this.setState({ showNameModal: true })}
					/>
					<HowToPlayModal
						open={showHelp}
						onClose={this.hideHelp.bind(this)}
					/>
					<PlayerNameModal
						open={showNameModal}
						isFirstVisit={!playerName}
						currentName={playerName}
						onSave={this.saveName.bind(this)}
						onCancel={this.cancelNameModal.bind(this)}
					/>
					<GameHistoryModal
						open={this.state.showHistory}
						onClose={this.hideHistory.bind(this)}
						playerName={playerName}
						userId={this.state.userId}
					/>
					<GameBoard
						pegLocations={pegLocations}
						selectedPeg={selectedPeg}
						selectablePegs={selectablePegs}
						selectableHoles={selectableHoles}
						onClick={(i) => this.handleClick(i)}
						animatingJump={animatingJump}
					/>
					<GameOverPanel
						gameOver={gameOver}
						pegsRemaining={pegsRemaining}
						onNewGame={this.resetGame.bind(this)}
					/>
				</Container>
			</Container>
		);
	}
}
