import { useState, useCallback } from 'react';
import GameEngine from '@/components/game/GameEngine';
import Icon from '@/components/ui/icon';

type Screen = 'menu' | 'instructions' | 'playing' | 'gameover' | 'win';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const startGame = useCallback((lvl: number) => {
    setLevel(lvl);
    setScore(0);
    setScreen('playing');
  }, []);

  const handleWin = useCallback(() => {
    setScreen('win');
  }, []);

  const handleLose = useCallback(() => {
    setScreen('gameover');
  }, []);

  const handleScore = useCallback((s: number) => {
    setScore(s);
  }, []);

  const handleExit = useCallback(() => {
    setScreen('menu');
  }, []);

  if (screen === 'menu') {
    return (
      <div className="game-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-fade-in text-center mb-8">
          <div className="text-7xl mb-4">🚒</div>
          <h1 className="game-title text-5xl md:text-6xl font-black mb-2">ОГНЕБОРЕЦ</h1>
          <p className="text-orange-200 text-lg">Спаси строительную технику от огня!</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs animate-fade-in">
          <button
            className="game-btn game-btn-primary text-xl py-4"
            onClick={() => startGame(1)}
          >
            <Icon name="Flame" size={24} />
            Уровень 1 — Ручное тушение
          </button>
          <button
            className="game-btn game-btn-secondary text-xl py-4"
            onClick={() => startGame(2)}
          >
            <Icon name="Shield" size={24} />
            Уровень 2 — Система тушения
          </button>
          <button
            className="game-btn game-btn-info text-lg py-3"
            onClick={() => setScreen('instructions')}
          >
            <Icon name="HelpCircle" size={20} />
            Как играть
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'instructions') {
    return (
      <div className="game-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="game-card max-w-md w-full animate-fade-in">
          <h2 className="text-3xl font-black text-yellow-300 mb-6 text-center">📖 Инструкция</h2>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-orange-300 mb-2">🔥 Уровень 1 — Ручное тушение</h3>
            <ul className="text-white/90 space-y-2 text-sm">
              <li className="flex gap-2"><span>•</span><span>Огонь появляется в случайных местах экрана</span></li>
              <li className="flex gap-2"><span>•</span><span>Нажимай многократно на очаг, чтобы потушить его</span></li>
              <li className="flex gap-2"><span>•</span><span>Если не тушить — огонь усиливается и повреждает машину</span></li>
              <li className="flex gap-2"><span>•</span><span>Потуши 8 очагов, чтобы победить</span></li>
              <li className="flex gap-2"><span>•</span><span>Если прочность машины упадёт до 0 — проигрыш!</span></li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-300 mb-2">🧯 Уровень 2 — Система тушения</h3>
            <ul className="text-white/90 space-y-2 text-sm">
              <li className="flex gap-2"><span>•</span><span>На машине установлена система пожаротушения</span></li>
              <li className="flex gap-2"><span>•</span><span>При появлении огня загорается моргающая кнопка 🧯</span></li>
              <li className="flex gap-2"><span>•</span><span>Нажми на неё — огонь мгновенно потухнет</span></li>
              <li className="flex gap-2"><span>•</span><span>Если не нажать — система сработает автоматически через 30 секунд</span></li>
              <li className="flex gap-2"><span>•</span><span>Но за это время огонь нанесёт урон + штраф 15% при автотушении!</span></li>
            </ul>
          </div>

          <button
            className="game-btn game-btn-primary w-full text-lg py-3"
            onClick={() => setScreen('menu')}
          >
            <Icon name="ArrowLeft" size={20} />
            Назад в меню
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'gameover') {
    return (
      <div className="game-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="game-card max-w-sm w-full text-center animate-fade-in">
          <div className="text-7xl mb-4">💥</div>
          <h2 className="text-4xl font-black text-red-400 mb-2">МАШИНА СГОРЕЛА!</h2>
          <p className="text-white/70 mb-2">Огонь оказался сильнее...</p>
          <p className="text-yellow-300 text-2xl font-bold mb-6">Очки: {score}</p>
          <div className="flex flex-col gap-3">
            <button
              className="game-btn game-btn-primary text-lg py-3"
              onClick={() => startGame(level)}
            >
              <Icon name="RotateCcw" size={20} />
              Попробовать снова
            </button>
            <button
              className="game-btn game-btn-info text-lg py-3"
              onClick={() => setScreen('menu')}
            >
              <Icon name="Home" size={20} />
              В меню
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'win') {
    return (
      <div className="game-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="game-card max-w-sm w-full text-center animate-fade-in">
          <div className="text-7xl mb-4">🏆</div>
          <h2 className="text-4xl font-black text-green-400 mb-2">ПОБЕДА!</h2>
          <p className="text-white/70 mb-2">Вы спасли технику от огня!</p>
          <p className="text-yellow-300 text-2xl font-bold mb-6">Очки: {score}</p>
          <div className="flex flex-col gap-3">
            {level === 1 ? (
              <button
                className="game-btn game-btn-secondary text-lg py-3"
                onClick={() => startGame(2)}
              >
                <Icon name="ArrowRight" size={20} />
                Уровень 2
              </button>
            ) : (
              <button
                className="game-btn game-btn-primary text-lg py-3"
                onClick={() => startGame(1)}
              >
                <Icon name="RotateCcw" size={20} />
                Играть сначала
              </button>
            )}
            <button
              className="game-btn game-btn-info text-lg py-3"
              onClick={() => setScreen('menu')}
            >
              <Icon name="Home" size={20} />
              В меню
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-bg min-h-screen relative">
      <GameEngine
        key={`${level}-${Date.now()}`}
        level={level}
        onWin={handleWin}
        onLose={handleLose}
        onScore={handleScore}
        onExit={handleExit}
      />
    </div>
  );
};

export default Index;