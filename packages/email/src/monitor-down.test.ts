import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Resend } from 'resend';
import {MailClient} from "./index.ts";
import type {AlertOptions} from "./types.ts";

// Mock the Resend module
vi.mock('resend', () => {
    return {
        Resend: vi.fn().mockImplementation(() => {
            return {
                emails: {
                    send: vi.fn()
                }
            };
        })
    };
});

describe('MailClient', () => {
    let mailClient: any;
    let mockResend: any;
    const apiKey = 're_jS4yJcmw_HPU3Nc2uZGweo2yBg5xwyyd8';
    const defaultFrom = 'sidharthinfernal@gmail.com';

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new mail client instance
        mailClient = new MailClient(apiKey, defaultFrom);

        // Get reference to the mocked Resend instance
        mockResend = (mailClient as any).resend;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('sendMonitorDownAlert', () => {
        it('should send a monitor down alert with default values', async () => {
            // Mock the successful response from Resend
            mockResend.emails.send.mockResolvedValueOnce({
                data: { id: 'test-message-id' },
                error: null
            });

            // Test data
            const options: AlertOptions = {
                to: 'sidharthiwnl@gmail.com',
                url: 'https://test-monitor.com'
            };

            // Call the method
            const result = await mailClient.sendMonitorDownAlert(options);


            console.log('Result from sendMonitorDownAlert:', result);

            // Verify result
            expect(result).toEqual({
                success: true,
                messageId: 'test-message-id'
            });

            // Verify that Resend's send method was called correctly
            expect(mockResend.emails.send).toHaveBeenCalledTimes(1);

            const sendArgs = mockResend.emails.send.mock.calls[0][0];
            expect(sendArgs.from).toBe(defaultFrom);
            expect(sendArgs.to).toBe(options.to);
            expect(sendArgs.subject).toBe(`Monitor Down: ${options.url}`);
            expect(sendArgs.html).toContain(`<h1>Monitor Down Alert</h1>`);
            expect(sendArgs.html).toContain(`<p>Your monitor for <strong>${options.url}</strong> is down.</p>`);
        });

        // it('should send a monitor down alert with custom subject and error message', async () => {
        //     // Mock the successful response from Resend
        //     mockResend.emails.send.mockResolvedValueOnce({
        //         data: { id: 'custom-message-id' },
        //         error: null
        //     });
        //
        //     // Test data with custom values
        //     const options: AlertOptions = {
        //         to: 'sidharthiwnl@gmail.com',
        //         url: 'https://test-monitor.com',
        //         subject: 'Custom Monitor Alert',
        //         error: 'Connection timeout',
        //         monitorId: 'monitor-123',
        //         timestamp: '2023-04-06T12:00:00Z'
        //     };
        //
        //     // Call the method
        //     const result = await mailClient.sendMonitorDownAlert(options);
        //
        //     // Verify result
        //     expect(result).toEqual({
        //         success: true,
        //         messageId: 'custom-message-id'
        //     });
        //
        //     // Verify that Resend's send method was called correctly
        //     expect(mockResend.emails.send).toHaveBeenCalledTimes(1);
        //
        //     const sendArgs = mockResend.emails.send.mock.calls[0][0];
        //     expect(sendArgs.from).toBe(defaultFrom);
        //     expect(sendArgs.to).toBe(options.to);
        //     expect(sendArgs.subject).toBe(options.subject);
        //     expect(sendArgs.html).toContain(`<p><strong>Error:</strong> ${options.error}</p>`);
        //     expect(sendArgs.html).toContain(`<p><strong>Monitor ID:</strong> ${options.monitorId}</p>`);
        //     expect(sendArgs.html).toContain(`<p><strong>Time detected:</strong> ${options.timestamp}</p>`);
        // });
        //
        // it('should handle API error responses', async () => {
        //     // Mock an error response from Resend
        //     mockResend.emails.send.mockResolvedValueOnce({
        //         data: null,
        //         error: { message: 'API error' }
        //     });
        //
        //     // Test data
        //     const options: AlertOptions = {
        //         to: 'sidharthiwnl@gmail.com',
        //         url: 'https://test-monitor.com'
        //     };
        //
        //     // Call the method
        //     const result = await mailClient.sendMonitorDownAlert(options);
        //
        //     // Verify result indicates failure
        //     expect(result).toEqual({
        //         success: false
        //     });
        //
        //     // Verify that Resend's send method was called
        //     expect(mockResend.emails.send).toHaveBeenCalledTimes(1);
        // });
        //
        // it('should handle exceptions thrown during sending', async () => {
        //     // Mock Resend's send method to throw an exception
        //     mockResend.emails.send.mockRejectedValueOnce(new Error('Network error'));
        //
        //     // Test data
        //     const options: AlertOptions = {
        //         to: 'sidharthiwnl@gmail.com',
        //         url: 'https://test-monitor.com'
        //     };
        //
        //     // Call the method
        //     const result = await mailClient.sendMonitorDownAlert(options);
        //
        //     // Verify result indicates failure
        //     expect(result).toEqual({
        //         success: false
        //     });
        //
        //     // Verify that Resend's send method was called
        //     expect(mockResend.emails.send).toHaveBeenCalledTimes(1);
        // });
    });
});