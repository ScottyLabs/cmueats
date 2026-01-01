import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthBanner from '../../src/components/AuthBanner';

describe('AuthBanner', () => {
    const mockReplaceState = vi.fn();

    // Helper function to set up the test environment with a specific URL
    const setupTestEnvironment = (search: string, pathname = '/') => {
        const mockLocation = {
            href: `http://localhost:3000${pathname}${search}`,
            search,
            pathname,
        };
        vi.stubGlobal('location', mockLocation);

        vi.stubGlobal('history', {
            replaceState: mockReplaceState,
        });
    };

    beforeEach(() => {
        // Reset mocks before each test
        mockReplaceState.mockClear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('displays banner when AUTH_FAILED query parameter is present', async () => {
        setupTestEnvironment('?AUTH_FAILED');

        render(<AuthBanner />);

        // Wait for the banner to appear (useLayoutEffect runs)
        await waitFor(() => {
            expect(screen.getByText(/Failed to log in/i)).toBeInTheDocument();
        });
    });

    test('does not display banner when AUTH_FAILED query parameter is absent', () => {
        setupTestEnvironment('');

        render(<AuthBanner />);

        // Banner should not be displayed
        expect(screen.queryByText(/Failed to log in/i)).not.toBeInTheDocument();
    });

    test('removes AUTH_FAILED query parameter from URL when banner is displayed', async () => {
        setupTestEnvironment('?AUTH_FAILED');

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
        setupTestEnvironment('?AUTH_FAILED');

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
});
