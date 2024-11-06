// frontend/src/__tests__/sample.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders sample text', () => {
  render(<div>Sample Text</div>);
  const element = screen.getByText(/Sample Text/i);
  expect(element).toBeInTheDocument();
});
