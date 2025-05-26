import { useEffect, useState } from 'react';
import styles from './SloganRotator.module.css';
import cn from 'classnames';

const slogans: string[] = [
  'Ваш голос меняет мир',
  'Говори. Подписывай. Влияй.',
  'Сила – в вашем голосе',
  'Объединяем голоса для перемен',
  'Меняем мир вместе',
  'Каждое мнение – шаг к изменениям',
  'Будь услышан. Будь изменением.',
  'От слов – к действиям',
  'Подпиши перемены',
  'Голос каждого – двигатель прогресса',
  'Вместе мы громче',
  'Делаем историю через петиции',
  'Твой голос – твоя сила',
  'Не молчи – действуй!',
  'Измени то, что важно для тебя',
  'Петиции, которые работают',
  'Создавай. Распространяй. Побеждай.',
  'Голосуй за будущее',
  'Меньше слов – больше действий',
  'Голос, который нельзя игнорировать',
];

function getRandomSlogan(): string {
  return slogans[Math.floor(Math.random() * slogans.length)];
}

interface Props {
  time?: number;
}

function SloganRotator({ time = 10_000 }: Props) {
  const [currentSlogan, setCurrentSlogan] = useState(getRandomSlogan());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentSlogan(getRandomSlogan());
        setIsVisible(true);
      }, 333);
    }, time);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div
      className={cn(
        styles['slogan-container'],
        styles[isVisible ? 'fade-in' : 'fade-out']
      )}
    >
      {currentSlogan}
    </div>
  );
}

export default SloganRotator;
