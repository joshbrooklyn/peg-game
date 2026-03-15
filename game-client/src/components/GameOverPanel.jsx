import React from 'react';
import { Modal, Header, List, Icon, Button } from 'semantic-ui-react';

function getScoreInfo(pegsRemaining) {
	if (pegsRemaining === 1) return { icon: 'trophy',      color: 'yellow', label: 'Genius!',         score: 5 };
	if (pegsRemaining === 2) return { icon: 'star',        color: 'yellow', label: 'Pretty Smart!',   score: 3 };
	if (pegsRemaining === 3) return { icon: 'thumbs up',   color: 'blue',   label: 'Not So Bad!',     score: 1 };
	return                          { icon: 'frown outline', color: 'grey',  label: 'Keep Practicing!', score: 0 };
}

function GameOverPanel(props) {
	if (!props.gameOver) return null;

	const { icon, color, label, score } = getScoreInfo(props.pegsRemaining);

	return (
		<Modal open={props.gameOver} size="small">
			<Header icon={icon} content="Game Over" />
			<Modal.Content>
				<div style={{ textAlign: 'center', marginBottom: '20px' }}>
					<Icon name={icon} color={color} size="huge" />
					<Header as="h2" style={{ color: '#ffe066', fontFamily: "'Fredoka One', cursive", margin: '10px 0 4px' }}>
						{label}
					</Header>
					<p style={{ color: '#a8d4ff', fontSize: '1.05rem', margin: 0 }}>
						You finished with <strong style={{ color: '#ffe066' }}>{props.pegsRemaining}</strong> peg{props.pegsRemaining !== 1 ? 's' : ''} remaining.
					</p>
				</div>

				<Header as="h3">Scoring</Header>
				<List>
					<List.Item><Icon name="trophy"       color="yellow" />1 peg left — Genius! (5 pts)</List.Item>
					<List.Item><Icon name="star"         color="yellow" />2 pegs left — Pretty Smart (3 pts)</List.Item>
					<List.Item><Icon name="thumbs up"    color="blue"   />3 pegs left — Not So Bad (1 pt)</List.Item>
					<List.Item><Icon name="frown outline" color="grey"  />4+ pegs left — Keep Practicing (0 pts)</List.Item>
				</List>

				<p style={{ color: '#4ab8ff', marginTop: '18px', fontWeight: 800 }}>
					Your score: <span style={{ color: '#ffe066', fontSize: '1.2rem' }}>{score}</span>
				</p>
			</Modal.Content>
			<Modal.Actions>
				<Button primary onClick={props.onNewGame}>Play Again</Button>
			</Modal.Actions>
		</Modal>
	);
}

export default GameOverPanel;
