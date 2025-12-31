import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthBanner from '../../src/components/AuthBanner';

describe('AuthBanner', () => {
    const originalLocation = window.location;
    const mockReplaceState = vi.fn();

    beforeEach(() => {
        // Reset mocks before each test
        mockReplaceState.mockClear();
        
        // Mock window.history.replaceState
        Object.defineProperty(window, 'history', {
            writable: true,
            value: {
                replaceState: mockReplaceState,
            },
        });
    });

    test('displays banner when AUTH_FAILED query parameter is present', async () => {
        // Set up URL with AUTH_FAILED parameter
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            href: 'http://localhost:3000/?AUTH_FAILED',
            search: '?AUTH_FAILED',
            pathname: '/',
        } as Location;

        render(<AuthBanner />);

        // Wait for the banner to appear (useLayoutEffect runs)
        await waitFor(() => {
            expect(screen.getByText(/Failed to log in/i)).toBeInTheDocument();
        });

        // Verify the banner message is displayed
        expect(screen.getByText(/Did you use your CMU email/i)).toBeInTheDocument();
    });

    test('does not display banner when AUTH_FAILED query parameter is absent', () => {
        // Set up URL without AUTH_FAILED parameter
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            href: 'http://localhost:3000/',
            search: '',
            pathname: '/',
        } as Location;

        render(<AuthBanner />);

        // Banner should not be displayed
        expect(screen.queryByText(/Failed to log in/i)).not.toBeInTheDocument();
    });

    test('removes AUTH_FAILED query parameter from URL when banner is displayed', async () => {
        // Set up URL with AUTH_FAILED parameter
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            href: 'http://localhost:3000/?AUTH_FAILED',
            search: '?AUTH_FAILED',
            pathname: '/',
        } as Location;

        render(<AuthBanner />);

        // Wait for the banner to appear and URL to be updated
        await waitFor(() => {
            expect(screen.getByText(/Failed to log in/i)).toBeInTheDocument();
        });

        // Verify that replaceState was called to remove the query parameter
        expect(mockReplaceState).toHaveBeenCalledWith(
            {},
            expect.any(String), // document.title
            '/', // window.location.pathname without query params
        );
    });

    test('can dismiss banner by clicking close button', async () => {
        const user = userEvent.setup();

        // Set up URL with AUTH_FAILED parameter
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            href: 'http://localhost:3000/?AUTH_FAILED',
            search: '?AUTH_FAILED',
            pathname: '/',
        } as Location;

        render(<AuthBanner />);

        // Wait for the banner to appear
        await waitFor(() => {
            expect(screen.getByText(/Failed to log in/i)).toBeInTheDocument();
        });

        // Find and click the close button
        const closeButton = screen.getByRole('button');
        await user.click(closeButton);

        // Banner should no longer be visible
        await waitFor(() => {
            expect(screen.queryByText(/Failed to log in/i)).not.toBeInTheDocument();
        });
    });

    test('banner persists through re-renders until dismissed', async () => {
        const user = userEvent.setup();

        // Set up URL with AUTH_FAILED parameter
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            href: 'http://localhost:3000/?AUTH_FAILED',
            search: '?AUTH_FAILED',
            pathname: '/',
        } as Location;

        const { rerender } = render(<AuthBanner />);

        // Wait for banner to appear
        await waitFor(() => {
            expect(screen.getByText(/Failed to log in/i)).toBeInTheDocument();
        });

        // Re-render the component
        rerender(<AuthBanner />);

        // Banner should still be visible after re-render
        expect(screen.getByText(/Failed to log in/i)).toBeInTheDocument();

        // Click dismiss button
        const closeButton = screen.getByRole('button');
        await user.click(closeButton);

        // Banner should be dismissed
        await waitFor(() => {
            expect(screen.queryByText(/Failed to log in/i)).not.toBeInTheDocument();
        });

        // Re-render again
        rerender(<AuthBanner />);

        // Banner should remain dismissed
        expect(screen.queryByText(/Failed to log in/i)).not.toBeInTheDocument();
    });
});
