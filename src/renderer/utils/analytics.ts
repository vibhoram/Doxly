// Doxly Analytics - Track Everything
// Privacy-first: No personal data stored

interface AnalyticsEvent {
  event: string;
  tool?: string;
  fileSize?: number;
  duration?: number;
  timestamp: number;
  sessionId: string;
}

class DoxlyAnalytics {
  private sessionId: string;
  private sessionStart: number;
  private events: AnalyticsEvent[] = [];
  private apiUrl: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Track session start
    this.track('session_start');
    
    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        duration: Date.now() - this.sessionStart
      });
      this.flush();
    });

    // Auto-flush every 30 seconds
    setInterval(() => this.flush(), 30000);
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  track(event: string, data?: Partial<AnalyticsEvent>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...data
    };

    this.events.push(analyticsEvent);
    
    // Log to console in dev mode
    if (import.meta.env.DEV) {
      console.log('📊 Analytics:', analyticsEvent);
    }
  }

  // Track tool usage
  trackToolOpen(toolName: string) {
    this.track('tool_open', { tool: toolName });
  }

  trackToolComplete(toolName: string, duration: number, fileSize?: number) {
    this.track('tool_complete', { 
      tool: toolName, 
      duration,
      fileSize 
    });
  }

  // Track file uploads
  trackFileUpload(fileCount: number, totalSize: number) {
    this.track('file_upload', { 
      fileSize: totalSize 
    });
  }

  // Track page views
  trackPageView(page: string) {
    this.track('page_view', { tool: page });
  }

  // Track errors
  trackError(error: string, tool?: string) {
    this.track('error', { tool, fileSize: 0 });
  }

  // Send events to backend
  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(`${this.apiUrl}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend })
      });
    } catch (error) {
      // Silently fail - don't break app if analytics fails
      console.error('Analytics flush failed:', error);
    }
  }

  // Get session stats
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.sessionStart,
      eventsCount: this.events.length
    };
  }
}

// Export singleton instance
export const analytics = new DoxlyAnalytics();
