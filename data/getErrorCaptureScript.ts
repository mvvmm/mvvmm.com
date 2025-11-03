/**
 * Returns the error capture script that gets injected into experience iframes.
 * This script captures JavaScript errors, unhandled promise rejections, and console errors,
 * sending them to the parent window via postMessage.
 */
export const getErrorCaptureScript = (): string => {
  return `
    <script>
      (function() {
        // Capture window.onerror for JavaScript runtime errors
        window.onerror = function(message, filename, lineno, colno, error) {
          window.parent.postMessage({
            type: 'EXPERIENCE_ERROR',
            error: {
              message: message,
              filename: filename || 'unknown',
              lineno: lineno || 0,
              colno: colno || 0,
              stack: error && error.stack ? error.stack : null,
            }
          }, '*');
          return false; // Allow default error handling to continue
        };

        // Capture unhandled promise rejections
        window.onunhandledrejection = function(event) {
          window.parent.postMessage({
            type: 'EXPERIENCE_ERROR',
            error: {
              message: event.reason && event.reason.toString ? event.reason.toString() : 'Unhandled promise rejection',
              filename: 'unknown',
              lineno: 0,
              colno: 0,
              stack: event.reason && event.reason.stack ? event.reason.stack : null,
            }
          }, '*');
        };

        // Override console.error to capture console errors
        const originalConsoleError = console.error;
        console.error = function(...args) {
          // Call original console.error
          originalConsoleError.apply(console, args);
          
          // Send to parent
          const errorMessage = args.map(arg => {
            if (arg instanceof Error) {
              return arg.toString();
            }
            return String(arg);
          }).join(' ');
          
          window.parent.postMessage({
            type: 'EXPERIENCE_ERROR',
            error: {
              message: errorMessage,
              filename: 'console',
              lineno: 0,
              colno: 0,
              stack: null,
            }
          }, '*');
        };
      })();
    </script>
  `;
};
