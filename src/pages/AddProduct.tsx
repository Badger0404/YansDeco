import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, RefreshCw, Sparkles, X, Check } from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';

type Lang = 'ru' | 'fr' | 'en';
type Localized = { name: string; description: string };

interface Brand { id: number; name: string; }
interface Category { id: number; name_fr?: string; name_ru?: string; name_en?: string; parent_id?: number | null; }

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [translations, setTranslations] = useState<{ ru: Localized; fr: Localized; en: Localized }>(
    { ru: { name: '', description: '' }, fr: { name: '', description: '' }, en: { name: '', description: '' } }
  );
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState('');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    (window as any).runTranslate = () => doTranslate('ru');
  }, []);

  const fetchCategories = async () => {
    try {
      const r = await fetch(`${API_URL}/categories`);
      const data = await r.json();
      if (data?.success) setCategories(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchBrands = async () => {
    try {
      const r = await fetch(`${API_URL}/brands`);
      const data = await r.json();
      if (data?.success) setBrands(data.data);
    } catch (e) { console.error(e); }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) await uploadImage(f); };
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) await uploadImage(f); };
  const uploadImage = async (file: File) => {
    setIsUploading(true); setError('');
    const formData = new FormData(); formData.append('file', file); formData.append('folder', 'products');
    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
      const text = await res.text(); let data: any;
      try { data = JSON.parse(text); } catch { data = null; }
      if (data?.success) { setImageUrl(data.data.url); setImagePreview(data.data.url); } else { setError(data?.error ?? 'Upload error'); }
    } catch (e) { setError('Upload error: ' + (e as Error).message); }
    finally { setIsUploading(false); }
  };

  const handleBarcodeScan = async (scannedBarcode: string) => {
    setBarcode(scannedBarcode); setShowScanner(false);
    try {
      const res = await fetch(`${API_URL}/products/by-barcode/${scannedBarcode}`);
      const data = await res.json();
      if (data?.success && data?.data) {
        const p = data.data;
        if (p.name_fr) {
          setTranslations({
            ru: { name: p.name_ru || '', description: p.desc_ru || '' },
            fr: { name: p.name_fr || '', description: p.desc_fr || '' },
            en: { name: p.name_en || '', description: p.desc_en || '' }
          } as any);
        }
        if (p.price) setPrice(p.price.toString());
        if (p.brand_id) setBrandId(p.brand_id);
        if (p.category_id) setCategoryId(p.category_id);
        if (p.image_url) { setImageUrl(p.image_url); setImagePreview(p.image_url); }
        setSuccess(`Товар с штрих-кодом ${scannedBarcode} найден!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setSuccess(`Штрих-код ${scannedBarcode} сохранён.`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setSuccess(`Штрих-код ${scannedBarcode} сохранён.`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const doTranslate = async (sourceLang: Lang) => {
    console.log('--- TRANSLATION START ---');
    let sourceText = translations[sourceLang].name;
    let sourceDesc = translations[sourceLang].description;

    console.log(`Source (${sourceLang}):`, { name: sourceText, desc: sourceDesc });

    if (!sourceText || sourceText.length < 3) {
      console.log('Name too short in state, checking input field...');
      const el = document.querySelector<HTMLInputElement>(`input[placeholder="${sourceLang === 'fr' ? 'Nom' : 'Название'}"]`);
      if (el) {
        sourceText = el.value;
        console.log('Found name in input:', sourceText);
      }
    }

    if (!sourceText || sourceText.trim().length < 3) {
      console.warn('Translation aborted: Name too short (min 3 chars)');
      return;
    }

    const targetLangs = (['ru', 'fr', 'en'] as const).filter(l => l !== sourceLang);
    const requestBody = {
      text: String(sourceText),
      description: sourceDesc || '',
      sourceLang,
      targetLangs: targetLangs as string[],
      tags: 'product_name'
    };

    console.log('Request Body:', requestBody);

    try {
      console.log('Fetching from API...');
      const resp = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('API Response Status:', resp.status);

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('API Error Response:', errText);
        return;
      }

      const data = await resp.json();
      console.log('API Success Data:', data);

      if (data.success && data.data) {
        const next = { ...translations };
        (['ru', 'fr', 'en'] as const).forEach(tLang => {
          if (tLang === sourceLang) return;

          const translatedData = data.data[tLang];
          if (translatedData) {
            console.log(`Applying translation for ${tLang}:`, translatedData);
            if (translatedData.name !== undefined && translatedData.name !== null) {
              next[tLang].name = translatedData.name;
            }
            if (translatedData.description !== undefined && translatedData.description !== null) {
              next[tLang].description = translatedData.description;
            }
          }
        });

        setTranslations(next);
        setSuccess('Translation completed');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('API returned success:false or no data:', data);
      }
    } catch (e) {
      console.error('Translation Fetch Error:', e);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) { setError('Enter brand name'); return; }
    try {
      const resp = await fetch(`${API_URL}/brands`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newBrandName }) });
      const data = await resp.json();
      if (data?.success) { const b = data.data; setBrands(prev => [...prev, b]); setBrandId(b.id); setShowBrandModal(false); setNewBrandName(''); setSuccess('Brand added'); setTimeout(() => setSuccess(''), 3000); }
      else setError(data?.error ?? 'Failed to add brand');
    } catch { setError('Failed to add brand'); }
  };

  const handleSave = async () => {
    if (!sku.trim()) { setError('Enter product SKU'); return; }
    if (!translations.fr.name.trim()) { setError('Enter product name'); return; }
    if (!price) { setError('Enter price'); return; }
    try {
      const payload = {
        sku: sku.trim(), barcode: barcode?.trim() ?? null, price: parseFloat(price) || 0, image_url: imageUrl || null, brand_id: brandId ?? null, category_id: categoryId ?? null,
        name_ru: translations.ru.name || null, desc_ru: translations.ru.description || null,
        name_fr: translations.fr.name || null, desc_fr: translations.fr.description || null,
        name_en: translations.en.name || null, desc_en: translations.en.description || null
      };
      const res = await fetch(`${API_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data?.success) { setSuccess('Product added successfully!'); setTimeout(() => navigate('/admin/products'), 1500); }
      else setError(data?.error ?? 'Failed to save product');
    } catch (e) { setError('Failed to save product'); }
  };

  const topLevelCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="min-h-screen p-8">
      <BarcodeScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onScan={handleBarcodeScan} />

      {error && <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2"><Check className="w-4 h-4" />{success}</div>}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className={`relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border-2 border-dashed ${isDragging ? 'border-[#FF6B00] bg-[#FF6B00]/10' : 'border-zinc-700/50'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <div className="aspect-square flex items-center justify-center p-8">
              {isUploading ? (<div className="flex flex-col items-center gap-3"><RefreshCw className="w-10 h-10 text-[#FF6B00] animate-spin" /><span className="text-gray-400 text-sm">Загрузка...</span></div>)
                : imagePreview ? (<img src={imagePreview} alt="Product preview" className="max-w-full max-h-full object-contain" />)
                  : (<div className="flex flex-col items-center"><Package className="w-20 h-20 text-gray-300" /><span className="text-gray-400 text-sm mt-4">Перетащите фото сюда</span></div>)}
            </div>
            <label className={`absolute inset-0 cursor-pointer ${!imagePreview ? 'flex' : 'hidden'}`}>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>
            {imagePreview && (<button onClick={() => { setImagePreview(''); setImageUrl(''); }} className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white"><X className="w-4 h-4" /></button>)}
          </div>
        </div>

        <div>
          <div className="mb-4"><span className="text-[#FF6B00] text-sm font-bold uppercase tracking-wide">НОВЫЙ ТОВАР</span></div>
          <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full font-black italic text-3xl uppercase tracking-tight bg-transparent border-none focus:outline-none text-white mb-4" placeholder="АРТИКУЛ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Цена (€)</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full font-bold text-2xl bg-transparent border-b border-dashed focus:outline-none focus:border-[#FF6B00] text-white" placeholder="0.00€" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Штрих-код</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1 font-mono text-sm bg-transparent border-b border-dashed focus:outline-none focus:border-[#FF6B00] text-white"
                  placeholder="Штрих-код"
                />
                <button type="button" onClick={() => setShowScanner(true)} className="px-3 py-1.5 bg-[#FF6B00]/20 border border-[#FF6B00]/50 rounded-lg text-[#FF6B00] text-xs font-bold uppercase tracking-wider hover:bg-[#FF6B00]/30 transition-colors">Сканировать</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select value={brandId ?? ''} onChange={(e) => setBrandId(e.target.value ? parseInt(e.target.value) : null)} className="px-4 py-2 rounded-lg border border-zinc-700 bg-black/50 text-white">
              <option value="">Бренд</option>
              {brands.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
            </select>
            <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)} className="px-4 py-2 rounded-lg border border-zinc-700 bg-black/50 text-white">
              <option value="">Категория</option>
              {topLevelCategories.map(c => (<option key={c.id} value={c.id}>{c.name_fr || c.name_ru || c.name_en || 'Категория'}</option>))}
            </select>
          </div>
          <button onClick={handleSave} className="w-full bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase rounded-xl hover:bg-[#FF8533]">СОХРАНИТЬ</button>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-bold italic text-xl uppercase tracking-wide text-white mb-6">Переводы</h3>
        <div className="space-y-6">
          {(['ru', 'fr', 'en'] as const).map((lang) => (
            <div key={lang} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-white">{lang.toUpperCase()}</span>
                <button
                  onClick={() => { console.log('BUTTON CLICKED for', lang); doTranslate(lang); }}
                  className="ml-auto p-2 bg-[#FF6B00]/20 rounded-lg hover:bg-[#FF6B00]/30 transition-colors"
                  title="AI Translate"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                </button>
              </div>
              <input
                type="text"
                value={translations[lang].name}
                onChange={(e) => setTranslations(prev => ({ ...prev, [lang]: { ...prev[lang], name: e.target.value } }))}
                placeholder={lang === 'fr' ? 'Nom' : lang === 'ru' ? 'Название' : 'Name'}
                className="w-full px-4 py-2 bg-transparent border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] mb-3"
              />
              <textarea
                value={translations[lang].description}
                onChange={(e) => setTranslations(prev => ({ ...prev, [lang]: { ...prev[lang], description: e.target.value } }))}
                placeholder="Description"
                rows={3}
                className="w-full px-4 py-2 bg-transparent border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold italic text-xl uppercase text-white">Добавить бренд</h3>
              <button onClick={() => setShowBrandModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <input type="text" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} className="w-full px-4 py-2.5 border border-zinc-700 rounded-lg text-white bg-black/50" placeholder="Название бренда" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowBrandModal(false)} className="flex-1 py-2.5 border border-zinc-700 rounded-lg text-sm font-bold uppercase text-white">Отмена</button>
              <button onClick={handleAddBrand} disabled={!newBrandName.trim()} className="flex-1 py-2.5 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
