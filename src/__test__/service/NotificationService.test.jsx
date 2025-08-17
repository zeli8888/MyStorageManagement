import { describe, test, expect, vi, beforeEach } from 'vitest';
import NotificationService from '../../service/NotificationService';

// Mock enqueueSnackbar handler
const mockEnqueueSnackbar = vi.fn(() => 'mock-key');
const mockHandler = { enqueueSnackbar: mockEnqueueSnackbar };

describe('NotificationService', () => {
    beforeEach(() => {
        // Reset service and mocks between tests
        NotificationService.reset();
        vi.clearAllMocks();
        vi.resetModules();
    });

    describe('Initialization', () => {
        test('should use default handler before initialization', () => {
            const result = NotificationService.show('Test message');
            expect(result).toBe(''); // Default handler returns empty string
            expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
        });

        test('should use custom handler after initialization', () => {
            NotificationService.initialize(mockHandler);
            NotificationService.show('Test message');
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Test message', { variant: 'default' });
        });
    });

    describe('Core functionality', () => {
        beforeEach(() => {
            NotificationService.initialize(mockHandler);
        });

        test('show() should forward message and variant', () => {
            NotificationService.show('Warning message', 'warning');
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Warning message', { variant: 'warning' });
        });

        test('error() should use error variant', () => {
            NotificationService.error('Error occurred');
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Error occurred', { variant: 'error' });
        });

        test('success() should use success variant', () => {
            NotificationService.success('Operation succeeded');
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Operation succeeded', { variant: 'success' });
        });

        test('warning() should use warning variant', () => {
            NotificationService.warning('Potential issue');
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Potential issue', { variant: 'warning' });
        });

        test('info() should use info variant', () => {
            NotificationService.info('Informational message');
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Informational message', { variant: 'info' });
        });
    });

    describe('Edge cases', () => {
        test('reset() should restore default handler', () => {
            NotificationService.initialize(mockHandler);
            NotificationService.reset();
            const result = NotificationService.show('Test message');
            expect(result).toBe('');
            expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
        });

        test('should show development warning when uninitialized', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { });

            NotificationService.show('Test message');

            expect(consoleWarn).toHaveBeenCalledWith('Notification Service not initialized!');
            process.env.NODE_ENV = originalEnv;
            consoleWarn.mockRestore();
        });
    });
});
