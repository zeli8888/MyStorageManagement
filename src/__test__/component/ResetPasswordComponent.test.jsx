import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import ResetPasswordComponent from '../../component/ResetPasswordComponent';
import { act } from 'react';
import { sendPasswordReset } from '../../service/firebase/auth';
import '@testing-library/jest-dom/vitest'

// Mock react-router-dom hooks and components
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock Firebase password reset service
vi.mock('../../service/firebase/auth', () => ({
    sendPasswordReset: vi.fn(),
}));

describe('ResetPasswordComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sendPasswordReset.mockImplementation(() => vi.fn());
    })
    afterEach(() => {
        cleanup();
    });

    it('should match snapshot', () => {
        const { container } = render(<ResetPasswordComponent />);
        expect(container).toMatchSnapshot();
    });

    it('should display success message and navigate after form submission', async () => {
        sendPasswordReset.mockResolvedValue({ success: true });

        render(<ResetPasswordComponent />);

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
            fireEvent.click(screen.getByText(/Send Reset Email/i));
        })

        await screen.findByText(/Password reset email sent. Check your inbox./i);
        expect(sendPasswordReset).toHaveBeenCalledWith('test@example.com');
    });

    it('should display error message when password reset fails', async () => {
        sendPasswordReset.mockResolvedValue({ success: false, error: 'User not found' });

        render(<ResetPasswordComponent />);

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid@example.com' } });
            fireEvent.click(screen.getByText('Send Reset Email'));
        })

        await screen.findByText('User not found');
        expect(sendPasswordReset).toHaveBeenCalledWith('invalid@example.com');
    });

    it('should display default error message when password reset fails without error message', async () => {
        sendPasswordReset.mockResolvedValue({ success: false });

        render(<ResetPasswordComponent />);

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid@example.com' } });
            fireEvent.click(screen.getByText('Send Reset Email'));
        })

        await screen.findByText(/Failed to send reset email/i);
        expect(sendPasswordReset).toHaveBeenCalledWith('invalid@example.com');
    });

    it('should show login link', () => {
        render(<ResetPasswordComponent />);
        expect(screen.getByText(/Remember your password/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign In/i).closest('a')).toHaveAttribute('href', '/login');
    });

    it('should validate email input', async () => {
        render(<ResetPasswordComponent />);
        const emailInput = screen.getByLabelText(/Email/i);

        // Test empty email validation
        act(() => {
            fireEvent.change(emailInput, { target: { value: '' } });
            fireEvent.click(screen.getByText('Send Reset Email'));
        })
        expect(emailInput).toBeInvalid();
    });
});
