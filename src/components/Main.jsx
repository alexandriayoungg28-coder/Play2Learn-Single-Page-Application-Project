import React from 'react';


function Main({ onStartGame }) {
	return (
		<>
			<div className="main-menu">
				{/*
💡 REMINDER TO SELF:
Write all layout and design styles as normal CSS inside 'src/App.css'!
Make sure to use 'className' instead of 'class' on tags here.
*/}
				<h1>Play2Learn</h1>
				<div className="game-cards-container">
					<div className="game-card">
						<h2>Math Facts Practice</h2>
						<p>Improve your mental math skills with this interactive game!</p>
						<button onClick={() => onStartGame('math')}>Play Now!</button>
					</div>
					{/* REMINDER TO SELF:
This '.game-card' div is just an invisible structural container for now.
It will NOT show up visually on the screen until you add the background,
borders, and shadow rules inside 'src/App.css'!
   */}
					<div className="game-card">
						<h2>Anagram Hunt</h2>
						<p>Do you like scrabble? Words with Friends? Improve how fast you can recognize anagrams in a word with this neat little game!</p>
						<button onClick={() => onStartGame('anagram')}>Play Now!</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default Main;