import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Sale } from '../lib/sales';


interface ProductRevenueChartProps {
  data: Sale[];
}

const ProductRevenueChart: React.FC<ProductRevenueChartProps> = ({ data }) => {


  // Preparar datos para la gráfica, ordenados por ingresos de mayor a menor
  const chartData = data
    .sort((a, b) => b.revenue - a.revenue)
    .map(sale => ({
      name: sale.name.length > 15 ? sale.name.substring(0, 15) + '...' : sale.name,
      fullName: sale.name,
      ingresos: sale.revenue,
      ventas: sale.totalSales,
      margen: (sale.margin * 100).toFixed(1)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg p-4 shadow-xl backdrop-blur-sm">
          <p className="text-slate-100 dark:text-slate-100 light:text-slate-900 font-semibold mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 text-sm font-medium">
              Ingresos: ${data.ingresos.toLocaleString()}
            </p>
            <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 text-sm">
              Ventas: {data.ventas} unidades
            </p>
            <p className="text-amber-400 dark:text-amber-400 light:text-amber-600 text-sm font-medium">
              Margen: {data.margen}%
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
            top: 10,
            right: 10,
            left: 10,
            bottom: 40,
          }}
        >

          <XAxis
            dataKey="name"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 

            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="ingresos" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductRevenueChart;
