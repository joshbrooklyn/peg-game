import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import CrackerBarrell from './components/CrackerBarrell';

document.title = "Cracker Barrell Peg Game";

ReactDOM.render(
  <React.StrictMode>
		<CrackerBarrell 
		    emptyPeg={Math.floor(Math.random() * Math.floor(14))}
		    
		    //below are the valid moves for each peg location, with the index of the validMoves array being the peg location key
		    validMoves={[
		      [
		        [1,3],
		        [2,5]  
		      ],
		      [
		        [3,6],
		        [4,8]
		      ],
		      [
		        [4,7],
		        [5,9]
		      ],
		      [
		        [1,0],
		        [4,5],
		        [6,10],
		        [7,12]
		      ],
		      [
		        [7,11],
		        [8,13]
		      ],
		      [
		        [2,0],
		        [4,3],
		        [9,14],
		        [8,12]
		      ],
		      [
		        [3,1],
		        [7,8]
		      ],
		      [
		        [8,9],
		        [4,2]
		      ],
		      [
		        [4,1],
		        [7,6]
		      ],
		      [
		        [8,7],
		        [5,2]
		      ],
		      [
		        [6,3],
		        [11,12]
		      ],
		      [
		        [12,13],
		        [7,4]
		      ],
		      [
		        [13,14],
		        [11,10],
		        [7,3],
		        [8,5]
		      ],
		      [
		        [12,11],
		        [8,4]
		      ],
		      [
		        [13,12],
		        [9,5]
		      ]
		    ]}
		  />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
