import React, { useState, useEffect } from 'react';
import "./MathGame.css"; // Uses a single dot because it's in the same folder


function MathFactsGame({onGoHome}) {
    const [stage, setStage] = useState('start');
    // Configuration states
    const [operation, setOperation] = useState('addition'); // Stores 'addition', 'subtraction', etc.
    const [maxNumber, setMaxNumber] = useState(10);        // Stores 10, 20, 50, 100

    // Core gameplay states
    const [num1, setNum1] = useState(0);                    // First number in the math equation (e.g., 9)
    const [num2, setNum2] = useState(0);                    // Second number in the math equation (e.g., 0)
    const [userInput, setUserInput] = useState('');         // Tracks what number keys the player clicks
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);                  // Player points count
    const [timeLeft, setTimeLeft] = useState(30); 
   
    // 30-second countdown clock
    useEffect(() => {
        if (stage !== 'play') return;

        const timerId = setInterval(() => {
            setTimeLeft(previousTime => {
                if (previousTime <= 1) {
                    setStage('game-over');
                    return 0;
                }
                return previousTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [stage]);

    // 30-second game clock
    const generateNewProblem = (currentOp, maxNumValue) => {
        let n1 = Math.floor(Math.random() * (maxNumValue + 1));
        let n2 = Math.floor(Math.random() * (maxNumValue + 1));

        if (currentOp === 'subtraction' && n1 < n2) {
            const temp = n1;
            n1 = n2;
            n2 = temp;
        }

        if (currentOp === 'division') {
            n2 = Math.floor(Math.random() * maxNumValue) + 1;
            const maxQuotient = Math.floor(maxNumValue / n2);
            const quotient = Math.floor(Math.random() * (maxQuotient + 1));
            n1 = quotient * n2;
        }

        setNum1(n1);
        setNum2(n2);
        setUserInput('');
        setAnswered(false);
    };

    const startMathGame = () => {
        setScore(0);
        setTimeLeft(30);
        setUserInput('');
        setAnswered(false);
        generateNewProblem(operation, maxNumber);
        setStage('play');
    };

    const getCorrectAnswer = () => {
        if (operation === 'addition') return num1 + num2;
        if (operation === 'subtraction') return num1 - num2;
        if (operation === 'multiplication') return num1 * num2;
        if (operation === 'division') {
            // Safety lookup: avoid division by zero crash if state updates late
            return num2 === 0 ? 0 : num1 / num2;
        }
        return 0;
    };

    const getOperationSymbol = () => {
        if (operation === 'addition') return '+';
        if (operation === 'subtraction') return '-';
        if (operation === 'multiplication') return '×';
        if (operation === 'division') return '÷';
        return '';
    };

    const appendToAnswer = (number) => {
        setUserInput(previousInput => String(Number(previousInput + number)));
    };

    const handleAnswerInput = (nextInput) => {
        setUserInput(nextInput.replace(/\D/g, ''));
    };

    useEffect(() => {
        if (stage !== 'play' || answered || userInput === '') return;

        if (Number(userInput) !== getCorrectAnswer()) return;

        setAnswered(true);
        setScore(previousScore => previousScore + 1);

        const nextQuestionTimer = setTimeout(() => {
            generateNewProblem(operation, maxNumber);
        }, 300);

        return () => clearTimeout(nextQuestionTimer);
    }, [maxNumber, num1, num2, operation, stage, userInput]);

    if (stage === 'start') {
        return (
            <>
                <div className="Math-Start-Page">
                    <h1>Math Facts </h1>
                    <p>OPERATION</p> 
                    <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                        <option value="addition">Addition</option>
                        <option value="subtraction">Subtraction</option>
                        <option value="multiplication">Multiplication</option>
                        <option value="division">Division</option>
                    </select>
                    <p>Max Number</p>
                    <select value={maxNumber} onChange={(e) => setMaxNumber(parseInt(e.target.value))}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <button onClick={startMathGame}>Go</button>
                    <p>1. Choose Operation.</p>
                    <p>2. Choose Max Number.</p>
                    <p>3. Press Go.</p>
                    <p>4. How many problems can you solve in 30 seconds?</p>
                </div>
            </>
        );
    }

    if (stage === 'play') {
        return (
            <>
                <div className="Math-Play-Page">
                    <h1>Math Facts</h1>
                    <p style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {operation}
                    </p>

                    <p> {num1} {getOperationSymbol()} {num2}</p>
                    <input 
                        type="text" 
                        value={userInput}
                        autoFocus // Keeps your typing cursor flashing inside the box constantly
                        onChange={(e) => handleAnswerInput(e.target.value)} // ⌨️ Handles physical typing!
                        style={{ padding: '10px', fontSize: '1.2rem', textAlign: 'center', display: 'block', margin: '10px auto' }}
                    />
                    <div className="keypad">
                        {/* Clicking buttons safely appends number strings straight to your tracking variables */}
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('1')}>1</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('2')}>2</button>
                        <button type="button" style={{ color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('3')}>3</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('4')}>4</button>
                        <button type="button" style={{ color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('5')}>5</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('6')}>6</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('7')}>7</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('8')}>8</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('9')}>9</button>
                        <button type="button" style={{  color: 'white', backgroundColor: '#64b871', border: 'none' }} onClick={() => appendToAnswer('0')}>0</button>
                        
                        <button className="clear-button" type="button" onClick={() => { setUserInput(''); }}>Clear</button>
                    </div>
                    <p className="game-stat">Score: {score}</p>
                    <p className="game-stat">Time Left: {timeLeft}s</p>
                </div>
            </>
        );
    }

    if (stage === 'game-over') {
        return (
            <div className="Game-over-Page">
                <h1>Math Facts</h1>
                <p style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {operation}
                </p>
              
                <p>Time&apos;s up!  </p>
                <p> Your Final Score is:</p>
                <p>Score: {score}</p>
                <button type="button" onClick={() => setStage('start')} style={{ color: 'white', backgroundColor: '#64b871', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Play Again</button>
                <button type="button"  onClick={onGoHome} style={{ color: 'white', backgroundColor: 'gray', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Back to Start Screen</button>
            </div>
        );
    }
}

export default MathFactsGame;
