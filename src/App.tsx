import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { GameScreen } from './components/GameScreen';
import { MathGameScreen } from './components/MathGameScreen';
import { MemoryGameScreen } from './components/MemoryGameScreen';
import { Scoreboard } from './components/Scoreboard';
import { OfflineBanner } from './components/OfflineBanner';
import { Category, Difficulty, LeaderboardEntry, User } from './types';
import { getUser, saveUser, addToLeaderboard } from './utils/storage';
import { startBackgroundMusic } from './utils/audio';

type ScreenState = 'WELCOME' | 'DASHBOARD' | 'GAME' | 'MATH_GAME' | 'MEMORY_GAME' | 'SCOREBOARD';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('WELCOME');
  const [user, setUser] = useState<User | null>(null);
  const [gameConfig, setGameConfig] = useState<{ category: Category; difficulty: Difficulty } | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('easy');
  const [recentScore, setRecentScore] = useState<{ score: number; stars: number } | null>(null);

  useEffect(() => {
    if (localStorage.getItem('puzzleplay_theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleStartLogin = (loggedUser: User) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let streak = loggedUser.streak || 0;
    
    if (loggedUser.dailyCompletedDate !== today && loggedUser.dailyCompletedDate !== yesterday && streak > 0) {
      streak = 0; // reset streak if missed a day
    }
    
    const userToSet = { ...loggedUser, streak };
    setUser(userToSet);
    saveUser(userToSet);
    startBackgroundMusic();
    setScreen('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('WELCOME');
  };

  const handleStartGame = (category: Category, difficulty: Difficulty) => {
    setGameConfig({ category, difficulty });
    setActiveDifficulty(difficulty);
    setScreen('GAME');
  };

  const handleStartMathGame = (difficulty: Difficulty) => {
    setActiveDifficulty(difficulty);
    setGameConfig(null);
    setScreen('MATH_GAME');
  };

  const handleStartMemoryGame = (difficulty: Difficulty) => {
    setActiveDifficulty(difficulty);
    setGameConfig(null);
    setScreen('MEMORY_GAME');
  };

  const handleFinishGame = (scoreEarned: number, starsEarned: number, completedWords: string[] = []) => {
    if (user) {
      let { dailyCompletedDate, streak, stars, learnedWords, coins } = user;
      let bonusStars = 0;
      let coinsEarned = 0;
      
      if (gameConfig) {
        if (gameConfig.difficulty === 'easy') coinsEarned = 3;
        else if (gameConfig.difficulty === 'medium') coinsEarned = 5;
        else if (gameConfig.difficulty === 'hard') coinsEarned = 10;
      } else {
        if (activeDifficulty === 'easy') coinsEarned = 4;
        else if (activeDifficulty === 'medium') coinsEarned = 7;
        else if (activeDifficulty === 'hard') coinsEarned = 12;
      }

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (gameConfig?.category === 'daily' && dailyCompletedDate !== today) {
        bonusStars = 5;
        if (dailyCompletedDate === yesterday) {
          streak += 1;
        } else {
          streak = 1;
        }
        dailyCompletedDate = today;
      } else if (dailyCompletedDate !== today && dailyCompletedDate !== yesterday && streak > 0) {
        // Streak broken if not played yesterday or today
        streak = 0;
      }

      const currentLearned = learnedWords || [];
      const newLearned = Array.from(new Set([...currentLearned, ...completedWords]));

      const updatedUser = { 
        ...user, 
        totalScore: user.totalScore + scoreEarned,
        stars: stars + starsEarned + bonusStars,
        coins: (coins || 0) + coinsEarned,
        streak,
        dailyCompletedDate,
        lastPlayedDate: today,
        learnedWords: newLearned
      };
      saveUser(updatedUser);
      setUser(updatedUser);
      
      const entry: LeaderboardEntry = {
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        score: updatedUser.totalScore,
        stars: updatedUser.stars,
        date: new Date().toISOString()
      };
      addToLeaderboard(entry);
    }
    
    const isDaily = gameConfig?.category === 'daily';
    const bonus = isDaily ? 5 : 0;
    setRecentScore({ score: scoreEarned, stars: starsEarned + bonus });
    setScreen('SCOREBOARD');
  };

  const handleQuitGame = () => {
    setScreen('DASHBOARD');
  };

  const handleSpendStar = () => {
    if (user && user.stars > 0) {
      const updated = { ...user, stars: user.stars - 1 };
      saveUser(updated);
      setUser(updated);
    }
  };

  return (
    <div className="font-sans text-slate-800 dark:text-slate-100 bg-sky-50 dark:bg-slate-900 min-h-screen selection:bg-blue-200">
      <OfflineBanner />
      {screen === 'WELCOME' && (
        <WelcomeScreen onStart={handleStartLogin} />
      )}
      
      {screen === 'DASHBOARD' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onStartGame={handleStartGame} 
          onStartMathGame={handleStartMathGame}
          onStartMemoryGame={handleStartMemoryGame}
          onViewScoreboard={() => {
            setRecentScore(null);
            setScreen('SCOREBOARD');
          }}
          onUpdateUser={(updated) => {
            setUser(updated);
            saveUser(updated);
          }}
        />
      )}
      
      {screen === 'GAME' && user && gameConfig && (
        <GameScreen 
          user={user} 
          category={gameConfig.category} 
          difficulty={gameConfig.difficulty}
          onFinish={handleFinishGame}
          onQuit={handleQuitGame}
          onSpendStar={handleSpendStar}
        />
      )}

      {screen === 'MATH_GAME' && user && (
        <MathGameScreen 
          user={user} 
          difficulty={activeDifficulty}
          onFinish={handleFinishGame}
          onQuit={handleQuitGame}
        />
      )}

      {screen === 'MEMORY_GAME' && user && (
        <MemoryGameScreen 
          user={user} 
          difficulty={activeDifficulty}
          onFinish={handleFinishGame}
          onQuit={handleQuitGame}
        />
      )}
      
      {screen === 'SCOREBOARD' && (
        <Scoreboard 
          onGoHome={() => setScreen('DASHBOARD')} 
          recentScore={recentScore}
        />
      )}
    </div>
  );
}
