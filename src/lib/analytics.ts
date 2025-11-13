// Utilidades para tracking de eventos de analítica
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];

  track(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
    };

    this.events.push(analyticsEvent);



    // Simular llamada a API de analytics
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-50))); // Mantener solo los últimos 50 eventos
    }
  }

  trackPageView(page: string) {
    this.track({
      event: 'page_view',
      category: 'navigation',
      action: 'view_page',
      label: page
    });
  }

  trackProductView(productSlug: string, productName: string) {
    this.track({
      event: 'product_view',
      category: 'product',
      action: 'view_detail',
      label: `${productSlug}:${productName}`
    });
  }

  trackProductCompare(productSlugs: string[]) {
    this.track({
      event: 'product_compare',
      category: 'product',
      action: 'compare_products',
      label: productSlugs.join(','),
      value: productSlugs.length
    });
  }

  trackSimulation(productSlug: string, priceChange: number, elasticity: number) {
    this.track({
      event: 'price_simulation',
      category: 'simulation',
      action: 'run_what_if',
      label: `${productSlug}:price_${priceChange}%:elasticity_${elasticity}`,
      value: priceChange
    });
  }

  trackThemeChange(newTheme: 'light' | 'dark') {
    this.track({
      event: 'theme_change',
      category: 'ui',
      action: 'change_theme',
      label: newTheme
    });
  }

  trackStoreView(storeName: string) {
    this.track({
      event: 'store_view',
      category: 'store',
      action: 'view_analytics',
      label: storeName
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.events.filter(event => event.category === category);
  }
}

// Singleton instance
export const analytics = new Analytics();

// Hook para React components
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackProductCompare: analytics.trackProductCompare.bind(analytics),
    trackSimulation: analytics.trackSimulation.bind(analytics),
    trackThemeChange: analytics.trackThemeChange.bind(analytics),
    trackStoreView: analytics.trackStoreView.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics),
    getEventsByCategory: analytics.getEventsByCategory.bind(analytics),
  };
}
