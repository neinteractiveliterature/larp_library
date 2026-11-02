import type { WaypointProps } from '~/components/Waypoint';

/**
 * The real Waypoint needs IntersectionObserver, which jsdom doesn't have.  Tests that cover infinite scroll mock the
 * module with this stand-in (`vi.mock('~/components/Waypoint', () => import('../mockWaypoint'))`), which renders a button that
 * fires `onEnter` when clicked, i.e. "the user scrolled to the end of the list".
 */
export function Waypoint({ onEnter }: WaypointProps) {
  return (
    <button type="button" data-testid="waypoint" onClick={() => onEnter()}>
      Load more
    </button>
  );
}
