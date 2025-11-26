
/**
 * WebView Logger Utility
 * 
 * This utility helps with debugging WebView issues by providing
 * structured logging and error tracking.
 */

export interface WebViewLogEntry {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: any;
}

class WebViewLogger {
  private logs: WebViewLogEntry[] = [];
  private maxLogs: number = 100;

  /**
   * Log an info message
   */
  info(message: string, data?: any) {
    this.addLog('info', message, data);
    console.log(`[WebView Info] ${message}`, data || '');
  }

  /**
   * Log a warning message
   */
  warning(message: string, data?: any) {
    this.addLog('warning', message, data);
    console.warn(`[WebView Warning] ${message}`, data || '');
  }

  /**
   * Log an error message
   */
  error(message: string, data?: any) {
    this.addLog('error', message, data);
    console.error(`[WebView Error] ${message}`, data || '');
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: any) {
    this.addLog('debug', message, data);
    console.log(`[WebView Debug] ${message}`, data || '');
  }

  /**
   * Add a log entry
   */
  private addLog(type: WebViewLogEntry['type'], message: string, data?: any) {
    const entry: WebViewLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get all logs
   */
  getLogs(): WebViewLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by type
   */
  getLogsByType(type: WebViewLogEntry['type']): WebViewLogEntry[] {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Get recent logs (last n entries)
   */
  getRecentLogs(count: number = 10): WebViewLogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    console.log('[WebView Logger] Logs cleared');
  }

  /**
   * Export logs as JSON string
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error summary
   */
  getErrorSummary(): { count: number; errors: WebViewLogEntry[] } {
    const errors = this.getLogsByType('error');
    return {
      count: errors.length,
      errors,
    };
  }

  /**
   * Check if there are recent errors (within last 5 minutes)
   */
  hasRecentErrors(minutesAgo: number = 5): boolean {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);
    return this.logs.some(
      log => log.type === 'error' && new Date(log.timestamp) > cutoffTime
    );
  }
}

// Export singleton instance
export const webViewLogger = new WebViewLogger();

// Export helper functions for common logging scenarios
export const logWebViewEvent = {
  loadStart: (url: string) => {
    webViewLogger.info('WebView load started', { url });
  },

  loadEnd: (url: string) => {
    webViewLogger.info('WebView load ended', { url });
  },

  loadProgress: (progress: number, url: string) => {
    webViewLogger.debug('WebView load progress', { progress, url });
  },

  navigationChange: (url: string, canGoBack: boolean, canGoForward: boolean) => {
    webViewLogger.info('WebView navigation changed', {
      url,
      canGoBack,
      canGoForward,
    });
  },

  error: (error: any, url?: string) => {
    webViewLogger.error('WebView error occurred', {
      error: error.description || error.message || 'Unknown error',
      code: error.code,
      url,
    });
  },

  httpError: (statusCode: number, url: string) => {
    webViewLogger.error('WebView HTTP error', { statusCode, url });
  },

  message: (message: string, data?: any) => {
    webViewLogger.debug('WebView message received', { message, data });
  },

  reload: () => {
    webViewLogger.info('WebView reload triggered');
  },

  goBack: () => {
    webViewLogger.info('WebView go back triggered');
  },

  goForward: () => {
    webViewLogger.info('WebView go forward triggered');
  },
};

export default webViewLogger;
