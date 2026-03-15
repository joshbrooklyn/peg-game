import React from 'react';
import { Modal, Header, List, Icon, Button } from 'semantic-ui-react';

function HowToPlayModal(props) {
	return (
		<Modal open={props.open} onClose={props.onClose} size="small">
			<Header icon="question circle" content="How to Play" />
			<Modal.Content>
				<Header as="h3">Goal</Header>
				<p>
					Remove as many pegs as possible by jumping over them. Leave only
					one peg and you're a genius!
				</p>

				<Header as="h3">Rules</Header>
				<List ordered>
					<List.Item>The board starts with 14 pegs and one empty hole.</List.Item>
					<List.Item>
						Select a peg to pick it up — only pegs that have a valid jump will
						be selectable.
					</List.Item>
					<List.Item>
						Jump the peg over an adjacent peg into an empty hole. The peg you
						jumped over is removed.
					</List.Item>
					<List.Item>Keep jumping until no valid moves remain.</List.Item>
				</List>

				<Header as="h3">Scoring</Header>
				<List>
					<List.Item><Icon name="star" color="yellow" />1 peg left — Genius!</List.Item>
					<List.Item><Icon name="star" color="yellow" />2 pegs left — Pretty smart</List.Item>
					<List.Item><Icon name="star" color="yellow" />3 pegs left — Not so bad</List.Item>
					<List.Item><Icon name="frown outline" />4+ pegs left — Keep practicing</List.Item>
				</List>

				<Header as="h3">Tips</Header>
				<List bulleted>
					<List.Item>Highlighted pegs can be moved — click one to select it.</List.Item>
					<List.Item>Glowing holes show where your selected peg can land.</List.Item>
					<List.Item>Use <strong>Undo Move</strong> if you make a mistake.</List.Item>
					<List.Item>Use <strong>New Game</strong> to reset with a random starting hole.</List.Item>
				</List>
			</Modal.Content>
			<Modal.Actions>
				<Button primary onClick={props.onClose}>Got it!</Button>
			</Modal.Actions>
		</Modal>
	);
}

export default HowToPlayModal;
