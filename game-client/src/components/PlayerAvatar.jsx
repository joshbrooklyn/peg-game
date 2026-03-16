import React from 'react';

class PlayerAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
		this.wrapRef = React.createRef();
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleOutsideClick);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleOutsideClick);
	}

	handleOutsideClick(e) {
		if (this.wrapRef.current && !this.wrapRef.current.contains(e.target)) {
			this.setState({ open: false });
		}
	}

	render() {
		const { playerName, onChangeName } = this.props;
		const { open } = this.state;

		return (
			<div className="player-avatar-wrap" ref={this.wrapRef}>
				<button
					className={`player-avatar-btn${open ? ' open' : ''}`}
					onClick={() => this.setState({ open: !open })}
					aria-label="Player menu"
				>
					<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="2" />
						<circle cx="18" cy="14" r="6" stroke="currentColor" strokeWidth="2" />
						<path d="M6 30c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					</svg>
				</button>
				{open && (
					<div className="player-avatar-dropdown">
						<div className="player-avatar-name">{playerName}</div>
						<button
							className="player-avatar-change"
							onClick={() => { this.setState({ open: false }); onChangeName(); }}
						>
							Change Name
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default PlayerAvatar;
