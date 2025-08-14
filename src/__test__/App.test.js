import { render, screen } from '@testing-library/react';
import React from 'react';
test('Basic render', () => {
  render(<div>test</div>);
  expect(screen.getByText('test')).toBeInTheDocument();
});
