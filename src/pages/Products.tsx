import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown, Image as ImageIcon, Maximize2, ShieldCheck, Package, Shield, Settings, Zap, Layers, Tag, FileText, Heart, Star, ShoppingCart, X, Fuel, Cpu, Wrench, Gauge, Database, Truck, CreditCard, Search, Mic, MicOff } from 'lucide-react';
import './Products.css';
import productsData from '../products.json';
import gensetsData from '../gensets.json';

export interface CategoryItem {
  id: string;
  name: string;
}

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  { id: 'brush-cutter', name: 'Brush Cutter' },
  { id: 'chaff-cutter-wood-chipper', name: 'Chaff Cutter & Wood Chipper' },
  { id: 'earth-augur', name: 'Earth Augur' },
  { id: 'engines', name: 'Engines' },
  { id: 'gensets', name: 'Gensets' },
  { id: 'hedge-trimmer', name: 'Hedge Trimmer' },
  { id: 'honda-products', name: 'Honda Products' },
  { id: 'sprayer', name: 'Sprayer' },
  { id: 'water-pump', name: 'Water Pump' },
  { id: 'weeder', name: 'Weeder' },
];

const GoogleGIcon = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const GoogleMicIcon = ({ isListening }: { isListening?: boolean }) => (
  <svg viewBox="0 0 24 24" width="19" height="19" style={{ flexShrink: 0 }}>
    <path fill={isListening ? '#ef4444' : '#4285F4'} d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path fill={isListening ? '#ef4444' : '#34A853'} d="M11 18.08h2V21h-2z"/>
    <path fill={isListening ? '#ef4444' : '#EA4335'} d="M7.05 16.97c-1.28-1.28-2.05-3.04-2.05-4.97h2c0 1.38.56 2.63 1.46 3.54l-1.41 1.43z"/>
    <path fill={isListening ? '#ef4444' : '#FBBC05'} d="M12 17c1.38 0 2.63-.56 3.54-1.46l1.41 1.43c-1.28 1.28-3.04 2.05-4.95 2.05V17z"/>
    <path fill={isListening ? '#ef4444' : '#4285F4'} d="M16.95 16.97c1.28-1.28 2.05-3.04 2.05-4.97h-2c0 1.38-.56 2.63-1.46 3.54l1.41 1.43z"/>
  </svg>
);

