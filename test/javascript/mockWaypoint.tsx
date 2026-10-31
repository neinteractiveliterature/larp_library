import { Waypoint as WaypointProps } from 'react-waypoint';

/**
 * react-waypoint relies on real scrolling and layout, neither of which jsdom has.  Tests that cover infinite scroll
 * mock the module with this stand-in (`vi.mock('react-waypoint', () => import('.../mockWaypoint'))`), which renders a
 * button that fires `onEnter` when clicked, i.e. "the user scrolled to the end of the list".
 */
export function Waypoint({ onEnter }: Pick<WaypointProps.WaypointProps, 'onEnter'>) {
  return (
    <button type="button" data-testid="waypoint" onClick={() => onEnter?.({} as WaypointProps.CallbackArgs)}>
      Load more
    </button>
  );
}
