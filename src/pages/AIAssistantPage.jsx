import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assistantService } from '../services/assistantService';
import ReactMarkdown from 'react-markdown';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await assistantService.getHistory();
        const formatted = history.flatMap(h => [
          { id: `q-${h.queryid}`, role: 'user', content: h.userquestion },
          { id: `a-${h.queryid}`, role: 'assistant', content: h.airesponse }
        ]);
        setMessages(formatted);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setInitialLoad(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    
    // Optimistic UI
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: `q-temp-${tempId}`, role: 'user', content: question }]);
    setLoading(true);

    try {
      const result = await assistantService.askQuestion(question);
      setMessages(prev => [...prev, { id: `a-${result.queryid}`, role: 'assistant', content: result.airesponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: `err-${tempId}`, role: 'assistant', content: "I'm sorry, I encountered an error connecting to my brain. Please try again later.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', maxWidth: '900px', margin: '0 auto', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(to right, #f8fafc, #ffffff)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>StockSense AI Assistant</h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>Powered by Gemini 1.5 Flash</p>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '1rem' }}>
            <Bot size={48} style={{ opacity: 0.2 }} />
            <p style={{ textAlign: 'center', maxWidth: '400px' }}>
              I have real-time access to your inventory database. Ask me things like <br/>
              <strong style={{ color: '#475569' }}>"Which items are low on stock?"</strong> or <br/>
              <strong style={{ color: '#475569' }}>"What is our most expensive electronic?"</strong>
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  maxWidth: '85%'
                }}
              >
                {/* Avatar */}
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? '#f1f5f9' : '#eef2ff',
                  border: `1px solid ${msg.role === 'user' ? '#e2e8f0' : '#c7d2fe'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: msg.role === 'user' ? '#64748b' : '#4f46e5'
                }}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div style={{ 
                  background: msg.role === 'user' ? '#0f172a' : msg.isError ? '#fef2f2' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : msg.isError ? '#dc2626' : '#1e293b',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '1rem',
                  borderTopLeftRadius: msg.role === 'assistant' ? 0 : '1rem',
                  borderTopRightRadius: msg.role === 'user' ? 0 : '1rem',
                  border: msg.role === 'user' ? 'none' : msg.isError ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  boxShadow: msg.role === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  whiteSpace: msg.role === 'user' ? 'pre-wrap' : 'normal'
                }}>
                  {msg.role === 'assistant' && !msg.isError ? (
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eef2ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
              <Bot size={16} />
            </div>
            <div style={{ background: '#ffffff', padding: '0.875rem 1.25rem', borderRadius: '1rem', borderTopLeftRadius: 0, border: '1px solid #e2e8f0', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a5b4fc' }} />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }} />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your inventory..."
            disabled={loading}
            style={{ 
              flex: 1, padding: '0.875rem 1.25rem', borderRadius: '999px', border: '1px solid #cbd5e1', 
              outline: 'none', fontSize: '0.9375rem', background: '#f8fafc',
              transition: 'all 0.2s'
            }}
            autoFocus
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            style={{ 
              width: '46px', height: '46px', borderRadius: '50%', border: 'none', 
              background: !input.trim() || loading ? '#cbd5e1' : '#4f46e5', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <Send size={18} style={{ marginLeft: '2px' }} />
          </button>
        </form>
      </div>

    </div>
  );
}
