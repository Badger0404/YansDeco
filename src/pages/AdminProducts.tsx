import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Download,
  Filter,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

const AdminProducts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm(t('admin.products.confirmDelete'))) return;
    
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const getProductName = (product: any) => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en;
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en;
    if (lang === 'en') return product.name_en || product.name_ru || product.name_fr;
    return product.name_fr || '';
  };

  const mutedClass = 'text-zinc-600 dark:text-zinc-400';
  const borderClass = 'border-zinc-200 dark:border-zinc-700/50';
  const hoverBorderClass = 'hover:border-[#FF6B00]';
  const textClass = 'text-zinc-900 dark:text-white';

  const filteredProducts = products.filter(product => 
    getProductName(product).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-black italic text-2xl md:text-3xl uppercase tracking-tight text-[#FF6B00]">
              {t('admin.products.title')}
            </h1>
            <p className={`text-xs ${mutedClass} mt-1`}>
              {t('admin.sections.products.description')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">{t('admin.quickActions.importCsv')}</span>
              <span className="sm:hidden">CSV</span>
            </button>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">{t('admin.quickActions.exportData')}</span>
              <span className="sm:hidden">EXP</span>
            </button>
            <Link 
              to="/admin/add-product"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors whitespace-nowrap"
            >
              <Plus className="w-3 h-3" />
              {t('admin.products.addNew')}
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedClass}`} />
            <input
              type="text"
              placeholder={t('admin.products.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-transparent border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} placeholder-zinc-500`}
            />
          </div>
          <button className={`flex items-center gap-1.5 px-4 py-2.5 border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 sm:p-5 bg-transparent border ${borderClass} ${hoverBorderClass} rounded-xl transition-all duration-500 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-1 ${textClass}`}>
                    {getProductName(product)}
                  </h3>
                  <p className="text-xs text-zinc-400">{product.brand_name || 'Sans marque'}</p>
                </div>
                <span className={`text-lg font-bold ${textClass}`}>
                  {product.price?.toFixed(2)} €
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-zinc-400">
                  <span>{t('admin.products.stock')}: </span>
                  <span className={product.stock > 50 ? 'text-green-500' : product.stock > 20 ? 'text-yellow-500' : 'text-red-500'}>
                    {product.stock}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.is_popular 
                    ? 'bg-[#FF6B00]/20 text-[#FF6B00]' 
                    : 'bg-green-500/20 text-green-500'
                }`}>
                  {product.is_popular ? '⭐ Populaire' : 'Actif'}
                </span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('admin.products.view')}</span>
                </button>
                <button 
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('admin.products.edit')}</span>
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold uppercase tracking-wide border border-red-500/50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
            <ArrowUpDown className="w-3.5 h-3.5" />
            Charger plus
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
