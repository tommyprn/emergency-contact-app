import {useEffect, useRef} from 'react';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

type Opts = {
  intervalMs?: number;
  onPoint: (p: GeoPosition) => void;
  active: boolean;
};

export function useLocationStream({intervalMs = 5000, onPoint, active}: Opts) {
  const timer = useRef<any>(null);

  useEffect(() => {
    if (!active) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    const tick = () => {
      Geolocation.getCurrentPosition(
        pos => onPoint(pos),
        err => console.warn('loc error', err),
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 0},
      );
    };
    tick();
    timer.current = setInterval(tick, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active, intervalMs, onPoint]);
}
