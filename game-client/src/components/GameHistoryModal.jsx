import React from 'react';
import { Modal, Header, Icon, Table, Loader, Message, Button } from 'semantic-ui-react';

const API_URL = process.env.REACT_APP_API_URL;

function getScoreInfo(score) {
	if (score === 5) return { icon: 'trophy',        color: 'yellow', label: 'Genius!' };
	if (score === 3) return { icon: 'star',          color: 'yellow', label: 'Pretty Smart!' };
	if (score === 1) return { icon: 'thumbs up',     color: 'blue',   label: 'Not So Bad!' };
	return                  { icon: 'frown outline', color: 'grey',   label: 'Keep Practicing!' };
}

function formatDate(dateStr) {
	const d = new Date(dateStr);
	return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

class GameHistoryModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: 'history',
			history: [],
			leaderboard: [],
			loadingHistory: false,
			loadingLeaderboard: false,
			errorHistory: '',
			errorLeaderboard: '',
		};
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.open && this.props.open) {
			this.setState({ tab: 'history' });
			this.fetchHistory();
			this.fetchLeaderboard();
		}
	}

	async fetchHistory() {
		const { userId } = this.props;
		if (!userId) return;
		this.setState({ loadingHistory: true, errorHistory: '', history: [] });
		try {
			const response = await fetch(`${API_URL}/api/gamehistory/${userId}`);
			if (!response.ok) {
				this.setState({ errorHistory: 'Could not load game history.', loadingHistory: false });
				return;
			}
			const history = await response.json();
			this.setState({ history, loadingHistory: false });
		} catch {
			this.setState({ errorHistory: 'Could not reach the server.', loadingHistory: false });
		}
	}

	async fetchLeaderboard() {
		this.setState({ loadingLeaderboard: true, errorLeaderboard: '', leaderboard: [] });
		try {
			const response = await fetch(`${API_URL}/api/leaderboard`);
			if (!response.ok) {
				this.setState({ errorLeaderboard: 'Could not load leaderboard.', loadingLeaderboard: false });
				return;
			}
			const leaderboard = await response.json();
			this.setState({ leaderboard, loadingLeaderboard: false });
		} catch {
			this.setState({ errorLeaderboard: 'Could not reach the server.', loadingLeaderboard: false });
		}
	}

	renderHistoryTab() {
		const { history, loadingHistory, errorHistory } = this.state;
		if (loadingHistory) return <Loader active inline="centered" style={{ margin: '30px auto', display: 'block' }} />;
		if (errorHistory) return <Message negative>{errorHistory}</Message>;
		if (history.length === 0) return (
			<p style={{ color: '#a8d4ff', textAlign: 'center', margin: '24px 0' }}>No games played yet. Get out there!</p>
		);
		return (
			<>
				{/* Desktop table */}
				<Table inverted celled className="history-desktop-table" style={{ background: 'transparent' }}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Date</Table.HeaderCell>
							<Table.HeaderCell>Score</Table.HeaderCell>
							<Table.HeaderCell>Result</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{history.map(entry => {
							const { icon, color, label } = getScoreInfo(entry.score);
							return (
								<Table.Row key={entry.gameHistoryId}>
									<Table.Cell>{formatDate(entry.date)}</Table.Cell>
									<Table.Cell style={{ color: '#ffe066', fontWeight: 800 }}>{entry.score} pts</Table.Cell>
									<Table.Cell><Icon name={icon} color={color} />{label}</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
				{/* Mobile cards */}
				<div className="history-cards">
					{history.map(entry => {
						const { icon, color, label } = getScoreInfo(entry.score);
						return (
							<div key={entry.gameHistoryId} className="history-card">
								<span className="history-card-date">{formatDate(entry.date)}</span>
								<span className="history-card-result">
									<Icon name={icon} color={color} />{label}
								</span>
								<span className="history-card-score">{entry.score} pts</span>
							</div>
						);
					})}
				</div>
			</>
		);
	}

	renderLeaderboardTab() {
		const { leaderboard, loadingLeaderboard, errorLeaderboard } = this.state;
		const { userId } = this.props;

		if (loadingLeaderboard) return <Loader active inline="centered" style={{ margin: '30px auto', display: 'block' }} />;
		if (errorLeaderboard) return <Message negative>{errorLeaderboard}</Message>;
		if (leaderboard.length === 0) return (
			<p style={{ color: '#a8d4ff', textAlign: 'center', margin: '24px 0' }}>No scores yet. Be the first!</p>
		);

		const medals = ['🥇', '🥈', '🥉'];

		return (
			<>
				{/* Desktop table */}
				<Table inverted celled className="history-desktop-table" style={{ background: 'transparent' }}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell style={{ width: '40px' }}>#</Table.HeaderCell>
							<Table.HeaderCell>Player</Table.HeaderCell>
							<Table.HeaderCell><Icon name="trophy" color="yellow" />Genius</Table.HeaderCell>
							<Table.HeaderCell>Games</Table.HeaderCell>
							<Table.HeaderCell>Best</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{leaderboard.map((entry, idx) => {
							const isMe = entry.userId === userId;
							return (
								<Table.Row key={entry.userId} style={isMe ? { background: 'rgba(74, 144, 217, 0.15)' } : undefined}>
									<Table.Cell style={{ color: '#a8d4ff', textAlign: 'center' }}>
										{idx < 3 ? medals[idx] : idx + 1}
									</Table.Cell>
									<Table.Cell style={isMe ? { color: '#ffe066', fontWeight: 800 } : undefined}>
										{entry.userName}{isMe && <span style={{ color: '#a8d4ff', fontWeight: 400, fontSize: '0.8em', marginLeft: 6 }}>(you)</span>}
									</Table.Cell>
									<Table.Cell style={{ color: '#ffe066', fontWeight: 800, textAlign: 'center' }}>{entry.geniusCount}</Table.Cell>
									<Table.Cell style={{ color: '#cce4ff', textAlign: 'center' }}>{entry.totalGames}</Table.Cell>
									<Table.Cell style={{ textAlign: 'center' }}>
										{entry.bestScore != null ? (
											<><Icon name={getScoreInfo(entry.bestScore).icon} color={getScoreInfo(entry.bestScore).color} />{entry.bestScore} pts</>
										) : '—'}
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
				{/* Mobile cards */}
				<div className="history-cards">
					{leaderboard.map((entry, idx) => {
						const isMe = entry.userId === userId;
						return (
							<div key={entry.userId} className={`leaderboard-card${isMe ? ' is-me' : ''}`}>
								<div className="leaderboard-card-top">
									<span className="leaderboard-card-rank">{idx < 3 ? medals[idx] : idx + 1}</span>
									<span className="leaderboard-card-name">
										{entry.userName}
										{isMe && <span className="leaderboard-card-you">(you)</span>}
									</span>
								</div>
								<div className="leaderboard-card-stats">
									<span><Icon name="trophy" color="yellow" />{entry.geniusCount} genius</span>
									<span style={{ color: '#a8d4ff' }}>{entry.totalGames} games</span>
									<span>
										{entry.bestScore != null
											? <><Icon name={getScoreInfo(entry.bestScore).icon} color={getScoreInfo(entry.bestScore).color} />{entry.bestScore} pts</>
											: '—'}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</>
		);
	}

	render() {
		const { open, onClose, playerName } = this.props;
		const { tab } = this.state;

		return (
			<Modal open={open} onClose={onClose} size="small" className="history-modal">
				<Header icon={tab === 'history' ? 'history' : 'chart bar'} content={tab === 'history' ? `${playerName}'s History` : 'Leaderboard'} />
				<Modal.Content style={{ padding: '0' }}>
					<div className="history-tab-bar">
						<button
							className={`history-tab-btn${tab === 'history' ? ' active' : ''}`}
							onClick={() => this.setState({ tab: 'history' })}
						>
							<Icon name="history" />My History
						</button>
						<button
							className={`history-tab-btn${tab === 'leaderboard' ? ' active' : ''}`}
							onClick={() => this.setState({ tab: 'leaderboard' })}
						>
							<Icon name="chart bar" />Leaderboard
						</button>
					</div>
					<div style={{ padding: '20px 24px' }}>
						{tab === 'history' ? this.renderHistoryTab() : this.renderLeaderboardTab()}
					</div>
				</Modal.Content>
				<Modal.Actions>
					<Button primary onClick={onClose}>Close</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

export default GameHistoryModal;
