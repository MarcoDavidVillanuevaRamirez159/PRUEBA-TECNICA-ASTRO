import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { StoreStats } from '../lib/sales';


interface StoreSalesChartProps {
  data: StoreStats[];
}

const StoreSalesChart: React.FC<StoreSalesChartProps> = ({ data }) => {

  // Preparar datos para la gráfica
  const chartData = data.map(store => ({
    nombre: store.store.replace('Sucursal ', ''),
    fullName: store.store,
    ingresos: store.totalRevenue,
    tickets: store.totalTickets,
    productos: store.productCount,
    ticketPromedio: store.avgTicket,
    margenPromedio: (store.avgMargin * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg p-4 shadow-xl backdrop-blur-sm">
          <p className="text-slate-100 dark:text-slate-100 light:text-slate-900 font-semibold mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-medium">
              Ingresos: ${data.ingresos.toLocaleString()}
            </p>
            <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">
              Tickets: {data.tickets.toLocaleString()}
            </p>
            <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">
              Productos: {data.productos}
            </p>
            <p className="text-blue-400 dark:text-blue-400 light:text-blue-600 font-medium">
              Ticket promedio: ${data.ticketPromedio.toFixed(2)}
            </p>
            <p className="text-amber-400 dark:text-amber-400 light:text-amber-600 font-medium">
              Margen promedio: {data.margenPromedio}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >

          <XAxis
            dataKey="nombre"

            fontSize={12}
          />
          <YAxis

            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="ingresos"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StoreSalesChart;
