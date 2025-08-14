import React from 'react';
import { render } from '@testing-library/react'
import App from '.././App';

test('Render App Widget Correctly', () => {
  const app = render(<App />);
  expect(app).toMatchSnapshot();
});