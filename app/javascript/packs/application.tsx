import '../setPublicPath';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/dropdown';
import AppWrapper from '../AppWrapper';
import AppRoot from '../AppRoot';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REACT_CLASSES: { [className: string]: React.ComponentType<any> } = {
  AppRoot: AppWrapper(AppRoot),
};

window.addEventListener('load', () => {
  document.querySelectorAll('[data-react-class]').forEach((element) => {
    const className = element.getAttribute('data-react-class');
    const reactClass = REACT_CLASSES[className ?? ''];

    if (reactClass) {
      const props = JSON.parse(element.getAttribute('data-props') ?? '{}');
      const root = createRoot(element);
      root.render(React.createElement(reactClass, props));
    }
  });
});
