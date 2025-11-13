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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl">
          <p className="text-slate-100 font-semibold mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400 font-medium">
              Ingresos: ${data.ingresos.toLocaleString()}
            </p>
            <p className="text-slate-300">
              Tickets: {data.tickets.toLocaleString()}
            </p>
            <p className="text-slate-300">
              Productos: {data.productos}
            </p>
            <p className="text-blue-400 font-medium">
              Ticket promedio: ${data.ticketPromedio.toFixed(2)}
            </p>
            <p className="text-amber-400 font-medium">
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
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
