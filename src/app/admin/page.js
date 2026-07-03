'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import * as XLSX from 'xlsx';

const ADMIN_PASSWORD = 'anello@admin2025';

function VideoSlotForm({ initialVideo, onSave }) {
  const [url, setUrl] = useState(initialVideo.url || '');
  const [link, setLink] = useState(initialVideo.link || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUrl(initialVideo.url || '');
    setLink(initialVideo.link || '');
  }, [initialVideo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      slot: initialVideo.slot,
      url,
      link,
      hashtag: initialVideo.hashtag || `#AnelloSlot${initialVideo.slot}`
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border2)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <strong style={{ fontSize: '1.1rem', color: 'var(--gold-dark)' }}>Slot {initialVideo.slot}</strong>
        <span style={{ fontSize: '0.8rem', background: 'var(--border)', padding: '2px 8px', borderRadius: '12px' }}>Video Reel</span>
      </div>
      
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>Video File Path / URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. /V1.mp4 or Cloudinary URL"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)'
          }}
          required
        />
      </div>

      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>Redirect Link URL (Click action)</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="e.g. /products/opal-blossom-ring or external URL"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)'
          }}
        />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>Left blank for no click action.</span>
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          alignSelf: 'flex-end',
          opacity: saving ? 0.7 : 1
        }}
      >
        {saving ? 'Saving...' : '💾 Save Slot'}
      </button>
    </form>
  );
}


const DEFAULT_PRODUCTS = [
  { id:1, name:'Eternal Diamond Solitaire', cat:'Diamond Ring', price:189999, stock:12, sold:0, emoji:'💍', badge:'-24%', isNewArrival:false, description:'A stunning eternal diamond solitaire ring crafted with perfection.', images:[] },
  { id:2, name:'Classic Yellow Gold Band', cat:'Gold Ring', price:28999, stock:34, sold:0, emoji:'💛', badge:null, isNewArrival:false, description:'Timeless classic yellow gold wedding band.', images:[] },
  { id:3, name:'Rose Gold Twisted Halo', cat:'Gold Ring', price:74999, stock:8, sold:0, emoji:'🌹', badge:'-21%', isNewArrival:false, description:'Elegant rose gold twisted halo fashion ring.', images:[] },
  { id:4, name:'Princess Cut Trilogy', cat:'Diamond Ring', price:299999, stock:5, sold:0, emoji:'💎', badge:'-21%', isNewArrival:false, description:'Luxurious princess cut trilogy diamond ring.', images:[] },
  { id:5, name:'Amethyst Floral Ring', cat:'Silver Ring', price:12499, stock:22, sold:0, emoji:'💜', badge:null, isNewArrival:true, description:'Beautiful amethyst floral ring with intricate details.', images:[] },
  { id:6, name:'Matte Black Titanium Band', cat:'Silver Ring', price:8999, stock:45, sold:0, emoji:'🖤', badge:'-31%', isNewArrival:false, description:'Modern matte black titanium band.', images:[] },
  { id:7, name:'Emerald & Diamond Cluster', cat:'Gold Ring', price:134999, stock:6, sold:0, emoji:'💚', badge:null, isNewArrival:true, description:'Exquisite emerald and diamond cluster ring.', images:[] },
  { id:8, name:'Infinity Love Couple Set', cat:'Silver Ring', price:18999, stock:19, sold:0, emoji:'❤️', badge:'-24%', isNewArrival:false, description:'Matching infinity love couple set.', images:[] },
];

const CATS = ['Silver Ring', 'Gold Ring', 'Diamond Ring'];
const EMOJIS = ['💍','💛','🌹','💎','💜','🖤','💚','❤️','✨','👑','🔮','🎀'];

const EMPTY_PROD = { name:'', cat:'Silver Ring', price:'', stock:'', sold:'0', emoji:'💍', badge:'', isNewArrival:false, isStylish:false, isBestSeller:false, isExclusive:false, description:'', images:[], video:'' };

function fmt(n) {
  try {
    const val = Number(n);
    if (n === undefined || n === null || isNaN(val)) {
      return '₹0';
    }
    return '₹' + val.toLocaleString('en-IN');
  } catch (err) {
    console.error('Error in fmt for value:', n, err);
    return '₹0';
  }
}
function fmtDate(d) { 
  if (!d) return 'N/A';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); 
  } catch (err) {
    return 'N/A';
  }
}

const STATUS_COLORS = {
  delivered: { bg:'#ecfdf5', color:'#059669', label:'Delivered' },
  processing: { bg:'#fffbeb', color:'#d97706', label:'Processing' },
  shipped:    { bg:'#eff6ff', color:'#2563eb', label:'Shipped' },
  cancelled:  { bg:'#fef2f2', color:'#dc2626', label:'Cancelled' },
};

const getStatusColor = (status) => STATUS_COLORS[status] || { bg:'#f3f4f6', color:'#6b7280', label: status || 'Unknown' };

const getFixedUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  if (cleanUrl.startsWith('image/upload') || cleanUrl.startsWith('ge/upload')) {
     const path = cleanUrl.replace('ge/upload', 'image/upload');
     return `https://res.cloudinary.com/dhc6iqrbh/${path}`;
  }
  return url;
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editOrder, setEditOrder] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [prodSearch, setProdSearch] = useState('');
  const [prodError, setProdError] = useState('');
  const [prodModal, setProdModal] = useState(null);
  const [prodForm, setProdForm] = useState(EMPTY_PROD);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const [cldImages, setCldImages] = useState([]);
  const [loadingCldImages, setLoadingCldImages] = useState(false);
  const [imageSelectorSlot, setImageSelectorSlot] = useState(null);

  const [homeVideos, setHomeVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics/dashboard');
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        
        // Ensure default devices show up even if 0, rename Mobile to Phone
        const defaultDevices = [{ name: 'Desktop', value: 0 }, { name: 'Phone', value: 0 }, { name: 'Tablet', value: 0 }];
        const deviceMap = {};
        if (d.devices) {
          d.devices.forEach(dev => {
            const name = dev.name === 'Mobile' ? 'Phone' : dev.name || 'Unknown';
            deviceMap[name] = dev.value;
          });
        }
        d.devices = defaultDevices.map(def => ({
          name: def.name,
          value: deviceMap[def.name] || 0
        }));

        setAnalyticsData(d);
      }
    } catch (e) { console.error('Fetch analytics error:', e); }
    setLoadingAnalytics(false);
  };

  const fetchHomeVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch('/api/home-videos');
      const data = await res.json();
      if (!data.error && Array.isArray(data)) setHomeVideos(data);
    } catch (e) { console.error('Fetch home videos error:', e); }
    setLoadingVideos(false);
  };

  useEffect(() => {
    setMounted(true);
    
    // Fetch from MongoDB
    fetchProducts();
    fetchOrders();
    fetchUsers();
    fetchHomeVideos();
    fetchAnalyticsData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (!data.error) setUsers(data);
    } catch (e) { console.error('Fetch users error:', e); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (!data.error) setProducts(data);
    } catch (e) { console.error('Fetch products error:', e); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!data.error) setOrders(data);
    } catch (e) { console.error('Fetch orders error:', e); }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) fetchOrders();
      setEditOrder(null);
    } catch (e) { console.error('Update order error:', e); }
  };



  const fetchCldImages = async () => {
    setLoadingCldImages(true);
    try {
      const res = await fetch('/api/cloudinary-images');
      const data = await res.json();
      if (!data.error) setCldImages(data);
    } catch (e) { console.error('Cld images fetch error:', e); }
    setLoadingCldImages(false);
  };

  const openImageSelector = (slot) => {
    setImageSelectorSlot(slot);
    if (cldImages.length === 0) fetchCldImages();
  };



  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchUsers();
    } catch (e) { console.error('Delete user error:', e); }
  };

  // Product CRUD handled in saveProd and deleteProd

  const openAddProd = () => {
    setProdForm(EMPTY_PROD);
    setProdError('');
    setProdModal('add');
  };

  const openEditProd = (p) => {
    setProdForm({ ...p, price: String(p.price), stock: String(p.stock), sold: String(p.sold), badge: p.badge || '', isStylish: p.isStylish || false, isBestSeller: p.isBestSeller || false, isExclusive: p.isExclusive || false, images: p.images || [], video: p.video || '' });
    setProdError('');
    setProdModal(p);
  };

  const handleProdFormChange = (k, v) => setProdForm(f => ({ ...f, [k]: v }));

  const uploadImageFile = async (file, slotIndex) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProdError('Sirf image files upload kar sakte hain (JPG, PNG, WEBP etc.)');
      return;
    }
    setUploadingIdx(slotIndex);
    setProdError('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });
        const data = await res.json();
        if (res.ok) {
          const newImages = [...(prodForm.images || [])];
          newImages[slotIndex] = data.url;
          handleProdFormChange('images', newImages);
        } else {
          setProdError(data.error || 'Upload failed. Check Cloudinary API Keys in .env.local.');
        }
        setUploadingIdx(null);
      };
    } catch (err) {
      setProdError('Error preparing image');
      setUploadingIdx(null);
    }
  };

  const handleImageUpload = async (e, slotIndex) => {
    const file = e.target.files?.[0];
    await uploadImageFile(file, slotIndex);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setProdError('Sirf video files upload kar sakte hain (MP4, WEBM etc.)');
      return;
    }
    setUploadingVideo(true);
    setProdError('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Video = reader.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Video }),
        });
        const data = await res.json();
        if (res.ok) {
          handleProdFormChange('video', data.url);
        } else {
          setProdError(data.error || 'Upload failed.');
        }
        setUploadingVideo(false);
      };
    } catch (err) {
      setProdError('Error preparing video');
      setUploadingVideo(false);
    }
  };

  const handleDrop = async (e, slotIndex) => {
    e.preventDefault();
    setDragOverIdx(null);
    const file = e.dataTransfer.files?.[0];
    await uploadImageFile(file, slotIndex);
  };

  const handleRemoveImage = (e, slotIndex) => {
    e.stopPropagation();
    const newImages = [...(prodForm.images || [])];
    newImages[slotIndex] = null;
    handleProdFormChange('images', newImages);
  };

  const saveProd = async () => {
    if (!prodForm.name.trim()) { setProdError('Product name required'); return; }
    if (!prodForm.price || isNaN(prodForm.price) || Number(prodForm.price) <= 0) { setProdError('Valid price required'); return; }
    if (!prodForm.stock || isNaN(prodForm.stock) || Number(prodForm.stock) < 0) { setProdError('Valid stock required'); return; }
    const entry = {
      ...prodForm,
      price: Number(prodForm.price),
      stock: Number(prodForm.stock),
      sold: Number(prodForm.sold) || 0,
      badge: prodForm.badge?.trim() || null,
      isStylish: prodForm.isStylish || false,
      isExclusive: prodForm.isExclusive || false,
      isBestSeller: prodForm.isBestSeller || false,
      description: prodForm.description?.trim() || '',
      images: (prodForm.images || []).filter(Boolean),
      video: prodForm.video?.trim() || '',
    };
    try {
      let res;
      if (prodModal === 'add') {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      }
      if (res.ok) {
        fetchProducts();
        setProdModal(null);
      } else {
        const d = await res.json();
        setProdError(d.error || 'Failed to save product');
      }
    } catch (e) { setProdError('Error saving product'); }
  };

  const deleteProd = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchProducts();
    } catch (e) { console.error('Delete product error:', e); }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Name: 'Scarlet Duet Silver Dome Ring',
        Image: 'https://res.cloudinary.com/example/image/upload/sample.jpg',
        Price: 7007,
        MRP: 8500,
        Stock: 1,
        Category: 'Silver Ring',
        Description: 'Beautiful silver ring with gemstone setting',
        Material: '925 Sterling Silver',
        Badge: '-17%',
      },
      {
        Name: 'Eternal Bond Infinity Silver Ring',
        Image: 'https://res.cloudinary.com/example/image/upload/sample2.jpg',
        Price: 2530,
        MRP: 3100,
        Stock: 1,
        Category: 'Silver Ring',
        Description: 'Delicate infinity symbol silver ring',
        Material: '925 Sterling Silver',
        Badge: '-18%',
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    // Set column widths
    ws['!cols'] = [
      { wch: 35 }, // Name
      { wch: 60 }, // Image
      { wch: 10 }, // Price
      { wch: 10 }, // MRP
      { wch: 8 },  // Stock
      { wch: 14 }, // Category
      { wch: 40 }, // Description
      { wch: 20 }, // Material
      { wch: 8 },  // Badge
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'anello_products_template.xlsx');
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkImporting(true);
    setBulkResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/products/bulk-import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setBulkResult(data);
      if (data.success) fetchProducts();
    } catch (err) {
      setBulkResult({ error: 'Upload failed: ' + err.message });
    }
    setBulkImporting(false);
    e.target.value = '';
  };

  // Stats
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || o.amount || 0), 0);
  const totalOrders = orders.length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const processing = orders.filter(o => o.status === 'processing').length;
  const totalSold = products.reduce((s, p) => s + (p.sold || 0), 0);
  const filteredProds = products.filter(p => !prodSearch || p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.cat.toLowerCase().includes(prodSearch.toLowerCase()));

  const filteredOrders = orders.filter(o => {
    const matchFilter = orderFilter === 'all' || o.status === orderFilter;
    const oid = (o._id || o.id || '').toString().toLowerCase();
    const customer = (o.customerName || o.user || '').toLowerCase();
    const email = (o.customerEmail || o.email || '').toLowerCase();
    const matchSearch = !search || oid.includes(search.toLowerCase()) || customer.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (!mounted || loading) return null;

  if (user?.role !== 'admin') {
    return (
      <div className="adm-login-page">
        <div className="adm-login-card" style={{textAlign:'center', padding:'40px'}}>
          <h1 className="adm-login-title" style={{color:'var(--danger)'}}>Access Denied</h1>
          <p className="adm-login-sub">You do not have administrator privileges to view this page.</p>
          <Link href="/" className="adm-login-btn" style={{marginTop:'20px', display:'inline-block', textDecoration:'none'}}>Return to Store</Link>
        </div>
      </div>
    );
  }

  // ── TABS ──
  const TABS = [
    { id:'dashboard', icon:'📊', label:'Dashboard' },
    { id:'orders',    icon:'📦', label:'Orders' },
    { id:'users',     icon:'👥', label:'Users' },
    { id:'products',  icon:'💍', label:'Products' },
    { id:'videos',    icon:'🎥', label:'Videos' },
    { id:'analytics', icon:'📈', label:'Analytics' },
  ];

  return (
    <div className="adm-layout">
      {/* SIDEBAR */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <Image src="/logo.png" alt="Anello" width={130} height={52} style={{ objectFit: 'contain', height: '52px', width: 'auto' }} />
          <span className="adm-sidebar-badge">Admin</span>
        </div>
        <nav className="adm-nav">
          {TABS.map(t => (
            <button key={t.id} className={`adm-nav-item ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
              <span className="adm-nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <a href="/" target="_blank" className="adm-nav-item" style={{textDecoration:'none'}}>
            <span className="adm-nav-icon">🌐</span>
            <span>View Website</span>
          </a>
          <button className="adm-nav-item danger" onClick={handleLogout}>
            <span className="adm-nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="adm-main">
        {/* Header */}
        <div className="adm-header">
          <div>
            <h1 className="adm-page-title">{TABS.find(t=>t.id===tab)?.icon} {TABS.find(t=>t.id===tab)?.label}</h1>
            <p className="adm-page-sub">Anello Fine Rings · Admin Panel</p>
          </div>
          <div className="adm-header-right">
            <div className="adm-header-time">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
            <div className="adm-avatar">A</div>
          </div>
        </div>

        <div className="adm-content">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div className="adm-dashboard">
              {/* Stat Cards */}
              <div className="adm-stats-grid">
                {[
                  { label:'Total Revenue', value:fmt(totalRevenue), icon:'💰', sub:`${delivered} orders delivered`, color:'#b8860b' },
                  { label:'Total Orders', value:totalOrders, icon:'📦', sub:`${processing} pending`, color:'#2563eb' },
                  { label:'Registered Users', value:users.length || 0, icon:'👥', sub:'Active accounts', color:'#7c3aed' },
                  { label:'Products Sold', value:totalSold, icon:'💍', sub:'Across all categories', color:'#059669' },
                ].map((s,i) => (
                  <div key={i} className="adm-stat-card">
                    <div className="adm-stat-icon" style={{background:`${s.color}18`,color:s.color}}>{s.icon}</div>
                    <div>
                      <div className="adm-stat-value" style={{color:s.color}}>{s.value}</div>
                      <div className="adm-stat-label">{s.label}</div>
                      <div className="adm-stat-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status breakdown */}
              <div className="adm-row">
                <div className="adm-card" style={{flex:1}}>
                  <div className="adm-card-title">Order Status Breakdown</div>
                  <div className="adm-status-list">
                    {['delivered','processing','shipped','cancelled'].map(s => {
                      const count = orders.filter(o=>o.status===s).length;
                      const pct = totalOrders > 0 ? Math.round((count/totalOrders)*100) : 0;
                      const sc = STATUS_COLORS[s];
                      return (
                        <div key={s} className="adm-status-row">
                          <span className="adm-status-badge" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                          <div className="adm-status-bar-wrap">
                            <div className="adm-status-bar" style={{width:`${pct}%`,background:sc.color}} />
                          </div>
                          <span className="adm-status-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="adm-card" style={{flex:1}}>
                  <div className="adm-card-title">Recent Orders</div>
                  <div className="adm-recent-orders-list">
                    {orders.slice(0,5).map((o, i) => (
                      <div key={o._id || o.id || i} className="adm-mini-order">
                        <div>
                          <div className="adm-mini-order-id">{o.orderId || (o._id || o.id || '').toString().slice(-8).toUpperCase()}</div>
                          <div className="adm-mini-order-user">{o.user}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div className="adm-mini-order-amt">{fmt(o.total || o.amount)}</div>
                          <span className="adm-status-badge sm" style={{background:getStatusColor(o.status).bg,color:getStatusColor(o.status).color}}>{getStatusColor(o.status).label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="adm-card">
                <div className="adm-card-title">Top Selling Products</div>
                <div className="adm-top-products">
                  {[...products].sort((a,b)=>b.sold-a.sold).slice(0,5).map((p,i) => (
                    <div key={p._id || p.id || i} className="adm-top-prod-row">
                      <span className="adm-top-rank">#{i+1}</span>
                      <div style={{flex:1}}>
                        <div className="adm-top-prod-name">{p.name}</div>
                        <div className="adm-top-prod-cat">{p.cat}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="adm-top-prod-sold">{p.sold} sold</div>
                        <div className="adm-top-prod-rev">{fmt(p.price * p.sold)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div>
              <div className="adm-toolbar">
                <input className="adm-search" placeholder="🔍 Search by order ID, name, email..." value={search} onChange={e=>setSearch(e.target.value)} />
                <div className="adm-filter-tabs">
                  {['all','processing','shipped','delivered','cancelled'].map(f => (
                    <button key={f} className={`adm-filter-tab ${orderFilter===f?'active':''}`} onClick={()=>setOrderFilter(f)}>
                      {f.charAt(0).toUpperCase()+f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="adm-card" style={{padding:0,overflowX:'auto'}}>
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o._id || o.id}>
                        <td><strong>{o.orderId || (o._id || o.id).toString().slice(-8).toUpperCase()}</strong></td>
                        <td>
                          <div className="adm-table-user">{o.addressDetails?.fullName || o.customerName || o.user}</div>
                          <div className="adm-table-email">{o.customerEmail || o.email} <br/> 📞 {o.phone}</div>
                          <div className="adm-table-addr">
                            {o.addressDetails ? (
                              <span>{o.addressDetails.fullAddress}, {o.addressDetails.city}, {o.addressDetails.state} - {o.addressDetails.pincode}</span>
                            ) : (
                              <span>{o.address}</span>
                            )}
                          </div>
                        </td>
                        <td className="adm-table-prod">
                          {o.items && o.items.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {o.items.map((item, idx) => {
                                const imageUrl = item.image ? getFixedUrl(item.image) : null;
                                return (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {imageUrl ? (
                                      <img src={imageUrl} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
                                    ) : (
                                      <span style={{ fontSize: '1.4rem' }}>{item.emoji || '💍'}</span>
                                    )}
                                    <span style={{ fontSize: '0.9rem' }}>{item.qty}x {item.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            o.product
                          )}
                        </td>
                        <td><strong>{fmt(o.total || o.amount)}</strong></td>
                        <td>{fmtDate(o.createdAt || o.date)}</td>
                        <td>
                          <span className="adm-status-badge" style={{background:getStatusColor(o.status).bg,color:getStatusColor(o.status).color}}>
                            {getStatusColor(o.status).label}
                          </span>
                        </td>
                        <td>
                          {editOrder === (o._id || o.id) ? (
                            <div className="adm-status-select-wrap">
                              {['processing','shipped','delivered','cancelled'].map(s => (
                                <button key={s} className="adm-status-opt" style={{background:STATUS_COLORS[s].bg,color:STATUS_COLORS[s].color}} onClick={()=>updateOrderStatus(o._id || o.id,s)}>
                                  {STATUS_COLORS[s].label}
                                </button>
                              ))}
                              <button className="adm-status-opt" style={{background:'#f3f4f6',color:'#6b7280'}} onClick={()=>setEditOrder(null)}>Cancel</button>
                            </div>
                          ) : (
                            <button className="adm-edit-btn" onClick={()=>setEditOrder(o._id || o.id)}>Edit Status</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && <div className="adm-empty">No orders found</div>}
              </div>
              <div className="adm-table-footer">Showing {filteredOrders.length} of {orders.length} orders</div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div>
              <div className="adm-users-summary">
                <div className="adm-stat-card sm">
                  <div className="adm-stat-icon" style={{background:'#7c3aed18',color:'#7c3aed'}}>👥</div>
                  <div>
                    <div className="adm-stat-value" style={{color:'#7c3aed'}}>{users.length}</div>
                    <div className="adm-stat-label">Registered Users</div>
                  </div>
                </div>
              </div>
              <div className="adm-card" style={{padding:0,overflowX:'auto'}}>
                <table className="adm-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={5} className="adm-empty">No registered users yet</td></tr>
                    ) : users.map((u,i) => (
                      <tr key={u.email}>
                        <td>{i+1}</td>
                        <td>
                          <div className="adm-user-row">
                            <div className="adm-user-avatar">{u.name?.charAt(0)?.toUpperCase()}</div>
                            <strong>{u.name}</strong>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.createdAt ? fmtDate(u.createdAt) : 'N/A'}</td>
                        <td>
                          <button className="adm-del-btn" onClick={()=>deleteUser(u.email)}>🗑 Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <div>
              <div className="adm-stats-grid">
                {[
                  {label:'Total Products',value:products.length,icon:'💍',color:'#b8860b'},
                  {label:'Total Units Sold',value:totalSold,icon:'📦',color:'#059669'},
                  {label:'Total Revenue',value:fmt(products.reduce((s,p)=>s+p.price*p.sold,0)),icon:'💰',color:'#2563eb'},
                ].map((s,i)=>(
                  <div key={i} className="adm-stat-card">
                    <div className="adm-stat-icon" style={{background:`${s.color}18`,color:s.color}}>{s.icon}</div>
                    <div>
                      <div className="adm-stat-value" style={{color:s.color}}>{s.value}</div>
                      <div className="adm-stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Toolbar */}
              <div className="adm-toolbar">
                <input className="adm-search" placeholder="🔍 Search products..." value={prodSearch} onChange={e=>setProdSearch(e.target.value)} />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="adm-add-btn" onClick={openAddProd}>+ Add Product</button>
                  <button
                    onClick={downloadTemplate}
                    style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                  >📥 Excel Template</button>
                  <label style={{ background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'inline-block' }}>
                    {bulkImporting ? '⏳ Uploading...' : '📤 Bulk Import Excel'}
                    <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleBulkImport} disabled={bulkImporting} />
                  </label>
                </div>
              </div>

              {/* Bulk Import Result */}
              {bulkResult && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: bulkResult.success ? '#ecfdf5' : '#fef2f2',
                  border: `1px solid ${bulkResult.success ? '#10b981' : '#ef4444'}`,
                  color: bulkResult.success ? '#065f46' : '#991b1b',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {bulkResult.success
                    ? `✅ ${bulkResult.message}`
                    : `❌ Error: ${bulkResult.error}`}
                  {bulkResult.errors?.length > 0 && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
                      {bulkResult.errors.map((e, i) => <div key={i}>⚠️ {e}</div>)}
                    </div>
                  )}
                  <button onClick={() => setBulkResult(null)} style={{ marginLeft: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                </div>
              )}

              <div className="adm-card" style={{padding:0,overflowX:'auto'}}>
                <table className="adm-table">
                  <thead>
                    <tr><th>#</th><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th>Badge</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredProds.map((p,i)=>(
                      <tr key={p._id || p.id}>
                        <td>{i+1}</td>
                        <td>
                          {p.images && p.images[0] ? (
                            <div style={{width:'80px', height:'80px', position:'relative', borderRadius:'4px', overflow:'hidden', background:'var(--bg2)'}}>
                              <img src={getFixedUrl(p.images[0])} alt={p.name} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                            </div>
                          ) : (
                            <span style={{fontSize:'1.4rem'}}>{p.emoji}</span>
                          )}
                        </td>
                        <td><strong>{p.name}</strong>{p.isNewArrival&&<span className="adm-new-badge">NEW</span>}</td>
                        <td><span className="adm-cat-badge">{p.cat}</span></td>
                        <td>{fmt(p.price)}</td>
                        <td>
                          <span style={{color:p.stock<10?'#dc2626':'#059669',fontWeight:600}}>{p.stock}</span>
                          {p.stock<10&&<span className="adm-low-stock">Low</span>}
                        </td>
                        <td>{p.sold}</td>
                        <td>{p.badge?<span className="adm-discount-badge">{p.badge}</span>:'—'}</td>
                        <td>
                          <div style={{display:'flex',gap:'6px'}}>
                            <button className="adm-edit-btn" onClick={()=>openEditProd(p)}>✏️ Edit</button>
                            <button className="adm-del-btn" onClick={()=>deleteProd(p._id || p.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProds.length===0&&<div className="adm-empty">No products found</div>}
              </div>
              <div className="adm-table-footer">Showing {filteredProds.length} of {products.length} products</div>
            </div>
          )}

          {/* ── VIDEOS ── */}
          {tab === 'videos' && (
            <div>
              <div className="adm-toolbar">
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>⚙️ Homepage Videos: Edit the Video URL and the Redirect Click Link for each slot.</p>
              </div>
              <div className="adm-card" style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => {
                    const existing = homeVideos.find(v => v.slot === slot) || { slot, url: '', hashtag: '', link: '' };
                    return (
                      <VideoSlotForm
                        key={slot}
                        initialVideo={existing}
                        onSave={async (updated) => {
                          const res = await fetch('/api/home-videos', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updated)
                          });
                          if (res.ok) {
                            fetchHomeVideos();
                            alert(`Slot ${slot} saved successfully!`);
                          } else {
                            alert('Failed to save slot');
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCT MODAL ── */}
          {prodModal && (
            <div className="adm-modal-overlay" onClick={e=>e.target===e.currentTarget&&setProdModal(null)}>
              <div className="adm-modal">
                <div className="adm-modal-header">
                  <h2 className="adm-modal-title">{prodModal==='add'?'➕ Add New Product':'✏️ Edit Product'}</h2>
                  <button className="fp-close" onClick={()=>setProdModal(null)}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {prodError&&<div className="adm-modal-error">{prodError}</div>}

                <div className="adm-modal-grid">
                  {/* Name */}
                  <div className="adm-modal-field full">
                    <label className="adm-modal-label">Product Name *</label>
                    <input className="adm-modal-input" placeholder="e.g. Rose Gold Halo Ring" value={prodForm.name} onChange={e=>handleProdFormChange('name',e.target.value)} />
                  </div>

                  {/* Category */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Category *</label>
                    <select className="adm-modal-input" value={prodForm.cat} onChange={e=>handleProdFormChange('cat',e.target.value)}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Emoji */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Emoji Icon</label>
                    <div className="adm-emoji-grid">
                      {EMOJIS.map(em=>(
                        <button key={em} type="button" className={`adm-emoji-btn ${prodForm.emoji===em?'active':''}`} onClick={()=>handleProdFormChange('emoji',em)}>{em}</button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Price (₹) *</label>
                    <input className="adm-modal-input" type="number" placeholder="e.g. 49999" value={prodForm.price} onChange={e=>handleProdFormChange('price',e.target.value)} />
                  </div>

                  {/* Stock */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Stock Quantity *</label>
                    <input className="adm-modal-input" type="number" placeholder="e.g. 25" value={prodForm.stock} onChange={e=>handleProdFormChange('stock',e.target.value)} />
                  </div>

                  {/* Badge */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Discount Badge</label>
                    <input className="adm-modal-input" placeholder="e.g. -20% (leave blank for none)" value={prodForm.badge} onChange={e=>handleProdFormChange('badge',e.target.value)} />
                  </div>

                  {/* isNew */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Mark as NEW?</label>
                    <div className="adm-toggle-wrap">
                      <button type="button" className={`adm-toggle ${prodForm.isNewArrival?'on':''}`} onClick={()=>handleProdFormChange('isNewArrival',!prodForm.isNewArrival)}>
                        <span className="adm-toggle-knob" />
                      </button>
                      <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{prodForm.isNewArrival?'Yes — NEW badge will show':'No'}</span>
                    </div>
                  </div>

                  {/* isStylish */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Show in Stylish Slider?</label>
                    <div className="adm-toggle-wrap">
                      <button type="button" className={`adm-toggle ${prodForm.isStylish?'on':''}`} onClick={()=>handleProdFormChange('isStylish',!prodForm.isStylish)}>
                        <span className="adm-toggle-knob" />
                      </button>
                      <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{prodForm.isStylish?'Yes — Will appear in auto-slider':'No'}</span>
                    </div>
                  </div>

                  {/* isExclusive */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Is Exclusive Ring?</label>
                    <div className="adm-toggle-wrap">
                      <button type="button" className={`adm-toggle ${prodForm.isExclusive?'on':''}`} onClick={()=>handleProdFormChange('isExclusive',!prodForm.isExclusive)}>
                        <span className="adm-toggle-knob" />
                      </button>
                      <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{prodForm.isExclusive?'Yes — Will appear next to Promo Slider':'No'}</span>
                    </div>
                  </div>

                  {/* isBestSeller */}
                  <div className="adm-modal-field">
                    <label className="adm-modal-label">Show in Best Sellers?</label>
                    <div className="adm-toggle-wrap">
                      <button type="button" className={`adm-toggle ${prodForm.isBestSeller?'on':''}`} onClick={()=>handleProdFormChange('isBestSeller',!prodForm.isBestSeller)}>
                        <span className="adm-toggle-knob" />
                      </button>
                      <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{prodForm.isBestSeller?'Yes — Will appear in Best Sellers Carousel':'No'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="adm-modal-field full">
                    <label className="adm-modal-label">Description</label>
                    <textarea className="adm-modal-input" placeholder="Product description..." rows="3" value={prodForm.description} onChange={e=>handleProdFormChange('description',e.target.value)} style={{resize:'vertical'}} />
                  </div>

                  {/* Video Upload */}
                  <div className="adm-modal-field full">
                    <label className="adm-modal-label">Product Video (Optional)</label>
                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                      <input 
                        className="adm-modal-input" 
                        style={{flex:1}} 
                        placeholder="Video URL or Upload ->" 
                        value={prodForm.video} 
                        onChange={e=>handleProdFormChange('video',e.target.value)} 
                      />
                      <input 
                        type="file" 
                        accept="video/*" 
                        id="prod-video-upload" 
                        style={{display:'none'}} 
                        onChange={handleVideoUpload} 
                      />
                      <button 
                        type="button" 
                        className="adm-add-btn" 
                        style={{padding:'10px 15px', whiteSpace:'nowrap'}} 
                        onClick={() => document.getElementById('prod-video-upload').click()}
                        disabled={uploadingVideo}
                      >
                        {uploadingVideo ? '⏳ Uploading...' : '🎥 Upload Video'}
                      </button>
                    </div>
                    {prodForm.video && (
                      <div style={{marginTop:'10px'}}>
                        <video src={getFixedUrl(prodForm.video)} controls style={{maxHeight:'150px', borderRadius:'8px', border:'1px solid var(--border)'}} />
                      </div>
                    )}
                  </div>

                  {/* Image Upload - 4 Slots with Drag & Drop */}
                  <div className="adm-modal-field full">
                    <label className="adm-modal-label">Product Images (Up to 4)</label>
                    <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'8px',marginTop:'-4px'}}>📂 Image drag & drop karein ya Upload button click karein</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'10px'}}>
                      {[0,1,2,3].map(slot => (
                        <div key={slot} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
                          {/* Drop Zone */}
                          <div
                            onDragOver={e => { e.preventDefault(); setDragOverIdx(slot); }}
                            onDragLeave={() => setDragOverIdx(null)}
                            onDrop={e => handleDrop(e, slot)}
                            onClick={() => openImageSelector(slot)}
                            style={{
                              width:'100%', aspectRatio:'1/1', borderRadius:'8px',
                              border: dragOverIdx === slot ? '2px solid var(--gold-dark)' : '2px dashed var(--border-dark)',
                              background: dragOverIdx === slot ? 'rgba(184,134,11,0.08)' : 'var(--bg2)',
                              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                              cursor:'pointer', position:'relative', overflow:'hidden',
                              transition:'all 0.2s ease',
                              boxShadow: dragOverIdx === slot ? '0 0 0 3px rgba(184,134,11,0.2)' : 'none',
                            }}
                          >
                            {uploadingIdx === slot ? (
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                                <div style={{width:'28px',height:'28px',border:'3px solid var(--gold-dark)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
                                <span style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>Uploading...</span>
                              </div>
                            ) : prodForm.images?.[slot] ? (
                              <>
                                <Image src={prodForm.images[slot]} alt={`Slot ${slot+1}`} fill style={{ objectFit: 'cover' }} />
                                {/* Remove Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveImage(e, slot)}
                                  style={{
                                    position:'absolute', top:'4px', right:'4px',
                                    background:'rgba(0,0,0,0.6)', color:'#fff',
                                    border:'none', borderRadius:'50%', width:'24px', height:'24px',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    cursor:'pointer', fontSize:'14px', zIndex:10
                                  }}
                                >
                                  ✕
                                </button>
                                {/* Hover Overlay */}
                                <div style={{
                                  position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',
                                  display:'flex',alignItems:'center',justifyContent:'center',
                                  opacity: dragOverIdx === slot ? 1 : 0,
                                  transition:'opacity 0.2s',
                                  color:'#fff',fontSize:'1.5rem',
                                  pointerEvents: 'none'
                                }}>🔄</div>
                              </>
                            ) : (
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',color: dragOverIdx === slot ? 'var(--gold-dark)' : 'var(--text-muted)'}}>
                                <span style={{fontSize:'1.6rem'}}>☁️</span>
                                <span style={{fontSize:'0.68rem',textAlign:'center',lineHeight:1.3,padding:'0 4px'}}>
                                  {dragOverIdx === slot ? 'Chodo!' : 'Drop or Click'}
                                </span>
                              </div>
                            )}
                          </div>
                          <input type="file" accept="image/*" id={`prod-img-${slot}`} style={{display:'none'}} onChange={(e)=>handleImageUpload(e, slot)} />
                          <label
                            className="adm-upload-btn"
                            style={{padding:'0.4rem 0.6rem',fontSize:'0.75rem',width:'100%',textAlign:'center',cursor:'pointer'}}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openImageSelector(slot); }}
                          >
                            {uploadingIdx === slot ? '⏳ Wait...' : '⬆ Upload'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="adm-modal-actions">
                  <button className="adm-modal-cancel" onClick={()=>setProdModal(null)}>Cancel</button>
                  <button className="adm-modal-save" onClick={saveProd}>{prodModal==='add'?'Add Product':'Save Changes'}</button>
                </div>
              </div>

              {/* Image Selector Sub-Modal */}
              {imageSelectorSlot !== null && (
                <div className="adm-modal-overlay" style={{zIndex: 9999}} onClick={e=>e.target===e.currentTarget&&setImageSelectorSlot(null)}>
                  <div className="adm-modal" style={{maxWidth:'600px', width:'90%'}}>
                    <div className="adm-modal-header">
                      <h2 className="adm-modal-title">Select Image</h2>
                      <button className="fp-close" onClick={()=>setImageSelectorSlot(null)}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                    <div style={{padding:'20px 0'}}>
                      <div style={{marginBottom:'20px'}}>
                        <button className="adm-add-btn" style={{width:'100%', padding:'12px'}} onClick={() => {
                          document.getElementById(`prod-img-${imageSelectorSlot}`).click();
                          setImageSelectorSlot(null);
                        }}>
                          ⬆️ Upload New Image from Computer
                        </button>
                      </div>
                      
                      <h3 style={{fontSize:'1rem', marginBottom:'10px', color:'var(--text)', marginTop:'20px'}}>Cloudinary Gallery</h3>
                      <div style={{
                        display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))', gap:'10px',
                        maxHeight:'200px', overflowY:'auto', padding:'5px', border:'1px solid var(--border-color)', borderRadius:'8px'
                      }}>
                        {loadingCldImages ? (
                          <div style={{gridColumn:'1/-1', textAlign:'center', color:'var(--text-muted)', padding:'20px'}}>Loading Cloudinary...</div>
                        ) : cldImages.length > 0 ? (
                          cldImages.map((img, idx) => (
                            <div 
                              key={`cld-${idx}`} 
                              style={{
                                aspectRatio:'1/1', position:'relative', borderRadius:'6px', overflow:'hidden', cursor:'pointer',
                                border:'2px solid transparent', transition:'all 0.2s', background:'#f0f0f0'
                              }}
                              onClick={() => {
                                const newImages = [...(prodForm.images || [])];
                                newImages[imageSelectorSlot] = img.url;
                                handleProdFormChange('images', newImages);
                                setImageSelectorSlot(null);
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                              <img src={img.url} alt="Cloudinary" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            </div>
                          ))
                        ) : (
                          <div style={{gridColumn:'1/-1', textAlign:'center', color:'var(--text-muted)', padding:'20px'}}>No Cloudinary images found</div>
                        )}
                      </div>

                      <h3 style={{fontSize:'1rem', margin:'20px 0 10px 0', color:'var(--text)'}}>Product Images</h3>
                      <div style={{
                        display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))', gap:'10px',
                        maxHeight:'150px', overflowY:'auto', padding:'5px', border:'1px solid var(--border-color)', borderRadius:'8px'
                      }}>
                        {Array.from(new Set(products.flatMap(p => p.images || []).filter(Boolean))).length > 0 ? (
                          Array.from(new Set(products.flatMap(p => p.images || []).filter(Boolean))).map((imgUrl, idx) => (
                            <div 
                              key={`prod-${idx}`} 
                              style={{
                                aspectRatio:'1/1', position:'relative', borderRadius:'6px', overflow:'hidden', cursor:'pointer',
                                border:'2px solid transparent', transition:'all 0.2s', background:'#f0f0f0'
                              }}
                              onClick={() => {
                                const newImages = [...(prodForm.images || [])];
                                newImages[imageSelectorSlot] = imgUrl;
                                handleProdFormChange('images', newImages);
                                setImageSelectorSlot(null);
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                              <img src={getFixedUrl(imgUrl)} alt="Product" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            </div>
                          ))
                        ) : (
                          <div style={{gridColumn:'1/-1', textAlign:'center', color:'var(--text-muted)', padding:'20px'}}>No product images found</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div className="adm-analytics">
              {loadingAnalytics ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading Analytics Data...</div>
              ) : analyticsData ? (
                <>
                  <div className="adm-toolbar" style={{ justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0, color: 'var(--gold)' }}>Website & User Analytics</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="adm-add-btn" onClick={() => {
                        const ws = XLSX.utils.json_to_sheet(analyticsData.trafficDaily || []);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Traffic Data");
                        XLSX.writeFile(wb, "Analytics_Report.xlsx");
                      }}>📥 Export to Excel</button>
                      <button className="adm-add-btn" onClick={() => {
                        const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(analyticsData.trafficDaily || []));
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.setAttribute('href', url);
                        a.setAttribute('download', 'Analytics_Report.csv');
                        a.click();
                      }}>📄 Export to CSV</button>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="adm-stats-grid">
                    <div className="adm-stat-card">
                      <div className="adm-stat-icon" style={{ background: '#3b82f618', color: '#3b82f6' }}>👥</div>
                      <div>
                        <div className="adm-stat-value" style={{ color: '#3b82f6' }}>{analyticsData.kpis?.totalVisitors || 0}</div>
                        <div className="adm-stat-label">Total Visitors</div>
                      </div>
                    </div>
                    <div className="adm-stat-card">
                      <div className="adm-stat-icon" style={{ background: '#10b98118', color: '#10b981' }}>🟢</div>
                      <div>
                        <div className="adm-stat-value" style={{ color: '#10b981' }}>{analyticsData.kpis?.activeUsers || 0}</div>
                        <div className="adm-stat-label">Active Users (10m)</div>
                      </div>
                    </div>
                    <div className="adm-stat-card">
                      <div className="adm-stat-icon" style={{ background: '#f59e0b18', color: '#f59e0b' }}>🛒</div>
                      <div>
                        <div className="adm-stat-value" style={{ color: '#f59e0b' }}>{analyticsData.kpis?.addToCartEvents || 0}</div>
                        <div className="adm-stat-label">Add to Carts</div>
                      </div>
                    </div>
                    <div className="adm-stat-card">
                      <div className="adm-stat-icon" style={{ background: '#8b5cf618', color: '#8b5cf6' }}>✅</div>
                      <div>
                        <div className="adm-stat-value" style={{ color: '#8b5cf6' }}>{analyticsData.kpis?.totalOrders || 0}</div>
                        <div className="adm-stat-label">Total Orders</div>
                      </div>
                    </div>
                  </div>

                  <div className="adm-row" style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Traffic Chart */}
                    <div className="adm-card" style={{ flex: '2 1 500px', height: '280px' }}>
                      <div className="adm-card-title">Daily Traffic (Last 30 Days)</div>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={analyticsData.trafficDaily} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="views" stroke="#b8860b" strokeWidth={3} dot={false} name="Page Views" />
                          <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={false} name="Unique Visitors" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Traffic Sources */}
                    <div className="adm-card" style={{ flex: '1 1 300px', height: '280px' }}>
                      <div className="adm-card-title">Traffic Sources</div>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie data={analyticsData.trafficSources} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {analyticsData.trafficSources?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#b8860b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 6]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="adm-row" style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Device & Browser */}
                    <div className="adm-card" style={{ flex: '1 1 300px', height: '250px' }}>
                      <div className="adm-card-title">Device Breakdown</div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={analyticsData.devices} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="adm-card" style={{ flex: '1 1 300px', height: '250px' }}>
                      <div className="adm-card-title">Browser Breakdown</div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={analyticsData.browsers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="adm-card" style={{ marginTop: '20px', overflowX: 'auto' }}>
                    <div className="adm-card-title">Most Viewed Products</div>
                    <table className="adm-table">
                      <thead>
                        <tr><th>Product</th><th>Category</th><th>Price</th><th>Total Views</th><th>Unique Visitors</th></tr>
                      </thead>
                      <tbody>
                        {analyticsData.topProducts?.map((item, i) => (
                          <tr key={item.productId?._id || i}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.productId?.images?.[0] ? (
                                  <img src={getFixedUrl(item.productId.images[0])} alt="prod" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                ) : <span style={{ fontSize: '1.5rem' }}>💍</span>}
                                <strong>{item.productId?.name || 'Unknown Product'}</strong>
                              </div>
                            </td>
                            <td>{item.productId?.cat}</td>
                            <td>{fmt(item.productId?.price)}</td>
                            <td><strong style={{ color: '#b8860b' }}>{item.views}</strong></td>
                            <td>{item.uniqueViews}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!analyticsData.topProducts?.length && <div className="adm-empty">No product views recorded yet.</div>}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>No analytics data available</div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
