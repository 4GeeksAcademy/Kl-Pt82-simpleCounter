const { useState, useEffect, useRef } = React;

const digitToSegments = {
  0: ['a','b','c','d','e','f'],
  1: ['b','c'],
  2: ['a','b','g','e','d'],
  3: ['a','b','g','c','d'],
  4: ['f','g','b','c'],
  5: ['a','f','g','c','d'],
  6: ['a','f','e','d','c','g'],
  7: ['a','b','c'],
  8: ['a','b','c','d','e','f','g'],
  9: ['a','b','c','d','f','g']
};

function SecondsCounter({ seconds }) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const timeStr = [
    Math.floor(hrs / 10), hrs % 10,
    Math.floor(mins / 10), mins % 10,
    Math.floor(secs / 10), secs % 10
  ];

  return React.createElement('div', { className: 'display-wrapper' },
    React.createElement('i', { className: 'fa-solid fa-clock' }),
    timeStr.map((digit, i) => React.createElement(Digit, { key: i, number: digit })),
    React.createElement(Colon),
    React.createElement(Digit, { number: timeStr[4] }),
    React.createElement(Digit, { number: timeStr[5] })
  );
}

function Digit({ number }) {
  const segments = digitToSegments[number] || [];
  const allSegments = ['a','b','c','d','e','f','g'];
  return React.createElement('div', { className: 'digit' },
    allSegments.map(seg =>
      React.createElement('div', {
        key: seg,
        className: 'segment ' + seg + (segments.includes(seg) ? ' on' : '')
      })
    )
  );
}

function Colon() {
  return React.createElement('div', { className: 'colon' },
    React.createElement('div', { className: 'dot' }),
    React.createElement('div', { className: 'dot' })
  );
}

function App() {
  const [seconds, setSeconds] = useState(0);
  const [startFrom, setStartFrom] = useState('');
  const [alertAt, setAlertAt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);

  const intervalRef = useRef(null);
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (isCountdown) {
            return prev > 0 ? prev - 1 : 0;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isCountdown]);

  useEffect(() => {
    if (!hasAlerted.current && alertAt !== '' && parseInt(alertAt) === seconds) {
      alert(`Time reached: ${alertAt} seconds`);
      hasAlerted.current = true;
    }
  }, [seconds, alertAt]);

  function start() {
    const startVal = parseInt(startFrom) || 0;
    setIsCountdown(startVal > 0);
    setSeconds(startVal);
    setIsRunning(true);
    hasAlerted.current = false;
  }

  function stop() {
    setIsRunning(false);
  }

  function resume() {
    if (seconds === 0 && isCountdown) return;
    setIsRunning(true);
  }

  function reset() {
    setIsRunning(false);
    setSeconds(0);
    hasAlerted.current = false;
  }

  return React.createElement('div', { className: 'app' },
    React.createElement(SecondsCounter, { seconds }),
    React.createElement('div', { className: 'controls' },
      React.createElement('label', null, 'Start From: ',
        React.createElement('input', {
          type: 'number',
          min: 0,
          value: startFrom,
          onChange: e => setStartFrom(e.target.value)
        })
      ),
      React.createElement('label', null, 'Alert At: ',
        React.createElement('input', {
          type: 'number',
          min: 0,
          value: alertAt,
          onChange: e => setAlertAt(e.target.value)
        })
      ),
      React.createElement('div', { style: { marginTop: '0.8rem' } },
        React.createElement('button', { onClick: start }, 'Start'),
        React.createElement('button', { onClick: stop }, 'Stop'),
        React.createElement('button', { onClick: resume }, 'Resume'),
        React.createElement('button', { onClick: reset }, 'Reset')
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
