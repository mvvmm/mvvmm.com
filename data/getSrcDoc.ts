import type {
  Html,
  Hydra,
  Script,
  Strudel,
  Stylesheet,
} from "@/types/experience";
import { getErrorCaptureScript } from "./getErrorCaptureScript";

/**
 * Escapes content for safe embedding in HTML tags.
 * Prevents XSS by escaping sequences that could break out of tags.
 * Escapes closing script and style tags - we use string concatenation instead of
 * template literals to avoid needing to escape ${ and backticks.
 */
function escapeScriptContent(content: string): string {
  return content.replace(/<\/script>/gi, "<\\/script>");
}

/**
 * Escapes CSS content for safe embedding in style tags.
 * Prevents XSS by escaping sequences that could break out of style tags.
 */
function escapeStyleContent(content: string): string {
  return content.replace(/<\/style>/gi, "<\\/style>");
}

/**
 * Returns a MediaSource polyfill script for mobile browsers that don't support MediaSource API.
 * This prevents "can't find variable: MediaSource" errors on mobile devices.
 *
 * Note: There isn't a widely adopted third-party MediaSource polyfill because MediaSource
 * is deeply tied to browser media capabilities and difficult to polyfill. This stub
 * implementation prevents reference errors while indicating no support via isTypeSupported.
 */
function getMediaSourcePolyfillScript(): string {
  return `
    <script>
      (function() {
        // Polyfill MediaSource for browsers that don't support it (especially mobile)
        var global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
        
        if (typeof global.MediaSource === 'undefined') {
          // Provide a minimal no-op implementation to prevent "can't find variable" errors
          function MediaSourceStub() {
            var self = this;
            var listeners = {};
            
            // Simple event emitter implementation
            function addEventListener(type, listener) {
              if (!listeners[type]) {
                listeners[type] = [];
              }
              listeners[type].push(listener);
            }
            
            function removeEventListener(type, listener) {
              if (listeners[type]) {
                var index = listeners[type].indexOf(listener);
                if (index > -1) {
                  listeners[type].splice(index, 1);
                }
              }
            }
            
            function dispatchEvent(event) {
              if (listeners[event.type]) {
                listeners[event.type].forEach(function(listener) {
                  try {
                    if (typeof listener === 'function') {
                      listener(event);
                    } else if (listener && typeof listener.handleEvent === 'function') {
                      listener.handleEvent(event);
                    }
                  } catch (e) {
                    // Silently ignore errors in event handlers
                  }
                });
              }
              return true;
            }
            
            // Return a minimal object that won't break code checking for MediaSource existence
            return {
              addSourceBuffer: function() { return null; },
              endOfStream: function() {},
              removeSourceBuffer: function() {},
              sourceBuffers: { length: 0 },
              readyState: 'closed',
              duration: NaN,
              activeSourceBuffers: { length: 0 },
              onsourceopen: null,
              onsourceended: null,
              onsourceclose: null,
              addEventListener: addEventListener,
              removeEventListener: removeEventListener,
              dispatchEvent: dispatchEvent
            };
          }
          
          MediaSourceStub.isTypeSupported = function() {
            return false;
          };
          
          // Set on global object and window if available
          global.MediaSource = MediaSourceStub;
          if (typeof window !== 'undefined') {
            window.MediaSource = MediaSourceStub;
          }
          
          // Also handle webkit prefix for older browsers
          if (typeof global.WebKitMediaSource === 'undefined') {
            global.WebKitMediaSource = MediaSourceStub;
            if (typeof window !== 'undefined') {
              window.WebKitMediaSource = MediaSourceStub;
            }
          }
        }
      })();
    </script>
  `;
}

export const getSrcDoc = ({
  scripts,
  stylesheets,
  htmls,
  strudels = [],
  hydras = [],
}: {
  scripts: Script[];
  stylesheets: Stylesheet[];
  htmls: Html[];
  strudels?: Strudel[];
  hydras?: Hydra[];
}) => {
  // Note: strudels are intentionally excluded from the srcdoc.
  // They are handled separately in the client-side code via the Strudel REPL.
  const hasHydra = hydras.length > 0;
  const hydraCode = hasHydra
    ? "<script>\n" +
      "      (function() {\n" +
      "        function initHydra() {\n" +
      "          if (typeof Hydra !== 'undefined' && document.body) {\n" +
      "            new Hydra();\n" +
      hydras
        .map((hydra) => escapeScriptContent(hydra.contents.trim()))
        .join("\n") +
      "\n" +
      "          } else {\n" +
      "            // Wait for both Hydra library and DOM to be ready\n" +
      "            requestAnimationFrame(initHydra);\n" +
      "          }\n" +
      "        }\n" +
      "        \n" +
      "        if (document.readyState === 'loading') {\n" +
      "          document.addEventListener('DOMContentLoaded', initHydra);\n" +
      "        } else {\n" +
      "          initHydra();\n" +
      "        }\n" +
      "      })();\n" +
      "    </script>"
    : "";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      ${stylesheets
        .map(
          (stylesheet) =>
            "<style>" + escapeStyleContent(stylesheet.contents) + "</style>"
        )
        .join("")}
    </head>
    <body>
      ${htmls.map((html) => `${html.contents}`).join("")}
      ${getMediaSourcePolyfillScript()}
      ${getErrorCaptureScript()}
      ${scripts
        .map(
          (script) =>
            "<script>" + escapeScriptContent(script.contents) + "</script>"
        )
        .join("")}
      ${hydraCode}
    </body>
  </html>
  `;
};
