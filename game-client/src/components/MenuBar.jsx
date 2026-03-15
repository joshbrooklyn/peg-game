import React from 'react';
import { Header, Menu } from 'semantic-ui-react';

class MenuBar extends React.Component {

	render() {
		return (
		  <Header block>
		  <Menu>
		    <Menu.Item as="a" name="new-game" onClick={this.props.resetGameHandler}>New Game</Menu.Item>
		    <Menu.Item disabled style={{ padding: 0, borderRight: '1px solid rgba(74, 144, 217, 0.3)' }} />
		    <Menu.Item as="a" name="undo" onClick={this.props.undoMoveHandler}>Undo Move</Menu.Item>
		    <Menu.Menu position="right">
		      <Menu.Item as="a" name="help" onClick={this.props.showHelpHandler}>How to Play</Menu.Item>
		    </Menu.Menu>
		  </Menu>
		  </Header>
		);
	}
}

export default MenuBar;
