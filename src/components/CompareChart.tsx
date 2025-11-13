import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Sale } from '../lib/sales';


interface CompareChartProps {
  items: Sale[];
}

const CompareChart: React.FC<CompareChartProps> = ({ items }) => {

  const chartData = items.map(item => ({
    nombre: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
    fullName: item.name,
    ingresos: item.revenue,
    ventas: item.totalSales,
    tickets: item.tickets,
    margen: item.margin * 100
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-slate-100 font-medium mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400">
              Ingresos: ${data.ingresos.toLocaleString()}
            </p>
            <p className="text-blue-400">
              Ventas: {data.ventas.toLocaleString()} unidades
            </p>
            <p className="text-slate-300">
              Tickets: {data.tickets.toLocaleString()}
            </p>
            <p className="text-amber-400">
              Margen: {data.margen.toFixed(1)}%
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
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="nombre"
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Legend />
          <Bar
            dataKey="ingresos"
            fill="#10b981"
            name="Ingresos ($)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompareChart;
