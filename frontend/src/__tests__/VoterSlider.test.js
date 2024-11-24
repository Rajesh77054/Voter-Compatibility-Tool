// frontend/src/__tests__/VoterSlider.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoterSlider from '../components/VoterSlider';

describe('VoterSlider Component', () => {
  test('renders initial state correctly', () => {
    render(<VoterSlider />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('handles user input', async () => {
    render(<VoterSlider />);
    const slider = screen.getByRole('slider');
    await userEvent.click(slider);
    expect(slider).toHaveValue('50');
  });

  test('shows reveal sequence after submission', () => {
    render(<VoterSlider />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitButton);
    expect(screen.getByTestId('reveal-sequence')).toBeInTheDocument();
  });
});