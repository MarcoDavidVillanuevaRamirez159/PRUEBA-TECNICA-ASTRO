import salesData from '../data/sales.json';

export interface Sale {
  slug: string;
  name: string;
  category: string;
  store: string;
  totalSales: number;
  tickets: number;
  revenue: number;
  margin: number;
}

export interface StoreStats {
  store: string;
  totalSales: number;
  totalTickets: number;
  totalRevenue: number;
  avgTicket: number;
  avgMargin: number;
  productCount: number;
}

export interface ProductStats {
  totalProducts: number;
  totalRevenue: number;
  totalTickets: number;
  totalSales: number;
  avgMargin: number;
}

/**
 * Obtiene todas las ventas desde el archivo JSON
 */
export function getAllSales(): Sale[] {
  return salesData as Sale[];
}

/**
 * Obtiene una venta específica por su slug
 */
export function getSaleBySlug(slug: string): Sale | undefined {
  const sales = getAllSales();
  return sales.find(sale => sale.slug === slug);
}

/**
 * Obtiene múltiples ventas por sus slugs (útil para el comparador)
 */
export function getSalesBySlugs(slugs: string[]): Sale[] {
  const sales = getAllSales();
  return sales.filter(sale => slugs.includes(sale.slug));
}

/**
 * Calcula estadísticas agregadas por sucursal
 */
export function getStoreStats(): StoreStats[] {
  const sales = getAllSales();
  const storeMap = new Map<string, Sale[]>();
  
  // Agrupar ventas por sucursal
  sales.forEach(sale => {
    const storeSales = storeMap.get(sale.store) || [];
    storeSales.push(sale);
    storeMap.set(sale.store, storeSales);
  });
  
  // Calcular estadísticas por sucursal
  return Array.from(storeMap.entries()).map(([store, storeSales]) => {
    const totalSales = storeSales.reduce((sum, sale) => sum + sale.totalSales, 0);
    const totalTickets = storeSales.reduce((sum, sale) => sum + sale.tickets, 0);
    const totalRevenue = storeSales.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalMargin = storeSales.reduce((sum, sale) => sum + (sale.margin * sale.revenue), 0);
    
    return {
      store,
      totalSales,
      totalTickets,
      totalRevenue,
      avgTicket: totalRevenue / totalTickets,
      avgMargin: totalMargin / totalRevenue,
      productCount: storeSales.length
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

/**
 * Calcula estadísticas globales de productos
 */
export function getProductStats(): ProductStats {
  const sales = getAllSales();
  
  const totalProducts = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalTickets = sales.reduce((sum, sale) => sum + sale.tickets, 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalMargin = sales.reduce((sum, sale) => sum + (sale.margin * sale.revenue), 0);
  
  return {
    totalProducts,
    totalRevenue,
    totalTickets,
    totalSales,
    avgMargin: totalMargin / totalRevenue
  };
}

/**
 * Obtiene las categorías únicas
 */
export function getCategories(): string[] {
  const sales = getAllSales();
  return Array.from(new Set(sales.map(sale => sale.category)));
}

/**
 * Obtiene las sucursales únicas
 */
export function getStores(): string[] {
  const sales = getAllSales();
  return Array.from(new Set(sales.map(sale => sale.store)));
}

/**
 * Simula el impacto de un cambio de precio en un producto
 */
export function simulatePriceChange(
  sale: Sale, 
  priceChangePercent: number, 
  demandElasticity: number = -1.2
): {
  newSales: number;
  newRevenue: number;
  newMargin: number;
  revenueChange: number;
  marginChange: number;
} {
  // Calcular precio original aproximado
  const originalPrice = sale.revenue / sale.totalSales;
  const newPrice = originalPrice * (1 + priceChangePercent / 100);
  
  // Calcular nueva demanda usando elasticidad
  const demandChange = demandElasticity * (priceChangePercent / 100);
  const newSales = Math.max(0, sale.totalSales * (1 + demandChange));
  
  // Calcular nuevos valores
  const newRevenue = newSales * newPrice;
  const costPerUnit = originalPrice * (1 - sale.margin);
  const newMargin = (newPrice - costPerUnit) / newPrice;
  
  // Calcular cambios
  const revenueChange = ((newRevenue - sale.revenue) / sale.revenue) * 100;
  const marginChange = ((newMargin - sale.margin) / sale.margin) * 100;
  
  return {
    newSales: Math.round(newSales),
    newRevenue: Math.round(newRevenue),
    newMargin: Math.max(0, newMargin),
    revenueChange,
    marginChange
  };
}
