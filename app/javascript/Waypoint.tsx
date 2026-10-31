import { useInView } from 'react-intersection-observer';

export type WaypointProps = {
  /** Called each time this marker scrolls into view (and once on mount if it's already in view) */
  onEnter: () => void;
};

/**
 * An invisible marker that fires `onEnter` when it scrolls into view, used to load the next page of an infinite list.
 * Replaces react-waypoint, which is deprecated and doesn't support React 19.
 */
export function Waypoint({ onEnter }: WaypointProps): JSX.Element {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        onEnter();
      }
    },
  });

  return <div ref={ref} />;
}
