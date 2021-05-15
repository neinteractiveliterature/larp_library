import React, { useRef, useEffect } from 'react';

export default function useIsMounted(): React.RefObject<boolean> {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  return mounted;
}
