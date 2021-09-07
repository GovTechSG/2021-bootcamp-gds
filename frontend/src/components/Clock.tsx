import React, { useEffect } from 'react';
import axios, {AxiosError} from 'axios';

interface ClockProps {
  interval?: number;
};

function Clock(props: ClockProps) {
  const [time, setTime] = React.useState('');
  const [interval] = React.useState(props.interval || 1000);

  /**
   * Update the clock when this function is called
   */
  async function updateClock() {
    try {
      const response = await axios.get('/api/demo/time');
      setTime(response.data);
    } catch (error) {
      console.error('Error connecting to backend:', (error as AxiosError).message);
    }
  }

  /**
   * Trigger a clock update every {interval} milliseconds.
   * When the component is 'mounted' into the application, register the update function.
   * When the component is 'dismounted' from the application, de-register it.
   * Re-register this effect if any of the dependencies in [interval] changes.
   */
  useEffect(() => {
    updateClock();
    const hInterval = setInterval(() => updateClock(), interval)
    return () => { clearInterval(hInterval) };
  }, [interval]);

  return (
    <div>
      <span>
        {time}
      </span>
    </div>
  );
}

export default Clock;
