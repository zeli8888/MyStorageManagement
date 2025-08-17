import { describe, test, expect, beforeEach, vi } from 'vitest';
import { firebaseAuth } from '../../service/firebase/firebaseConfig';
import notificationService from '../../service/NotificationService';
import baseApi from '../../service/baseApi';
import { firebaseSignOut } from '../../service/firebase/auth';
import '@testing-library/jest-dom/vitest';

// Mock firebaseAuth methods
vi.mock('../../service/firebase/firebaseConfig', () => ({
    firebaseAuth: {
        currentUser: null,
    },
}));

// Mock notification service
vi.mock('../../service/NotificationService', () => ({
    default: {
        error: vi.fn(),
        warning: vi.fn(),
    },
}));

// Mock firebase signout
vi.mock('../../service/firebase/auth', () => ({
    firebaseSignOut: vi.fn(),
}));

describe('baseApi instance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        firebaseAuth.currentUser = null;
    });

    describe('request interceptor', () => {
        test('should add authorization header when user is logged in', async () => {
            // Mock logged-in user
            firebaseAuth.currentUser = {
                getIdToken: vi.fn().mockResolvedValue('mock-token'),
            };

            const config = await baseApi.interceptors.request.handlers[0].fulfilled({ headers: {} });
            expect(config.headers.Authorization).toBe('Bearer mock-token');
        });

        test('should not add authorization header when no user is logged in', async () => {
            const config = await baseApi.interceptors.request.handlers[0].fulfilled({ headers: {} });
            expect(config.headers.Authorization).toBeUndefined();
        });
    });

    describe('response interceptor', () => {
        const createMockError = (status, data, isNetworkError = false) => {
            if (isNetworkError) {
                return {
                    message: 'Network Error',
                    isAxiosError: true,
                    config: {}
                };
            }
            return {
                isAxiosError: true,
                response: {
                    status,
                    data,
                    config: {},
                    headers: {},
                },
            };
        };

        test('should handle network errors', async () => {
            const error = createMockError(null, null, true);

            await expect(
                baseApi.interceptors.response.handlers[0].rejected(error)
            ).rejects.toMatchObject({
                code: 'NETWORK_ERR',
                message: 'Network Error',
            });

            expect(notificationService.error).toHaveBeenCalledWith('Network Error');
        });

        test('should handle 401 unauthorized errors', async () => {
            const mockReload = vi.fn();
            Object.defineProperty(window, 'location', {
                value: { reload: mockReload },
                writable: true,
            });

            const error = createMockError(401, { message: 'Unauthorized' });

            await expect(
                baseApi.interceptors.response.handlers[0].rejected(error)
            ).rejects.toMatchObject({
                code: 401,
                message: 'Session Expired, Please Login Again',
            });

            expect(firebaseSignOut).toHaveBeenCalled();
            expect(mockReload).toHaveBeenCalled();
            expect(notificationService.warning).toHaveBeenCalledWith(
                'Session Expired, Please Login Again'
            );
        });

        test('should handle server errors with message', async () => {
            const error = createMockError(500, { message: 'Server Error' });

            await expect(
                baseApi.interceptors.response.handlers[0].rejected(error)
            ).rejects.toMatchObject({
                code: 500,
                message: 'Server Error',
            });

            expect(notificationService.error).toHaveBeenCalledWith('Server Error');
        });

        test('should handle server errors without message', async () => {
            const error = createMockError(400, {});

            await expect(
                baseApi.interceptors.response.handlers[0].rejected(error)
            ).rejects.toMatchObject({
                code: 400,
                message: undefined,
            });

            expect(notificationService.error).toHaveBeenCalledWith('Request failed (400)');
        });
    });
});