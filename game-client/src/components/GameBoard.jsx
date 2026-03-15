import React from 'react';

const PEG_COLORS = [
	null,
	{ light: '#ff9977', mid: '#cc2200', dark: '#881100', s1: '#882200', s2: '#661100' }, // red
	{ light: '#ffee55', mid: '#ccaa00', dark: '#886600', s1: '#887700', s2: '#665500' }, // yellow
	{ light: '#5599ff', mid: '#1155cc', dark: '#003388', s1: '#004499', s2: '#003377' }, // blue
	{ light: '#55dd66', mid: '#228833', dark: '#115511', s1: '#226633', s2: '#114411' }, // green
	{ light: '#ffaa55', mid: '#dd6600', dark: '#883300', s1: '#994400', s2: '#773300' }, // orange
	{ light: '#cc77ee', mid: '#8822aa', dark: '#441166', s1: '#661188', s2: '#440066' }, // purple
];

const triangleBase = 660;
const triangleHeight = 572;
const pegDiameter = 66;

// Natural width of the board including the shadow triangle2 (695px wide)
const BOARD_NATURAL_WIDTH = 695;

// Returns the pixel center of a hole within the .pegs container coordinate space
function getPegPosition(holeIndex) {
	const rowHeight = triangleHeight / 5 - 5;
	let row = 0, col = 0, count = 0;
	outer: for (let i = 0; i <= 4; i++) {
		for (let j = 0; j <= i; j++) {
			if (count === holeIndex) { row = i; col = j; break outer; }
			count++;
		}
	}
	const rowPadding = (triangleBase / 2) - (pegDiameter * (row + 1) / 2) - (pegDiameter * row / 2);
	const cellwidth = (pegDiameter * (2 * row + 1)) / (row + 1);
	return {
		x: rowPadding + col * cellwidth + cellwidth / 2,
		y: row * rowHeight + rowHeight / 2,
	};
}

function PegLocation(props) {
	const colorIdx = props.colorIdx;
	const color = PEG_COLORS[colorIdx];
	const isHole = props.pegClass === 'empty' || props.pegClass === 'to-selectable';

	const colorVars = (!isHole && color) ? {
		'--peg-light':   color.light,
		'--peg-mid':     color.mid,
		'--peg-dark':    color.dark,
		'--peg-shadow1': color.s1,
		'--peg-shadow2': color.s2,
	} : {};

	return (
		<button
			id="peg-location"
			className={props.pegClass}
			style={colorVars}
			onClick={props.onClick.bind(this, props.pegNum)}
		/>
	);
}

class GameBoard extends React.Component {

	constructor(props) {
		super(props);
		this.state = { wrapperWidth: typeof window !== 'undefined' ? window.innerWidth : 1200 };
		this.wrapperRef = React.createRef();
		this.handleResize = this.handleResize.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize() {
		if (this.wrapperRef.current) {
			this.setState({ wrapperWidth: this.wrapperRef.current.clientWidth });
		}
	}

	render() {
		const selectablePegs = this.props.selectablePegs;
		const selectableHoles = this.props.selectableHoles;
		const pegLocations = this.props.pegLocations;
		const selectedPeg = this.props.selectedPeg;
		const anim = this.props.animatingJump;

		let rows = [];
		let key = 0;

		for (let i = 0; i <= 4; i++) {
			let col = [];
			let rowPadding = (triangleBase / 2) - (pegDiameter * (i + 1) / 2) - (pegDiameter * i / 2);
			let rowWidth = pegDiameter * (i + i + 1);
			let cellwidth = rowWidth / (i + 1);
			let rowHeight = triangleHeight / 5 - 5;

			const rowStyles = {
				marginLeft: rowPadding + 'px',
				height: rowHeight + 'px',
				backgroundColor: "transparent",
				borderBottom: "none",
			};

			for (let j = 0; j <= i; j++) {
				let pegClass = 'peg-location-occupied';

				// During animation, treat from and over positions as empty holes
				const isAnimFrom = anim && key === anim.from;
				const isAnimOver = anim && key === anim.over;

				if (isAnimFrom || isAnimOver) {
					pegClass = 'empty';
				} else if (selectedPeg === null) {
					if (!pegLocations[key])
						pegClass = 'empty';
					else if (selectablePegs[key])
						pegClass = 'from-selectable';
				} else {
					if (selectedPeg === key)
						pegClass = 'from-selected';
					else if (selectableHoles[key])
						pegClass = 'to-selectable';
					else if (!pegLocations[key])
						pegClass = 'empty';
				}

				col.push(
					<div style={{
						borderBottom: "none",
						display: "inline-block",
						height: "100%",
						width: cellwidth + "px",
						textAlign: "center",
						verticalAlign: "middle",
						overflow: "visible",
					}}
					key={key}>
						<PegLocation
							pegClass={pegClass}
							colorIdx={pegLocations[key]}
							pegNum={key}
							onClick={(i) => this.props.onClick(i)}
						/>
					</div>
				);

				key++;
			}

			rows.push(<div style={rowStyles} key={i}>{col}</div>);
		}

		// Render an absolutely-positioned overlay peg that performs the jump animation
		let jumpingPeg = null;
		if (anim) {
			const fromPos = getPegPosition(anim.from);
			const toPos = getPegPosition(anim.to);
			const dx = toPos.x - fromPos.x;
			const dy = toPos.y - fromPos.y;
			const color = PEG_COLORS[pegLocations[anim.from]];
			const colorVars = color ? {
				'--peg-light':   color.light,
				'--peg-mid':     color.mid,
				'--peg-dark':    color.dark,
				'--peg-shadow1': color.s1,
				'--peg-shadow2': color.s2,
				'--jump-dx':     dx + 'px',
				'--jump-dy':     dy + 'px',
			} : {
				'--jump-dx': dx + 'px',
				'--jump-dy': dy + 'px',
			};

			jumpingPeg = (
				<button
					id="peg-location"
					className="peg-jumping"
					style={{
						...colorVars,
						position: 'absolute',
						left: fromPos.x - pegDiameter / 2 + 'px',
						top:  fromPos.y - pegDiameter / 2 + 'px',
						pointerEvents: 'none',
					}}
				/>
			);
		}

		const boardClass = '';

		// Scale the board to fit on small screens.
		// The wrapper is a plain block so CSS margin-collapsing is preserved
		// (prevents the peg/board misalignment that flex would cause).
		// transform-origin is "top center" of the wrapper (100% wide).
		// We also translateX so the board content stays horizontally centered
		// after scaling: tx = (viewportCenter - boardCenter) * scale.
		const { wrapperWidth } = this.state;
		const scale = Math.min(1, (wrapperWidth - 16) / BOARD_NATURAL_WIDTH);
		// zoom scales the element AND its layout dimensions (unlike transform which only
		// affects visual rendering). This means margin: auto centering still works, and
		// there is no whitespace to compensate for below the board.
		const boardStyle = scale < 1 ? { zoom: scale } : {};

		return (
			<div className="board-scale-wrapper" ref={this.wrapperRef}>
				<div id="game-board" className={boardClass} style={boardStyle}>
					<div className="triangle" />
					<div className="triangle2" />
					<div className="pegs">
						{rows}
						{jumpingPeg}
					</div>
				</div>
			</div>
		);
	}
}

export default GameBoard;
