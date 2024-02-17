import { useState, useEffect } from 'react';

const HOUR_TO_SECONDS = 60 * 60;
const MIN_TO_SECONDS = 60;

export type RecorderStatus = 'new' | 'paused' | 'recording' | 'ended';

function fillZero(num: number): string {
  return num > 9 ? num + '' : '0' + num;
}

function TimeShower({ totalSeconds }: { totalSeconds: number }) {
  const hours = Math.floor(totalSeconds / HOUR_TO_SECONDS);
  const mins = Math.floor(
    (totalSeconds - hours * HOUR_TO_SECONDS) / MIN_TO_SECONDS,
  );
  const seconds =
    totalSeconds - hours * HOUR_TO_SECONDS - mins * MIN_TO_SECONDS;

  return (
    <h2 style={{ fontSize: '24px' }}>
      {`${fillZero(hours)}:${fillZero(mins)}:${fillZero(seconds)}`}
    </h2>
  );
}

export function RecorderTimer({
  recorderStatus,
}: {
  recorderStatus: RecorderStatus;
}) {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    switch (recorderStatus) {
      case 'new': {
        setTime(0);
        break;
      }
      case 'recording': {
        timer = setInterval(() => {
          setTime((time) => time + 1);
        }, 1000);
        break;
      }
      case 'paused': {
        break;
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [recorderStatus]);

  return <TimeShower totalSeconds={time} />;
}