export const getProductCategorySlug = (product: any): string => {
  if (!product) return 'products';
  const catName = (product.category || '').toLowerCase().trim();
  if (catName && !catName.includes('parani') && catName !== 'all') {
    if (catName.includes('honda')) return 'honda-products';
    if (catName.includes('brush')) return 'brush-cutter';
    if (catName.includes('chaff') || catName.includes('chipper')) return 'chaff-cutter-wood-chipper';
    if (catName.includes('auger') || catName.includes('augur')) return 'earth-augur';
    if (catName.includes('genset') || catName.includes('generator')) return 'gensets';
    if (catName.includes('weeder') || catName.includes('tiller')) return 'weeder';
    if (catName.includes('sprayer') || catName.includes('htp')) return 'sprayer';
    if (catName.includes('pump')) return 'water-pump';
    if (catName.includes('engine')) return 'engines';
    return catName.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const n = (product.name || '').toUpperCase();
  const f = (product.folder || '').toUpperCase();

  if (f.includes('HONDA') || n.includes('HONDA')) return 'honda-products';
  if (f.includes('GENSET') || n.includes('GENERATOR') || n.includes('GENSET')) return 'gensets';
  if (f.includes('BRUSH CUTTER') || n.includes('BRUSH CUTTER')) return 'brush-cutter';
  if (f.includes('CHAFF') || f.includes('CHIPPER') || n.includes('CHAFF') || n.includes('CHIPPER')) return 'chaff-cutter-wood-chipper';
  if (f.includes('AUGER') || f.includes('AUGUR') || n.includes('AUGER') || n.includes('AUGUR')) return 'earth-augur';
  if (f.includes('WEEDER') || f.includes('TILLER') || n.includes('WEEDER') || n.includes('TILLER')) return 'weeder';
  if (f.includes('SPRAYER') || n.includes('SPRAYER') || n.includes('HTP')) return 'sprayer';
  if (f.includes('WATER PUMP') || n.includes('WATER PUMP') || (n.includes('PUMP') && !n.includes('HTP'))) return 'water-pump';
  if (f.includes('ENGINE') || n.includes('ENGINE')) return 'engines';

  return 'products';
};

export const isProductInCategory = (product: any, catId: string): boolean => {
  if (!product) return false;
  if (catId === 'all') return true;

  const name = (product.name || '').toUpperCase();
  const folder = (product.folder || '').toUpperCase();
  const cat = (product.category || '').toUpperCase();
  const catClean = (product.category || '').toLowerCase().trim();
  const targetClean = (catId || '').toLowerCase().trim();
  const catSlug = catClean.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Exact matching for dynamic / custom / standard categories assigned directly to product
  if (catClean && (catClean === targetClean || catSlug === targetClean)) {
    return true;
  }

  switch (catId) {
    case 'brush-cutter':
      if (catClean && catSlug !== 'brush-cutter' && catClean !== 'brush cutter') return false;
      return name.includes('BRUSH CUTTER') || folder.includes('BRUSH CUTTER') || cat.includes('BRUSH CUTTER');
    case 'chaff-cutter-wood-chipper':
    case 'chaff-wood-chipper':
      if (catClean && catSlug !== 'chaff-wood-chipper' && catSlug !== 'chaff-cutter-wood-chipper') return false;
      return name.includes('CHAFF') || name.includes('CHAF') || name.includes('CHIPPER') || folder.includes('CHAFF') || folder.includes('CHIPPER');
    case 'earth-augur':
      if (catClean && catSlug !== 'earth-augur') return false;
      return name.includes('AUGER') || name.includes('AUGUR') || folder.includes('AUGER') || folder.includes('AUGUR');
    case 'earth-rammer':
      if (catClean && catSlug !== 'earth-rammer') return false;
      return name.includes('RAMMER') || folder.includes('RAMMER') || cat.includes('RAMMER');
    case 'engines':
      if (catClean && catSlug !== 'engines') return false;
      return (folder.includes('ENGINE') || name.includes('ENGINE')) && !folder.includes('SPRAYER') && !name.includes('SPRAYER');
    case 'gensets':
    case 'genset':
    case 'generator':
    case 'generators':
    case 'power-generator':
    case 'power-generators':
      if (catClean && catSlug !== 'gensets' && catSlug !== 'genset') return false;
      return folder.includes('GENSET') || name.includes('GENERATOR') || name.includes('GENSET') || cat.includes('GENSET');
    case 'hedge-trimmer':
      if (catClean && catSlug !== 'hedge-trimmer') return false;
      return name.includes('HEDGE') || name.includes('HARVESTER') || name.includes('STUBBLE') || name.includes('CHAINSAW') || cat.includes('HEDGE');
    case 'honda-products':
      return folder.includes('HONDA') || name.includes('HONDA') || cat.includes('HONDA');
    case 'sprayer':
      if (catClean && catSlug !== 'sprayer') return false;
      return folder.includes('SPRAYER') || name.includes('SPRAYER') || name.includes('HTP');
    case 'water-pump':
      if (catClean && catSlug !== 'water-pump') return false;
      return folder.includes('WATER PUMP');
    case 'weeder':
      if (catClean && catSlug !== 'weeder') return false;
      return folder.includes('WEEDER');
    default:
      return catSlug === targetClean || catClean === targetClean;
  }
};

export const normalizeProductFolder = (folderOrUrl?: string): string => {
  if (!folderOrUrl) return '';
  return folderOrUrl
    .replace(/MITSUYAMA\s+2S\s+52CC(?:\s+BRUSH\s+CUTTER)?/gi, 'MITSUYAMA  2S  52CC')
    .replace(/MITSUYAMA\s+4S\s+35CC(?:\s+BRUSH\s+CUTTER)?/gi, 'MITSUYAMA  4S  35CC')
    .replace(/REALLY\s+2S\s+52CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY  2S  52CC')
    .replace(/REALLY\s+4S\s+35\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY  4S  35 CC')
    .replace(/REALLY\s+2S\s+43\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY 2S 43 CC')
    .replace(/REALLY\s+4S\s+50CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY 4S 50CC')
    .replace(/REALLY\s+BACK\s*PACK\s+4S\s+35\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY BACK PACK 4S 35 CC')
    .replace(/REALLY\s+BACKPACK\s+2S\s+52\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY BACKPACK 2S 52 CC')
    .replace(/REALLY\s+TROLLEY\s+2S\s+52CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY TROLLEY 2S 52CC');
};

export const getProductImage = (folder?: string, imgOrThumb?: string, fallbackUrl?: string): string => {
  if (fallbackUrl && fallbackUrl.startsWith('http')) return fallbackUrl;
  if (imgOrThumb && typeof imgOrThumb === 'string' && imgOrThumb.startsWith('http')) return imgOrThumb;
  
  if (fallbackUrl) {
    return normalizeProductFolder(fallbackUrl);
  }
  
  const cleanFolder = normalizeProductFolder(folder || '');
  const cleanImg = imgOrThumb ? (imgOrThumb.startsWith('/') ? imgOrThumb.slice(1) : imgOrThumb) : '';
  return ('/' + cleanFolder + '/' + cleanImg).replace(/\/+/g, '/');
};

// Global cache for immediate, flash-free rendering
try { sessionStorage.removeItem('pm_cached_products'); sessionStorage.removeItem('pm_cached_categories'); } catch(e){}
let globalProductsCache: any[] = [];
let globalCategoriesCache: any[] = [];
try {
  const p = sessionStorage.getItem('pm_cached_products_v4');
  if (p) globalProductsCache = JSON.parse(p);
  const c = sessionStorage.getItem('pm_cached_categories_v4');
  if (c) globalCategoriesCache = JSON.parse(c);
} catch (e) {}

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('brush-cutter');
  const [backendProducts, setBackendProducts] = useState<any[]>(globalProductsCache);
  const [backendCategories, setBackendCategories] = useState<any[]>(globalCategoriesCache);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(globalProductsCache.length === 0);

  useEffect(() => {
    const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5001';
    const fetchBackendData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(API_BASE + '/api/products').then(r => r.json()).catch(() => null),
          fetch(API_BASE + '/api/categories').then(r => r.json()).catch(() => null),
        ]);
        if (prodRes && prodRes.success && Array.isArray(prodRes.data)) {
          setBackendProducts(prodRes.data);
          globalProductsCache = prodRes.data;
          try { sessionStorage.setItem('pm_cached_products_v4', JSON.stringify(prodRes.data)); } catch (e) {}
        }
        if (catRes && catRes.success && Array.isArray(catRes.data)) {
          setBackendCategories(catRes.data);
          globalCategoriesCache = catRes.data;
          try { sessionStorage.setItem('pm_cached_categories_v4', JSON.stringify(catRes.data)); } catch (e) {}
        }
      } catch (error) {
        console.error("Error fetching data from backend API:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchBackendData();
  }, []);

  const allProductsList = useMemo(() => {
    const gensetsNormalized = (gensetsData || []).map((p: any) => ({
      ...p,
      category: p.category || 'Gensets',
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '')
    }));

    if (backendProducts && backendProducts.length > 0) {
      const hasGensets = backendProducts.some((p: any) => isProductInCategory(p, 'gensets'));
      
      if (!hasGensets && gensetsNormalized.length > 0) {
        const combined = [...backendProducts, ...gensetsNormalized];
        const uniqueMap = new Map();
        combined.forEach((p: any) => {
          if (p.name && !uniqueMap.has(p.name.toLowerCase())) {
            uniqueMap.set(p.name.toLowerCase(), p);
          }
        });
        return Array.from(uniqueMap.values());
      }
      return backendProducts;
    }

    const combined = [...productsData, ...gensetsNormalized];
    const uniqueMap = new Map();
    combined.forEach((p: any) => {
      if (p.name && !uniqueMap.has(p.name.toLowerCase())) {
        uniqueMap.set(p.name.toLowerCase(), p);
      }
    });
    return Array.from(uniqueMap.values()).map((p: any) => ({
      ...p,
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '')
    }));
  }, [backendProducts]);

  const dynamicCategories = useMemo(() => {
    const list: CategoryItem[] = [];
    const existingNames = new Set<string>();
    const existingIds = new Set<string>();

    // 1. Add categories from backend /api/categories
    if (backendCategories && backendCategories.length > 0) {
      backendCategories.forEach((cat) => {
        const catName = cat.name ? cat.name.trim() : '';
        if (catName && !existingNames.has(catName.toLowerCase()) && catName.toLowerCase() !== 'all products' && cat.slug !== 'all') {
          let id = cat.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          if (id === 'genset') id = 'gensets';
          if (!existingIds.has(id)) {
            list.push({ id, name: catName });
            existingNames.add(catName.toLowerCase());
            existingIds.add(id);
          }
        }
      });
    }

    // 2. Add standard categories (ensures Gensets and other staples are always present)
    PRODUCT_CATEGORIES.forEach((stdCat) => {
      if (!existingIds.has(stdCat.id) && !existingNames.has(stdCat.name.toLowerCase())) {
        list.push(stdCat);
        existingIds.add(stdCat.id);
        existingNames.add(stdCat.name.toLowerCase());
      }
    });

    return list;
  }, [backendCategories]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const isGensetQuery = q.includes('generator') || q.includes('genset') || q.includes('power gen');
    const matched = allProductsList.filter((p: any) => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const folder = (p.folder || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const gensetMatch = isGensetQuery && (isProductInCategory(p, 'gensets') || cat.includes('genset'));
      return name.includes(q) || cat.includes(q) || folder.includes(q) || desc.includes(q) || gensetMatch;
    });
    matched.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
    return matched;
  }, [searchQuery, allProductsList]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported on this browser. Please try Google Chrome on mobile or desktop.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          const clean = currentTranscript.replace(/[.,!?]/g, '').trim();
          setSearchQuery(clean);
          setIsDropdownOpen(true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone permission blocked. Please allow microphone access in your browser settings to use voice search.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically scroll to results so user sees them immediately!
        setTimeout(() => {
          resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      };

      recognition.start();
    } catch (err) {
      console.error('Voice search start error:', err);
      setIsListening(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsDropdownOpen(false);
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || params.get('q');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    const category = params.get('category');
    if (category) {
      const catLower = category.toLowerCase().trim();
      const catSlug = catLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (catLower === 'agri' || catLower === 'all') {
        setActiveCategory('brush-cutter');
      } else if (
        catLower.includes('genset') || 
        catLower.includes('generator') || 
        catSlug.includes('genset') || 
        catSlug.includes('generator')
      ) {
        setActiveCategory('gensets');
      } else {
        const found = dynamicCategories.find(c => c.id === catSlug || c.id === catLower) 
          || PRODUCT_CATEGORIES.find(c => c.id === catSlug || c.id === catLower);
        if (found) {
          setActiveCategory(found.id);
        } else {
          setActiveCategory(catSlug);
        }
      }
      setTimeout(() => {
        const section = document.querySelector('.categories-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search, dynamicCategories]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [rotationIndex, setRotationIndex] = useState(0);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const imageDisplayAreaRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Filter images to create a 4-point rotation sequence if available
  const rotationSequence = React.useMemo(() => {
    if (!selectedProduct) return null;
    if (!selectedProduct.images) return null; // Backend products might not have 'images' initially for 360 view
    const front = selectedProduct.images.findIndex((img: string) => img.includes('front'));
    const right = selectedProduct.images.findIndex((img: string) => img.includes('right'));
    const back = selectedProduct.images.findIndex((img: string) => img.includes('back'));
    const left = selectedProduct.images.findIndex((img: string) => img.includes('left'));
    
    const seq = [front, right, back, left].filter(idx => idx !== -1);
    return seq.length >= 2 ? seq : null;
  }, [selectedProduct]);

  const renderProductTitle = (name: string) => {
    if (!name) return null;
    if (name.includes(' - ')) {
      const parts = name.split(' - ');
      return (
        <>
          <span style={{ color: '#0B6A38', fontWeight: 800 }}>{parts[0].trim()}</span>
          <span style={{ color: '#333' }}>{' - '}{parts.slice(1).join(' - ').trim()}</span>
        </>
      );
    } else if (name.includes(',')) {
      const parts = name.split(',');
      return (
        <>
          <span style={{ color: '#0B6A38', fontWeight: 800 }}>{parts[0].trim()}</span>
          <span style={{ color: '#333' }}>{', '}{parts.slice(1).join(',').trim()}</span>
        </>
      );
    } else {
      return <span style={{ color: '#0B6A38', fontWeight: 800 }}>{name}</span>;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleModalPopState = () => {
      setSelectedProduct(null);
      document.body.style.overflow = 'auto';
    };
    window.addEventListener('popstate', handleModalPopState);
    return () => window.removeEventListener('popstate', handleModalPopState);
  }, []);

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setIs360View(false);
    document.body.style.overflow = 'hidden';

    const slug = product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : (product._id || product.id));
    const catSlug = getProductCategorySlug(product);

    if (slug) {
      const targetUrl = '/product/' + catSlug + '/' + slug;
      window.history.pushState({ modalOpen: true }, '', targetUrl);
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
    window.history.pushState(null, '', '/products');
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct) {
      setActiveImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct) {
      setActiveImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360View) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360View || startX === null || !selectedProduct) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;
    
    // Higher sensitivity threshold for 360 drag
    if (Math.abs(diff) > 25) {
      if (rotationSequence) {
        if (diff > 0) {
          setRotationIndex((prev) => (prev === 0 ? rotationSequence.length - 1 : prev - 1));
        } else {
          setRotationIndex((prev) => (prev === rotationSequence.length - 1 ? 0 : prev + 1));
        }
      } else {
        if (diff > 0) {
          setActiveImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
        } else {
          setActiveImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
        }
      }
      setStartX(clientX);
    }
  };

  const currentDisplayIndex = (is360View && rotationSequence) ? rotationSequence[rotationIndex] : activeImageIndex;

  const handleDragEnd = () => {
    setStartX(null);
  };

  const handleImageZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is360View || !selectedProduct) return;

    // When hovering over next/prev navigation buttons, smoothly ease back to scale(1)
    if ((e.target as HTMLElement)?.closest('.nav-circ')) {
      if (mainImageRef.current) {
        mainImageRef.current.style.transform = 'scale(1) translateZ(0)';
      }
      return;
    }

    if (!imageDisplayAreaRef.current || !mainImageRef.current) return;
    const rect = imageDisplayAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (mainImageRef.current) {
        mainImageRef.current.style.transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        mainImageRef.current.style.transform = 'scale(1.7) translateZ(0)';
      }
    });
  };

  const handleImageZoomLeave = () => {
    if (is360View) return;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (mainImageRef.current) {
      // Keep current transformOrigin so image zooms out smoothly in place without snapping or flickering
      mainImageRef.current.style.transform = 'scale(1) translateZ(0)';
    }
  };

  // Reset zoom smoothly whenever active image, product, or 360 view changes
  useEffect(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (mainImageRef.current) {
      mainImageRef.current.style.transform = 'scale(1) translateZ(0)';
      mainImageRef.current.style.transformOrigin = 'center center';
    }
  }, [activeImageIndex, selectedProduct, is360View]);

  const getWhatsappLink = (productName: string, productImage?: string) => {
    const text = encodeURIComponent(
      `Hello Parani Mill Stores,\n\nI am interested in your product: *${productName}*.\n\nCould you please provide pricing details, availability, and EMI options?\n\nThank you!`
    );
    return `https://wa.me/917094341807?text=${text}`;
  };

  const currentCategoryObj = dynamicCategories.find((c: any) => c.id === activeCategory) || PRODUCT_CATEGORIES.find((c: any) => c.id === activeCategory);
  const currentCategoryName = currentCategoryObj ? currentCategoryObj.name : 'All Products';

  const getCategorySeoMeta = (catId: string, name: string) => {
    switch (catId) {
      case 'gensets':
      case 'genset':
        return {
          title: `Gensets & Power Generators in Tamil Nadu | Best Price & Spares | Parani Mill Stores`,
          desc: `Buy portable petrol gensets & heavy-duty power generators in Tamil Nadu from Parani Mill Stores, Madurai. 100% genuine spares, warranty & fast delivery across Tamil Nadu.`,
        };
      case 'brush-cutter':
        return {
          title: `Brush Cutters in Tamil Nadu | 2-Stroke & 4-Stroke | Parani Mill Stores`,
          desc: `Explore top-rated 2-stroke, 4-stroke & backpack brush cutters in Tamil Nadu. Complete spares, blades & attachments from Parani Mill Stores, Madurai.`,
        };
      case 'weeder':
        return {
          title: `Power Weeders & Tillers in Tamil Nadu | Best Price & Spares | Parani Mill Stores`,
          desc: `Heavy-duty agricultural power weeders, mini tillers & rotary weeders in Tamil Nadu. Reliable farm machinery with warranty & genuine spares from Parani Mill Stores.`,
        };
      case 'earth-augur':
        return {
          title: `Earth Augurs & Post Hole Diggers in Tamil Nadu | Parani Mill Stores`,
          desc: `High-performance petrol earth augurs with extension rods & drill bits in Tamil Nadu. Ideal for fencing, plantation & tree planting across Tamil Nadu.`,
        };
      case 'chaff-cutter-wood-chipper':
        return {
          title: `Chaff Cutters & Wood Chippers in Tamil Nadu | Parani Mill Stores`,
          desc: `Electric & petrol fodder chaff cutters, wood chippers & shredders for dairy farming in Tamil Nadu. Heavy-duty build with best prices at Parani Mill Stores.`,
        };
      case 'sprayer':
        return {
          title: `Agricultural Sprayers in Tamil Nadu | HTP & Battery Sprayers | Parani Mill Stores`,
          desc: `High-pressure HTP sprayers, battery knapsack sprayers & portable sprayers in Tamil Nadu. Authorized stockist with all spare parts at Parani Mill Stores, Madurai.`,
        };
      case 'water-pump':
        return {
          title: `Agricultural Water Pumps in Tamil Nadu | Petrol & Diesel | Parani Mill Stores`,
          desc: `2-inch & 3-inch high discharge agricultural water pumps in Tamil Nadu. Reliable irrigation solutions with genuine spares from Parani Mill Stores, Madurai.`,
        };
      case 'engines':
        return {
          title: `Petrol & Diesel Engines in Tamil Nadu | 168F, 170F, GX | Parani Mill Stores`,
          desc: `Multi-purpose petrol and diesel engines for agricultural machinery in Tamil Nadu. 100% genuine engines with all spare parts at Parani Mill Stores.`,
        };
      case 'honda-products':
        return {
          title: `Honda Power Products & Engines in Tamil Nadu | Parani Mill Stores`,
          desc: `Genuine Honda 4-stroke brush cutters, GX series engines & vibrators in Tamil Nadu. Authorized dealer with official warranty and service support.`,
        };
      case 'hedge-trimmer':
        return {
          title: `Hedge Trimmers & Pruners in Tamil Nadu | Parani Mill Stores`,
          desc: `Commercial hedge trimmers, tea leaf harvesters & garden pruning tools in Tamil Nadu. Sharp dual-action blades & durable engines at Parani Mill Stores.`,
        };
      default:
        return {
          title: `${name} in Tamil Nadu | Best Price & Spares | Parani Mill Stores`,
          desc: `Explore premium ${name} with genuine spares, warranty, and best prices across Tamil Nadu from Parani Mill Stores, established in 1960.`,
        };
    }
  };

  const seoMeta = getCategorySeoMeta(activeCategory, currentCategoryName);
  const categoryCanonicalUrl = `https://paranimill.com/products?category=${activeCategory}`;

  return (
    <div className="products-page">
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.desc} />
        <link rel="canonical" href={categoryCanonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoMeta.title} />
        <meta property="og:description" content={seoMeta.desc} />
        <meta property="og:url" content={categoryCanonicalUrl} />
        <meta property="og:image" content="https://paranimill.com/ph2.webp" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": seoMeta.title,
            "description": seoMeta.desc,
            "url": categoryCanonicalUrl,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Parani Mill Stores",
              "url": "https://paranimill.com"
            },
            "about": {
              "@type": "Thing",
              "name": currentCategoryName
            }
          })}
        </script>
      </Helmet>
      <section className="products-hero-image">
        <img src="/ph2.webp" alt="Parani Mill Stores Products Hero" />
      </section>

      {/* Auto-scrolling USP Marquee */}
      <div className="product-usp-marquee">
        <div className="marquee-track">
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
          
          {/* Set 2 */}
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
          
          {/* Set 3 */}
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
          
          {/* Set 4 to ensure smooth scroll on ultrawide */}
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
        </div>
      </div>
      
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '15px' }}>Explore Our Signature Products</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.05rem', marginBottom: '25px', maxWidth: '700px', margin: '0 auto 25px auto' }}>
            Select a category below to browse our high-performance machinery, genuine spares, and trusted industrial tools.
          </p>
          
          {/* Official Google Style Voice & Instant Search Bar with Glowing Border */}
          <div className="google-search-container" ref={searchContainerRef}>
            <div className={`google-search-glow-wrapper ${isListening ? 'listening-glow' : ''}`}>
              <div className="google-search-bar">
                <div className="google-icon-wrapper" title="Google Search">
                  <GoogleGIcon />
                </div>
                <div className="google-search-divider"></div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) setIsDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setIsDropdownOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={isListening ? 'Listening...' : 'Search...'}
                  className="google-search-input"
                />
                
                <div className="google-search-actions">
                  {searchQuery && (
                    <button 
                      type="button"
                      className="google-clear-btn" 
                      onClick={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}

                  <button 
                    type="button"
                    className={`google-mic-btn ${isListening ? 'active' : ''}`}
                    onClick={handleVoiceSearch}
                    title={isListening ? 'Stop listening' : 'Search by voice'}
                    aria-label="Search by voice"
                  >
                    <GoogleMicIcon isListening={isListening} />
                  </button>
                </div>
              </div>
            </div>

            {/* Google Style Instant Search Dropdown (Direct Product Jump) */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="google-search-dropdown">
                {searchResults.length > 0 ? (
                  <>
                    <div className="google-search-dropdown-header">
                      Matching Products ({searchResults.length})
                    </div>
                    <div className="google-search-dropdown-list">
                      {searchResults.slice(0, 6).map((prod: any, idx: number) => {
                        const imgSrc = getProductImage(prod.folder, prod.thumbnail || (prod.images && prod.images[0]), prod.thumbnailUrl);
                        return (
                          <div 
                            key={prod.id || prod._id || idx}
                            className="google-search-dropdown-item"
                            onClick={() => {
                              openProductModal(prod);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <img src={imgSrc} alt={prod.name} className="dropdown-item-img" />
                            <div className="dropdown-item-info">
                              <div className="dropdown-item-name">{prod.name}</div>
                              <div className="dropdown-item-cat">{prod.category || 'Agricultural Machinery'}</div>
                            </div>
                            <ArrowRight size={14} className="dropdown-item-arrow" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="google-search-dropdown-footer">
                      <button 
                        type="button" 
                        className="dropdown-view-all-btn"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        View all {searchResults.length} results in catalog <ArrowRight size={13} style={{ marginLeft: '4px' }} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="dropdown-empty">
                    No products found for "<strong>{searchQuery}</strong>"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="products-subnav-container">
            <div className="products-subnav">
              {dynamicCategories.map((cat: any) => {
                const count = cat.id === 'all' 
                  ? allProductsList.length 
                  : allProductsList.filter((p: any) => isProductInCategory(p, cat.id)).length;

                return (
                  <button 
                    key={cat.id}
                    className={`subnav-btn ${!searchQuery && activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                      setActiveCategory(cat.id);
                      navigate('/products?category=' + cat.id, { replace: true });
                    }}
                  >
                    <span className="subnav-btn-name">{cat.name}</span>
                    <span className="subnav-btn-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Category / Search Info Banner */}
          <div className="category-info-bar" ref={resultsSectionRef}>
            {searchQuery.trim() ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="category-active-label">
                  Search Results for: <strong>"{searchQuery}"</strong>
                </span>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="search-reset-link"
                >
                  Back to Categories
                </button>
              </div>
            ) : (
              <span className="category-active-label">
                Category: <strong>{dynamicCategories.find((c: any) => c.id === activeCategory)?.name || PRODUCT_CATEGORIES.find((c: any) => c.id === activeCategory)?.name || activeCategory}</strong>
              </span>
            )}
          </div>

          {(() => {
            if (isInitialLoading) {
              return (
                <div className="categories-grid" style={{ minHeight: '300px' }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i} 
                      className="category-card" 
                      style={{ 
                        opacity: 0.5, 
                        minHeight: '320px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px'
                      }}
                    />
                  ))}
                </div>
              );
            }

            let filtered = allProductsList;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase().trim();
              const isGensetQuery = q.includes('generator') || q.includes('genset') || q.includes('power gen');
              filtered = filtered.filter((p: any) => {
                const name = (p.name || '').toLowerCase();
                const cat = (p.category || '').toLowerCase();
                const folder = (p.folder || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                const gensetMatch = isGensetQuery && (isProductInCategory(p, 'gensets') || cat.includes('genset'));
                return name.includes(q) || cat.includes(q) || folder.includes(q) || desc.includes(q) || gensetMatch;
              });
            } else {
              filtered = filtered.filter((p: any) => isProductInCategory(p, activeCategory));
            }
            filtered.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

            if (filtered.length === 0) {
              if (searchQuery.trim()) {
                return (
                  <div className="no-products-box">
                    <Search size={48} color="#0a5c36" style={{ marginBottom: '16px' }} />
                    <h3>No Products Found</h3>
                    <p>No products matched your search for <strong>"{searchQuery}"</strong>.</p>
                    <p style={{ marginTop: '6px', color: '#64748b' }}>Try searching with keywords like <em>Genset</em>, <em>Generator</em>, <em>Honda</em>, <em>Brush Cutter</em>, or <em>Sprayer</em>.</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="catchy-explore-btn"
                      style={{ marginTop: '20px', display: 'inline-flex', padding: '10px 24px', cursor: 'pointer', border: 'none' }}
                    >
                      Clear Search & View All Categories
                    </button>
                  </div>
                );
              }

              return (
                <div className="no-products-box">
                  <Package size={48} color="#0a5c36" style={{ marginBottom: '16px' }} />
                  <h3>New Models Coming Soon!</h3>
                  <p>We are currently updating our catalogue for <strong>{dynamicCategories.find((c: any) => c.id === activeCategory)?.name}</strong>.</p>
                  <p style={{ marginTop: '6px', color: '#64748b' }}>For instant pricing, brochures, and in-stock details, contact our showroom directly.</p>
                  <a 
                    href="https://wa.me/917094341807?text=Hi%20Parani%20Mill%20Stores,%20I%20am%20looking%20for%20information%20on%20this%20category" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="catchy-explore-btn"
                    style={{ marginTop: '20px', display: 'inline-flex', padding: '10px 24px' }}
                  >
                    Enquire on WhatsApp <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                  </a>
                </div>
              );
            }

            return (
              <div className="categories-grid">
                {filtered.map((prod: any, index: number) => {
                  const cardImageSrc = getProductImage(prod.folder, prod.thumbnail || (prod.images && prod.images[0]), prod.thumbnailUrl);
                  
                  return (
                    <div className="premium-product-card" key={index} onClick={() => openProductModal(prod)}>
                      <div className="card-image-wrapper">
                        <img src={cardImageSrc} alt={prod.name} loading="lazy" onError={(e) => { const target = e.currentTarget; if (!target.dataset.triedFallback) { target.dataset.triedFallback = 'true'; if (target.src.includes('thumbnail.png')) { target.src = target.src.replace('thumbnail.png', 'OG.webp'); } else if (target.src.includes('OG.webp')) { target.src = target.src.replace('OG.webp', 'thumbnail.png'); } } }} />
                        {Boolean(prod.stroke && typeof prod.stroke === 'string' && prod.stroke.trim() && !['none', 'n/a', 'null', 'undefined'].includes(prod.stroke.trim().toLowerCase())) && (
                          <span className="stroke-badge">{prod.stroke.trim()}</span>
                        )}
                      </div>
                      <div className="card-content-wrapper">
                        <h3 className="card-title" title={prod.name}>
                          {renderProductTitle(prod.name)}
                        </h3>
                        <div className="card-footer">
                          <button className="catchy-explore-btn">
                            Explore <ArrowRight size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Product Modal - Uploaded UI Style */}
      {selectedProduct && (
        <div className="product-modal-overlay">
          <div className="product-modal-fullpage">
            
            <div className="modal-header-uploaded">
              <button className="back-link desktop-only-btn" onClick={closeProductModal}>
                <span className="back-icon-circle">
                  <ChevronLeft size={18} strokeWidth={3} />
                </span>
                Back to Products
              </button>
              <div className="breadcrumb">
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span> 
            <ChevronRight size={14} /> 
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/products')}>Products</span> 
            {selectedProduct.category && (
              <>
                <ChevronRight size={14} /> 
                <span 
                  style={{ cursor: 'pointer', color: '#0B6A38', fontWeight: 600 }} 
                  onClick={() => navigate('/products?category=' + encodeURIComponent(selectedProduct.category))}
                  title={'View all ' + selectedProduct.category}
                >
                  {selectedProduct.category}
                </span>
              </>
            )}
            <ChevronRight size={14} /> 
            <span className="current">{selectedProduct.name}</span>
          </div>
              <button className="close-modal-btn mobile-only-btn" onClick={closeProductModal} aria-label="Close">
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="modal-content-container">
              
              {/* Left Column: Gallery */}
              <div className="modal-left-column">
                <div className="gallery-layout">
                  
                  {!is360View && (
                    <div className="thumbnails-sidebar">
                      <div className="thumbnails-scroll-area">
                        {(selectedProduct.images || []).map((img: string, idx: number) => (
                          <div 
                            key={idx} 
                            className={`thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            <img src={getProductImage(selectedProduct.folder, img)} alt={`view ${idx}`} />
                          </div>
                        ))}
                      </div>
                      {(selectedProduct.images || []).length > 4 && (
                        <button className="thumb-scroll-down"><ChevronDown size={20}/></button>
                      )}
                    </div>
                  )}

                  <div className="main-image-section">
                    


                    <div 
                      ref={imageDisplayAreaRef}
                      className={`image-display-area ${is360View ? 'is-360' : ''}`}
                      onMouseDown={handleDragStart}
                      onMouseMove={(e) => {
                        if (is360View) {
                          handleDragMove(e);
                        } else {
                          handleImageZoomMove(e);
                        }
                      }}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={() => {
                        handleDragEnd();
                        handleImageZoomLeave();
                      }}
                      onTouchStart={handleDragStart}
                      onTouchMove={handleDragMove}
                      onTouchEnd={handleDragEnd}
                    >
                      {!is360View && (
                        <button className="nav-circ prev" onClick={handlePrevImage} aria-label="Previous image"><ChevronLeft size={24} /></button>
                      )}
                      
                      <img 
                        ref={mainImageRef}
                        src={getProductImage(selectedProduct.folder, selectedProduct.images?.[currentDisplayIndex])} 
                        alt={selectedProduct.name} 
                        className="main-display-image"
                        draggable="false"
                      />
                      
                      {!is360View && (
                        <button className="nav-circ next" onClick={handleNextImage} aria-label="Next image"><ChevronRight size={24} /></button>
                      )}
                      
                      {is360View && (
                        <div className="drag-hint">
                          <ChevronLeft size={20} /> Drag to rotate <ChevronRight size={20} />
                        </div>
                      )}
                    </div>



                    {!is360View && (
                      <div className="image-dots">
                        {(selectedProduct.images || []).map((_: any, idx: number) => (
                          <div key={idx} className={`dot ${activeImageIndex === idx ? 'active' : ''}`} onClick={() => setActiveImageIndex(idx)} />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="modal-right-column">
                
                <div className="modal-badges-container">
              {selectedProduct.category && (
                <div className="modal-category-badge">
                  {selectedProduct.category}
                </div>
              )}
              {Boolean(selectedProduct.stroke && typeof selectedProduct.stroke === 'string' && selectedProduct.stroke.trim() && !['none', 'n/a', 'null', 'undefined'].includes(selectedProduct.stroke.trim().toLowerCase())) && (
                <div className="modal-stroke-badge" style={{ margin: 0 }}>
                  {selectedProduct.stroke.trim()}
                </div>
              )}
            </div>
                <h2 className="product-title">
                  {renderProductTitle(selectedProduct.name)}
                </h2>
                
                <div className="product-rating-emi-row">

                  <div className="emi-info-catchy">
                    <div className="emi-icon-wrapper"><Tag size={20} color="white" /></div>
                    <div className="emi-text-wrapper">
                      <strong>EMI Options Available</strong>
                      <span>Contact us for EMI details</span>
                    </div>
                  </div>
                </div>

                <div className="product-specs-container" style={{display: 'block'}}>
                  <h3 className="specs-title">
                    <Settings size={20} />
                    Specifications
                  </h3>
                  {(() => {
                    let specsToRender: Record<string, string> | null = null;
                    if (selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0) {
                      specsToRender = selectedProduct.specs;
                    } else if (selectedProduct.description) {
                      specsToRender = {};
                      const lines = selectedProduct.description.split('\n');
                      lines.forEach((line: string) => {
                        if (!line.trim() || !specsToRender) return;
                        if (line.includes('\t')) {
                          const parts = line.split('\t');
                          if (parts.length >= 2) {
                            specsToRender[parts[0].trim()] = parts.slice(1).join(' ').trim();
                          }
                        } else {
                          const parts = line.split(/\s{2,}/);
                          if (parts.length >= 2) {
                            specsToRender[parts[0].trim()] = parts.slice(1).join(' ').trim();
                          } else {
                            specsToRender[line.trim()] = "-";
                          }
                        }
                      });
                      if (Object.keys(specsToRender).length === 0) specsToRender = null;
                    }

                    return specsToRender ? (
                      <table className="product-specs-table">
                        <tbody>
                          {Object.entries(specsToRender).map(([key, value]) => (
                            <tr key={key}>
                              <td className="spec-key">{key}</td>
                              <td className="spec-value">{value as string}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{padding: '20px', color: '#cc3f45', fontWeight: 'bold'}}>
                        No specifications data found for this product.
                      </div>
                    );
                  })()}
                </div>

                <div className="flipkart-actions" style={{ justifyContent: 'center' }}>
                  <a href={getWhatsappLink(selectedProduct.name, selectedProduct.images[0])} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-catchy">
                    <div className="wa-icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28">
                        <path fill="#25D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z"/>
                        <path fill="#FFF" d="M223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </div>
                    <div className="wa-divider"></div>
                    <div className="wa-text-container">
                      <span className="wa-text-small">ENQUIRE VIA</span>
                      <span className="wa-text-large">WHATSAPP</span>
                    </div>
                    <div className="wa-arrow-container">
                      <ChevronRight size={24} color="white" />
                    </div>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
