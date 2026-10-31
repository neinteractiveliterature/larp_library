import { render } from '@testing-library/react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import { Waypoint } from './Waypoint';

describe('Waypoint', () => {
  it('does nothing until it scrolls into view', () => {
    const onEnter = vi.fn();
    render(<Waypoint onEnter={onEnter} />);

    mockAllIsIntersecting(false);

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('fires onEnter when it scrolls into view', () => {
    const onEnter = vi.fn();
    render(<Waypoint onEnter={onEnter} />);

    mockAllIsIntersecting(true);

    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('fires again each time it comes back into view, but not when it leaves', () => {
    const onEnter = vi.fn();
    render(<Waypoint onEnter={onEnter} />);

    mockAllIsIntersecting(true);
    mockAllIsIntersecting(false);
    expect(onEnter).toHaveBeenCalledTimes(1);

    mockAllIsIntersecting(true);
    expect(onEnter).toHaveBeenCalledTimes(2);
  });

  it('calls the latest onEnter, not the one from when it mounted', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Waypoint onEnter={first} />);

    rerender(<Waypoint onEnter={second} />);
    mockAllIsIntersecting(true);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
