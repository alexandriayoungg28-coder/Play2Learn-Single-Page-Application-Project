import React, { useState } from 'react';
import MathFactsGame from '../components/MathFactsGame';
import AnagramGame from '../components/AnagramGame';
import Main from '../components/Main';
import './App.css';      // This imports all your CSS styles for the whole app!

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu');

  if (currentScreen === 'anagram') {
    return <AnagramGame onGoHome={() => setCurrentScreen('menu')} />;
  }

  if (currentScreen === 'math') {
    return <MathFactsGame onGoHome={() => setCurrentScreen('menu')} />;
  }

  return <Main onStartGame={(screen) => setCurrentScreen(screen)} />;
}

export default App;
