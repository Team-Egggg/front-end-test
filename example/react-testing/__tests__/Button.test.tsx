/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import Button from '../src/components/Button';

it('test no error in Button', () => {
  render(<Button name="test" />);
});
