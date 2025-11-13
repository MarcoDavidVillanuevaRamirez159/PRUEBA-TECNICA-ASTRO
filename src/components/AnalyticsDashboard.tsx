import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '../lib/analytics';

const AnalyticsDashboard: React.FC = () => {
  const { getEvents } = useAnalytics();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de demostración siempre disponibles
  const getDemoData = () => [
    { event: 'page_view', category: 'navigation', action: 'view_page', label: 'index', timestamp: Date.now() - 300000 },
    { event: 'product_view', category: 'product', action: 'view_product', label: 'coca-cola-600ml', timestamp: Date.now() - 240000 },
    { event: 'product_compare', category: 'product', action: 'compare_products', label: '2 items', timestamp: Date.now() - 180000 },
    { event: 'store_view', category: 'store', action: 'view_stores', timestamp: Date.now() - 120000 },
    { event: 'filter_change', category: 'ui', action: 'change_filter', label: 'category', timestamp: Date.now() - 60000 },
    { event: 'product_view', category: 'product', action: 'view_product', label: 'pan-blanco', timestamp: Date.now() - 50000 },
    { event: 'page_view', category: 'navigation', action: 'view_page', label: 'stores', timestamp: Date.now() - 40000 }
  ];

  useEffect(() => {
    // Cargar datos iniciales
    setTimeout(() => {
      const realEvents = getEvents();
      const displayEvents = realEvents.length > 0 ? realEvents : getDemoData();
      setEvents(displayEvents);
      setIsLoading(false);
    }, 500);

    // Actualizar datos cada 5 segundos
    const interval = setInterval(() => {
      const currentEvents = getEvents();
      setEvents(currentEvents.length > 0 ? currentEvents : getDemoData());
    }, 5000);

    return () => clearInterval(interval);
  }, [getEvents]);

  // Procesar datos para gráficas

  const eventsByAction = events.reduce((acc: Record<string, number>, event) => {
    acc[event.action] = (acc[event.action] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(eventsByAction).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }));

  // Eventos recientes
  const recentEvents = events.slice(-10).reverse();

  // Productos más vistos
  const productEvents = events.filter(e => e.category === 'product');
  const productViews = productEvents.reduce((acc: Record<string, number>, event) => {
    if (event.action === 'view_detail' && event.label) {
      const productName = event.label.split(':')[1];
      acc[productName] = (acc[productName] || 0) + 1;
    }
    return acc;
  }, {});

  const topProducts = Object.entries(productViews)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, views]) => ({ name, views }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-800 rounded w-48"></div>
            <div className="h-4 bg-slate-800 rounded w-32"></div>
          </div>
          <p className="mt-4 text-sm">Cargando dashboard de analytics...</p>
        </div>
      </div>
    );
  }

  const isDemo = getEvents().length === 0;

  return (
    <div className="space-y-8">
      {isDemo && (
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
             <strong>Modo demostración:</strong> Estos son datos de ejemplo. Navega por la aplicación para generar eventos reales.
          </p>
        </div>
      )}

      {/* Stats generales */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400 mb-1">Total eventos</p>
          <p className="text-2xl font-semibold text-slate-100">{events.length}</p>
          <p className="text-xs text-emerald-400 mt-1">En esta sesión</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400 mb-1">Productos vistos</p>
          <p className="text-2xl font-semibold text-blue-400">{Object.keys(productViews).length}</p>
          <p className="text-xs text-slate-500 mt-1">Únicos</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400 mb-1">Simulaciones</p>
          <p className="text-2xl font-semibold text-amber-400">
            {events.filter(e => e.category === 'simulation').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">What-if ejecutadas</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400 mb-1">Comparaciones</p>
          <p className="text-2xl font-semibold text-emerald-400">
            {events.filter(e => e.action === 'compare_products').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Realizadas</p>
        </div>
      </div>

      {/* Gráfica de acciones */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Más Frecuentes</h3>
        {barData.length > 0 ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
                          <p className="text-slate-100 font-medium">{label}</p>
                          <p className="text-emerald-400 text-sm">{payload[0].value} veces</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  stroke="#059669"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No hay datos aún.</p>
        )}
      </div>

      {/* Dos columnas: Eventos recientes y Productos top */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Eventos recientes */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <span className="text-slate-200">{event.action.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="px-2 py-1 bg-slate-700 rounded">{event.category}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No hay eventos recientes</p>
            )}
          </div>
        </div>

        {/* Productos más vistos */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold mb-4">Productos Más Vistos</h3>
          <div className="space-y-2">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">#{index + 1}</span>
                    <span className="text-slate-200 text-sm">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-medium">{product.views}</span>
                    <span className="text-xs text-slate-500">vistas</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No hay productos visitados aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Nota técnica */}
      <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Implementación Técnica</h3>
        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p><strong>Tracking en tiempo real:</strong> Eventos capturados con singleton pattern y localStorage</p>
          <p><strong>Auto-refresh:</strong> Dashboard se actualiza cada 5 segundos automáticamente</p>
          <p><strong>Optimización:</strong> Solo mantiene los últimos 50 eventos para rendimiento</p>
          <p><strong>Escalabilidad:</strong> Fácil integración con Google Analytics, Mixpanel, etc.</p>
          <p><strong>Privacy-first:</strong> Datos solo en localStorage, no se envían a terceros</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
