import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

it('test no error in Button', () => {
  render(<Button name="test" />);
  const buttonElement = screen.queryByTestId('button');
  expect(buttonElement).toBeInTheDocument();
});
