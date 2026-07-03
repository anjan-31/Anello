'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Chatbot() {
  const pathname = usePathname();

  if (pathname && (pathname.includes('/admin') || pathname.startsWith('/checkout'))) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(null); // 'en' or 'hi'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]); // Store products for rendering cards
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch products only when chatbot is opened to save mobile data on initial load
    if (isOpen && products.length === 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setProducts(data);
        })
        .catch(err => console.error('Error fetching products for chatbot:', err));
    }
  }, [isOpen, products.length]);

  // Drag functionality removed to ensure click reliability on all devices

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Voice features removed
  const messagesRef = useRef([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleSendMessage = async (text = input) => {
    const trimmedText = typeof text === 'string' ? text.trim() : '';
    if (!trimmedText) return;

    const userMessage = { role: 'user', content: trimmedText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMessage],
          language: language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      if (data.choices && data.choices[0]) {
        const aiMessage = data.choices[0].message;
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = language === 'hi' 
        ? "क्षमा करें, मुझे जवाब देने में समस्या हो रही है। कृपया पुनः प्रयास करें।" 
        : "Sorry, I'm having trouble responding. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content) => {
    // Split content by our custom [PRODUCT: slug] tags
    const parts = content.split(/(\[PRODUCT:[^\]]+\])/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('[PRODUCT:') && part.endsWith(']')) {
        const slug = part.replace('[PRODUCT:', '').replace(']', '').trim();
        const product = products.find(p => p.slug === slug);
        
        if (product) {
          return (
            <a key={index} href={`/product/${product.slug}`} className="chat-product-card" target="_blank" rel="noopener noreferrer">
              <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="chat-product-img" />
              <div className="chat-product-info">
                <div className="chat-product-name">{product.name}</div>
                <div className="chat-product-price">₹{product.price?.toLocaleString('en-IN')}</div>
              </div>
            </a>
          );
        }
        return null; // Don't render invalid product tags
      }
      return <span key={index}>{part}</span>;
    });
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    const welcomeMsg = lang === 'en' 
      ? "Hello! Welcome to Anello. How can I help you today? I can tell you about our support services or website details."
      : "नमस्ते! अनेलो में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूँ? मैं आपको हमारी सहायता सेवाओं या वेबसाइट के विवरण के बारे में बता सकता हूँ।";
    
    setMessages([{ role: 'assistant', content: welcomeMsg }]);
  };
  const [showBubble, setShowBubble] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'support'
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '', website: '' });
  const [supportStatus, setSupportStatus] = useState(null); // 'sending', 'sent', 'error'

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportStatus('sending');
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportForm),
      });
      if (res.ok) {
        setSupportStatus('sent');
        setSupportForm({ name: '', email: '', message: '', website: '' });
        setTimeout(() => setSupportStatus(null), 3000);
      } else {
        setSupportStatus('error');
      }
    } catch {
      setSupportStatus('error');
    }
  };

  if (!isOpen) {
    return (
      <div className="chatbot-trigger-container">
        {showBubble && (
          <div className="greeting-bubble">
            <span>How can I help you?</span>
            <button className="bubble-close" onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}>×</button>
            <div className="bubble-arrow"></div>
          </div>
        )}
        <button 
          className="chatbot-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
        >
          <div className="trigger-avatar-wrap">
            <img src="/assistant-avatar.png" alt="Assistant" className="trigger-avatar" />
            <span className="trigger-online-dot"></span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="assistant-avatar-small">
            <img src="/assistant-avatar.png" alt="Assistant" />
            <span className="online-indicator-dot"></span>
          </div>
          Anello Assistant
        </div>
        <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="chatbot-tabs">
        <button className={`chatbot-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          AI Chat
        </button>
        <button className={`chatbot-tab ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
          Support
        </button>
      </div>

      {!language && activeTab === 'chat' ? (
        <div className="chatbot-lang-select">
          <h3>Choose Language / भाषा चुनें</h3>
          <div className="lang-btns">
            <button onClick={() => selectLanguage('en')}>English</button>
            <button onClick={() => selectLanguage('hi')}>हिन्दी (Hindi)</button>
          </div>
        </div>
      ) : activeTab === 'support' ? (
        <div className="chatbot-support-view">
          <div className="support-info-box">
            <div className="support-info-title">Contact Information</div>
            <div className="support-info-content">
              <strong>Email:</strong> worldanello@gmail.com<br/>
              <strong>Support:</strong> +91 95454 57711
            </div>
            <div className="support-hours">
              Mon – Sat: 10:00 AM – 6:00 PM
            </div>
          </div>

          <div className="support-options-grid">
            <a href="/api/whatsapp" target="_blank" rel="nofollow noopener noreferrer" className="support-option-box">
              <span className="support-option-icon">💬</span>
              <span className="support-option-label">WhatsApp</span>
            </a>
            <a href="tel:+919545457711" className="support-option-box">
              <span className="support-option-icon">📞</span>
              <span className="support-option-label">Call Now</span>
            </a>
          </div>

          <div className="support-info-box">
            <div className="support-info-title">Send a Message</div>
            <form className="support-form" onSubmit={handleSupportSubmit}>
              {/* Honeypot field */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={supportForm.website}
                  onChange={e => setSupportForm({...supportForm, website: e.target.value})}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input 
                className="support-input" placeholder="Your Name" 
                value={supportForm.name} onChange={e => setSupportForm({...supportForm, name: e.target.value})}
              />
              <input 
                className="support-input" type="email" placeholder="Your Email" 
                value={supportForm.email} onChange={e => setSupportForm({...supportForm, email: e.target.value})}
              />
              <textarea 
                className="support-input support-textarea" placeholder="How can we help?" required
                value={supportForm.message} onChange={e => setSupportForm({...supportForm, message: e.target.value})}
              />
              <button className="support-submit" type="submit" disabled={supportStatus === 'sending'}>
                {supportStatus === 'sending' ? 'Sending...' : supportStatus === 'sent' ? 'Message Sent! ✓' : 'Send Message'}
              </button>
              {supportStatus === 'error' && <p style={{fontSize:'0.7rem', color:'var(--danger)', textAlign:'center'}}>Error sending message. Try again.</p>}
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="chatbot-messages" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <img src="/assistant-avatar.png" className="message-avatar" alt="Avatar" />
                )}
                <div className={`message ${msg.role}`}>
                  <div className="message-content">{renderMessageContent(msg.content)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <img src="/assistant-avatar.png" className="message-avatar" alt="Avatar" />
                <div className="message assistant loading">Typing...</div>
              </div>
            )}
          </div>

          <div className="chatbot-input-area">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={language === 'hi' ? "कुछ पूछें..." : "Ask something..."}
            />
            <button className="send-btn" onClick={() => handleSendMessage()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
