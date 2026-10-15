import React, { useState, useEffect } from 'react';
import "./AnagramGame.css";
const anagrams = {
  5 : [
    ["abets", "baste", "betas", "beast", "beats"],
    ["acres", "cares", "races", "scare"],
    ["alert", "alter", "later"],
    ["angel", "angle", "glean"],
    ["baker", "brake", "break"],
    ["bared", "beard", "bread", "debar"],
    ["dater", "rated", "trade", "tread"],
    ["below", "bowel", "elbow"],
    ["caret", "cater", "crate", "trace", "react"]
  ],
  6 : [
    ["arrest", "rarest", "raster", "raters", "starer"],
    ["carets", "caters", "caster", "crates", "reacts", "recast", "traces"],
    ["canter", "nectar", "recant", "trance"],
    ["danger", "gander", "garden", "ranged"],
    ["daters", "trades", "treads", "stared"]
  ],
  7 : [
    ["allergy", "gallery", "largely", "regally"],
    ["aspired", "despair", "diapers", "praised"],
    ["claimed", "decimal", "declaim", "medical"],
    ["dearths", "hardest", "hatreds", "threads", "trashed"],
    ["detains", "instead", "sainted", "stained"]
  ],
  8 : [
    ["parroted", "predator", "prorated", "teardrop"],
    ["repaints", "painters", "pantries", "pertains"],
    ["restrain", "retrains", "strainer", "terrains", "trainers"],
    ["construe", "counters", "recounts", "trounces"]
  ]
};


function AnagramGame({onGoHome}) {
    const [stage, setStage] = useState('start');
    const [targetWord, setTargetWord] = useState('');  // Holds the word displayed on screen (e.g., "beast")   
    const [userInput, setUserInput] = useState('');    // Tracks what the user types character-by-character   
    const [score, setScore] = useState(0);             // Tracks the player's score   
 const [wordLength, setWordLength] = useState('');          // Tracks text area numbers ("5", "6", etc.)
    const [currentWordPool, setCurrentWordPool] = useState([]); // Tracks selected sub-array pool answers
    const [currentPoolIndex, setCurrentPoolIndex] = useState(-1);
    const [completedPoolIndices, setCompletedPoolIndices] = useState([]);
    const [guessedWords, setGuessedWords] = useState([]);       // Stores successfully guessed words list (#1 & #2 tool)
    const [timeLeft, setTimeLeft] = useState(60);               // Countdown timer value clock (#4 tool)
    const [endReason, setEndReason] = useState('time');

    useEffect(() => {
        if (stage !== 'play') return;

        if (timeLeft === 0) {
            setEndReason('time');
            setStage('game-over');
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, stage]);
 const pickNewWordPool = (selectedNum, excludedPoolIndices = []) => {
        const availablePools = anagrams[selectedNum]; 
        const availablePoolIndices = availablePools
            .map((_, index) => index)
            .filter(index => !excludedPoolIndices.includes(index));
        const randomPoolIndex = availablePoolIndices[Math.floor(Math.random() * availablePoolIndices.length)];
        const randomPool = availablePools[randomPoolIndex];
        const randomWord = randomPool[Math.floor(Math.random() * randomPool.length)];

        setCurrentPoolIndex(randomPoolIndex);
        setCurrentWordPool(randomPool);
        setTargetWord(randomWord);
        setGuessedWords([]);
    };

    const startGame = () => {
        const chosenLength = parseInt(wordLength.trim());
 // Validates constraints check that user typed a supported number length key
        if (chosenLength === 5 || chosenLength === 6 || chosenLength === 7 || chosenLength === 8) {
            setScore(0);
            setTimeLeft(60);
            setEndReason('time');
            setUserInput('');
            setCompletedPoolIndices([]);
            pickNewWordPool(chosenLength);
            setStage('play');
        } else {
            alert("Please enter a valid word length: 5, 6, 7, or 8!");
        }
    };

    if (stage === 'start') {
        return (
            <div className="Start-Page">
                <h1>Anagram Hunt</h1>
                <p style={{ fontWeight: 'bold' }}>WORD LENGTH</p>
                <textarea value={wordLength} onChange={(e) => setWordLength(e.target.value)}  style={{ marginRight: '10px' }} cols="30" rows="10" />
                <p>1. Choose Word Length.</p>
                <p>2. Press Play!</p>
                <p>3. How many anagrams can you find in a minute?</p>
                <button
                    onClick={() => { startGame(); }}
                    style={{ color: 'white', backgroundColor: 'blue', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Play!
                </button>
            </div>
        );
    }

    if (stage === 'play') {
        const totalPossibleAnagrams = currentWordPool.length - 1;
        const anagramsLeft = totalPossibleAnagrams - guessedWords.length;
        return (
            <div className="Play-Page">
                <h1>Anagram Hunt</h1>
                <p style={{ fontWeight: 'bold', textAlign: 'left' }}>Score: {score}</p>
                <p style={{ textAlign: 'right' }}>Time Left: {timeLeft}s</p>
                <p style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>({anagramsLeft} left)</p>
                <p style={{ textAlign: 'center' }}>
                     <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{targetWord}</span> 
                </p>
               <input
    type="text"
    value={userInput}
    placeholder="type here"
    onChange={(e) => setUserInput(e.target.value)}
    onKeyDown={(e) => {
        if (e.key === 'Enter') {
            const cleanGuess = userInput.trim().toLowerCase();
            if (
                currentWordPool.includes(cleanGuess) &&
                cleanGuess !== targetWord.toLowerCase() &&
                !guessedWords.includes(cleanGuess)
            ) {
                const newGuesses = [...guessedWords, cleanGuess];
                setGuessedWords(newGuesses);
                setScore(prev => prev + 1);

                if (newGuesses.length === totalPossibleAnagrams) {
                    const currentNumKey = parseInt(wordLength.trim());
                    const updatedCompletedPoolIndices = [...completedPoolIndices, currentPoolIndex];
                    setCompletedPoolIndices(updatedCompletedPoolIndices);

                    if (updatedCompletedPoolIndices.length === anagrams[currentNumKey].length) {
                        setTimeout(() => {
                            setEndReason('completed');
                            setStage('game-over');
                        }, 500);
                    } else {
                        setTimeout(() => {
                            pickNewWordPool(currentNumKey, updatedCompletedPoolIndices);
                        }, 500);
                    }
                }
            }
            setUserInput(''); 
        }
    }}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <p style={{ fontWeight: 'bold' }}>Correct Answers Found:</p>
                    <ul style={{ listStyleType: 'none' }}>
                        {guessedWords.map((word, index) => (
                            <li key={index} style={{ textTransform: 'capitalize' }}>{index + 1}. {word}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    if (stage === 'game-over') {
    return (
        <div className="Game-over-Page">
            <h1>Anagram Hunt</h1>
            <p>Time&apos;s up! You Got</p>
            <p>{score}  Anagrams</p>
            <button
                onClick={() => setStage('start')}
                style={{ color: 'white', backgroundColor: 'blue', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
            >
                Play Again
            </button>
            <button
                onClick={onGoHome}
                style={{ color: 'white', backgroundColor: 'gray', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
            >
                Back to Start Screen
            </button>
        </div>
    );
}

}

export default AnagramGame;