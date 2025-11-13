import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '../lib/analytics';

const AnalyticsDashboard: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Actualizar datos cada 2 segundos
    const interval = setInterval(() => {
      setEvents(getEvents());
      setRefreshKey(prev => prev + 1);
    }, 2000);

    // Cargar datos iniciales
    setEvents(getEvents());

    return () => clearInterval(interval);
  }, [getEvents]);

  // Procesar datos para gráficas
  const eventsByCategory = events.reduce((acc: Record<string, number>, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(eventsByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: {
      navigation: '#3b82f6',
      product: '#10b981',
      simulation: '#f59e0b',
      ui: '#8b5cf6',
      store: '#06b6d4'
    }[name] || '#6b7280'
  }));

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

  return (
    <div className="space-y-8">
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

      {/* Gráficas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribución por categoría */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold mb-4">Eventos por Categoría</h3>
          {pieData.length > 0 ? (
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No hay datos aún. Interactúa con la aplicación.</p>
          )}
        </div>

        {/* Acciones más frecuentes */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold mb-4">Acciones Más Frecuentes</h3>
          {barData.length > 0 ? (
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No hay datos aún.</p>
          )}
        </div>
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
      <div className="rounded-xl border border-purple-500/30 dark:border-purple-500/30 light:border-purple-300/50 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 dark:from-purple-900/20 dark:to-indigo-900/20 light:from-purple-50/80 light:to-indigo-50/80 p-8">
        <h3 className="text-xl font-bold text-purple-400 dark:text-purple-400 light:text-purple-700 mb-4">Implementación Técnica</h3>
        <div className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 space-y-3 leading-relaxed">
          <p><strong>Tracking en tiempo real:</strong> Eventos capturados con singleton pattern y localStorage</p>
          <p><strong>Auto-refresh:</strong> Dashboard se actualiza cada 2 segundos automáticamente</p>
          <p><strong>Optimización:</strong> Solo mantiene los últimos 50 eventos para rendimiento</p>
          <p><strong>Escalabilidad:</strong> Fácil integración con Google Analytics, Mixpanel, etc.</p>
          <p><strong>Privacy-first:</strong> Datos solo en localStorage, no se envían a terceros</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
