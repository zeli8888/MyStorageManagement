import { render, screen } from '@testing-library/react';
import { Button } from '@mui/material';

test('Button snap match', () => {
  const { container } = render(<Button>Click</Button>);
  expect(container).toMatchSnapshot();
});
