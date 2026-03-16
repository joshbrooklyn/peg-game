import React from 'react';
import { Modal, Header, Button, Input, Message } from 'semantic-ui-react';

const API_URL = process.env.REACT_APP_API_URL;

class PlayerNameModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.currentName || '', error: '', loading: false, takenName: null };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.open && this.props.open) {
			this.setState({ value: this.props.currentName || '', error: '', loading: false, takenName: null });
		}
	}

	async handleSubmit() {
		const name = this.state.value.trim();
		if (!name) return;

		this.setState({ loading: true, error: '', takenName: null });

		try {
			const response = await fetch(`${API_URL}/api/users`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userName: name }),
			});

			if (response.status === 409) {
				this.setState({ takenName: name, loading: false });
				return;
			}

			if (!response.ok) {
				this.setState({ error: 'Something went wrong. Please try again.', loading: false });
				return;
			}

			const user = await response.json();
			this.props.onSave(user.userName, user.userId);
		} catch {
			this.setState({ error: 'Could not reach the server. Please try again.', loading: false });
		}
	}

	async handleLogin() {
		const { takenName } = this.state;
		this.setState({ loading: true });

		try {
			const response = await fetch(`${API_URL}/api/users/byname/${encodeURIComponent(takenName)}`);
			if (!response.ok) {
				this.setState({ error: 'Could not find that user. Please try again.', loading: false, takenName: null });
				return;
			}
			const user = await response.json();
			this.props.onSave(user.userName, user.userId);
		} catch {
			this.setState({ error: 'Could not reach the server. Please try again.', loading: false, takenName: null });
		}
	}

	render() {
		const { open, isFirstVisit } = this.props;
		const { value, error, loading, takenName } = this.state;

		if (takenName) {
			return (
				<Modal open={open} size="mini" closeOnDimmerClick={false}>
					<Header icon="user" content="Welcome back!" />
					<Modal.Content>
						<p style={{ color: '#cce4ff', fontFamily: 'Nunito, Arial, sans-serif' }}>
							<strong style={{ color: '#ffe066' }}>{takenName}</strong> is already registered.
							Would you like to log in with that name?
						</p>
						{error && (
							<Message negative size="small" style={{ marginTop: '10px' }}>
								{error}
							</Message>
						)}
					</Modal.Content>
					<Modal.Actions style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
						<Button primary onClick={() => this.setState({ takenName: null, value: '' })} disabled={loading}>
							Choose Different Name
						</Button>
						<Button primary onClick={this.handleLogin} loading={loading} disabled={loading}>
							Log In as {takenName}
						</Button>
					</Modal.Actions>
				</Modal>
			);
		}

		return (
			<Modal open={open} size="mini" closeOnDimmerClick={!isFirstVisit} onClose={this.props.onCancel}>
				<Header icon="user" content={isFirstVisit ? "Welcome! What's your name?" : "Change Name"} />
				<Modal.Content>
					<Input
						fluid
						placeholder="Enter your name"
						value={value}
						onChange={e => this.setState({ value: e.target.value, error: '' })}
						onKeyDown={e => e.key === 'Enter' && this.handleSubmit()}
						className="name-input"
						autoFocus
						disabled={loading}
					/>
					{error && (
						<Message negative size="small" style={{ marginTop: '10px' }}>
							{error}
						</Message>
					)}
				</Modal.Content>
				<Modal.Actions>
					{!isFirstVisit && (
						<Button onClick={this.props.onCancel} disabled={loading}>Cancel</Button>
					)}
					<Button primary onClick={this.handleSubmit} disabled={!value.trim() || loading} loading={loading}>
						{isFirstVisit ? "Let's Play!" : 'Save'}
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

export default PlayerNameModal;
