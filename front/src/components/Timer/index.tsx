import React, { useState, useEffect } from 'react';
// start와 reset 프로퍼티에 대한 타입을 명시하는 인터페이스를 정의합니다.
interface TimerComponentProps {
  start: boolean;
  reset: boolean;
}

function TimerComponent({ start, reset } : TimerComponentProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5분을 초로 환산한 값입니다.

  useEffect(() => {
    if (!start) {
      // 타이머가 시작되지 않았다면 아무것도 하지 않습니다.
      return;
    }
    if(timeLeft === 0){
      alert('유효시간이 만료되었습니다.');
    }
    if (timeLeft === 0 || reset) {
      // 타이머를 리셋합니다.
      setTimeLeft(300);
      start = !start;
      return;
    }

    // 1초마다 timeLeft를 감소시키는 타이머를 설정합니다.
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // 컴포넌트가 언마운트되거나 업데이트될 때 타이머를 정리합니다.
    return () => clearInterval(intervalId);
  }, [start, reset, timeLeft]);

  const formatTimeLeft = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <p>남은 시간: {formatTimeLeft(timeLeft)}</p>
    </div>
  );
}

export default TimerComponent;
