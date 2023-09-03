import { render, screen } from '@testing-library/react';
import Profile from './profile';

test('renders learn react link', () => {
  render(<Profile />);
  const linkElement = screen.getByText(/Who are you\?/i);
  expect(linkElement).toBeInTheDocument();
});
