import React, { useMemo, useState } from "react";
import type { Sale } from '../lib/sales';

interface SalesListProps {
    items: Sale[];
}

const SalesList: React.FC<SalesListProps> = ({ items }) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);


    const categories = useMemo(
        () => Array.from(new Set(items.map((i) => i.category))),
        [items]
    );

    const stores = useMemo(
        () => Array.from(new Set(items.map((i) => i.store))),
        [items]
    );

    const filteredItems = useMemo(
        () =>
            items.filter((item) => {
                const matchSearch =
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.category.toLowerCase().includes(search.toLowerCase());

                const matchCategory = category ? item.category === category : true;
                const matchStore = store ? item.store === store : true;

                return matchSearch && matchCategory && matchStore;
            }),
        [items, search, category, store]
    );

    const handleItemSelection = (slug: string, checked: boolean) => {
        if (checked) {
            if (selectedItems.length < 3) {
                setSelectedItems([...selectedItems, slug]);
            }
        } else {
            setSelectedItems(selectedItems.filter(item => item !== slug));
        }
    };

    const handleCompare = () => {
        if (selectedItems.length >= 2) {
            const compareUrl = `/compare?items=${selectedItems.join(',')}`;
            window.location.href = compareUrl;
        }
    };

    return (
        <div className="space-y-6">
            {/* Controles */}
            <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full lg:w-80 px-3 md:px-4 py-2 text-sm md:text-base bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <select
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-sm md:text-base bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-sm md:text-base bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                    >
                        <option value="">Todas las sucursales</option>
                        {stores.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                </div>

                {/* Barra de comparación fija */}
                {selectedItems.length > 0 && (
                    <div className="sticky top-4 z-10 bg-slate-900 border border-slate-700 rounded-lg p-3 md:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-emerald-600 rounded-full text-white font-bold text-xs md:text-sm">
                                    {selectedItems.length}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-100 text-sm md:text-base">
                                        {selectedItems.length === 1 ? 'Producto seleccionado' :
                                         selectedItems.length === 2 ? 'Listos para comparar' :
                                         'Máximo seleccionados'}
                                    </p>
                                    <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                                        {selectedItems.length < 2 ? 'Selecciona al menos 2 productos para comparar' :
                                         selectedItems.length === 2 ? 'Puedes agregar 1 producto más' :
                                         'Límite máximo alcanzado'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setSelectedItems([])}
                                    className="flex-1 sm:flex-none px-3 py-2 text-xs md:text-sm text-slate-400 hover:text-slate-100 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
                                >
                                    Limpiar
                                </button>
                                <button
                                    onClick={handleCompare}
                                    disabled={selectedItems.length < 2}
                                    className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                >
                                    {selectedItems.length < 2 ? 'Comparar' : `Comparar ${selectedItems.length}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg">
                <table className="min-w-full text-xs md:text-sm">
                    <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-slate-300">
                            <span className="text-xs">Comp.</span>
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-slate-300 min-w-0">
                            <span className="hidden sm:inline">Producto</span>
                            <span className="sm:hidden">Prod.</span>
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-slate-300 hidden lg:table-cell">
                            Categoría
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-slate-300 hidden md:table-cell">
                            <span className="hidden lg:inline">Sucursal</span>
                            <span className="lg:hidden">Suc.</span>
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-right font-medium text-slate-300">
                            <span className="hidden sm:inline">Ventas</span>
                            <span className="sm:hidden">Vent.</span>
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-right font-medium text-slate-300 hidden sm:table-cell">
                            <span className="hidden md:inline">Tickets</span>
                            <span className="md:hidden">Tick.</span>
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-right font-medium text-slate-300">
                            <span className="hidden sm:inline">Ingresos</span>
                            <span className="sm:hidden">Ingr.</span>
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-right font-medium text-slate-300">
                            <span className="hidden sm:inline">Margen</span>
                            <span className="sm:hidden">Marg.</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map((item) => (
                        <tr
                            key={item.slug}
                            className="border-t border-slate-700 hover:bg-slate-800 transition-colors"
                        >
                            <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.slug)}
                                    disabled={!selectedItems.includes(item.slug) && selectedItems.length >= 3}
                                    onChange={(e) => handleItemSelection(item.slug, e.target.checked)}
                                    className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                            <td
                                className="px-2 md:px-4 py-2 md:py-3 text-blue-400 cursor-pointer hover:text-blue-300 font-medium transition-colors min-w-0"
                                onClick={() => {
                                    window.location.href = `/item/${item.slug}`;
                                }}
                            >
                                <div className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none" title={item.name}>
                                    {item.name}
                                </div>
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-slate-300 hidden lg:table-cell">
                                <div className="truncate max-w-[100px]" title={item.category}>
                                    {item.category}
                                </div>
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-slate-300 hidden md:table-cell">
                                <div className="truncate max-w-[80px] lg:max-w-[120px]" title={item.store}>
                                    {item.store}
                                </div>
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-right text-slate-200">
                                <span className="text-xs md:text-sm">
                                    {item.totalSales.toLocaleString()}
                                </span>
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-right text-slate-200 hidden sm:table-cell">
                                <span className="text-xs md:text-sm">
                                    {item.tickets.toLocaleString()}
                                </span>
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-right text-emerald-400 font-medium">
                                <span className="text-xs md:text-sm">
                                    ${item.revenue.toLocaleString()}
                                </span>
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-right text-amber-400 font-medium">
                                <span className="text-xs md:text-sm">
                                    {(item.margin * 100).toFixed(0)}%
                                </span>
                            </td>
                        </tr>
                    ))}

                    {filteredItems.length === 0 && (
                        <tr>
                            <td
                                colSpan={8}
                                className="px-4 md:px-6 py-8 md:py-12 text-center text-slate-400"
                            >
                                <div className="space-y-1 md:space-y-2">
                                    <p className="font-medium text-sm md:text-base">No se encontraron resultados</p>
                                    <p className="text-xs md:text-sm">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesList;
