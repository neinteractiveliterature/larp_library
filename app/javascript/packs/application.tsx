// @ts-expect-error no types for rails/ujs
import Rails from '@rails/ujs';
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/dropdown';
import AppWrapper from '../AppWrapper';
import AppRoot from '../AppRoot';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REACT_CLASSES: { [className: string]: React.ComponentType<any> } = {
  AppRoot: AppWrapper(AppRoot),
};

window.addEventListener('load', () => {
  Rails.start();

  document.querySelectorAll('[data-react-class]').forEach((element) => {
    const className = element.getAttribute('data-react-class');
    const reactClass = REACT_CLASSES[className ?? ''];

    if (reactClass) {
      const props = JSON.parse(element.getAttribute('data-props') ?? '{}');
      ReactDOM.render(React.createElement(reactClass, props), element);
    }
  });
});
