import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, Edit2, Layout, Megaphone, Users, Image as ImageIcon } from 'lucide-react';
import { getCMSData, updateGlobalNotices, updateHeroData, updateAuthorityMessages, CMSData, GlobalNotice, AuthorityMessage } from '../../services/cms/cmsService';
import { Button } from '../../components/ui/button';

export function RootCMSPage() {
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'messages' | 'notices'>('hero');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const data = getCMSData();
    setCmsData(data);
    
    const handleStorage = () => {
      setCmsData(getCMSData());
    };
    window.addEventListener('shksc_state_update', handleStorage);
    return () => window.removeEventListener('shksc_state_update', handleStorage);
  }, []);

  if (!cmsData) return null;

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroData(cmsData.hero);
    showSuccess('Hero data updated successfully!');
  };

  const handleSaveMessages = (e: React.FormEvent) => {
    e.preventDefault();
    updateAuthorityMessages(cmsData.messages);
    showSuccess('Authority messages updated successfully!');
  };

  const handleSaveNotices = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalNotices(cmsData.notices);
    showSuccess('Announcements updated successfully!');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const addNotice = () => {
    const newNotice: GlobalNotice = {
      id: Date.now(),
      title: 'New Notice',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: 'Notice content goes here...',
      isNew: true
    };
    setCmsData(prev => prev ? { ...prev, notices: [newNotice, ...prev.notices] } : null);
  };

  const deleteNotice = (id: number) => {
    setCmsData(prev => prev ? { ...prev, notices: prev.notices.filter(n => n.id !== id) } : null);
  };

  const updateNotice = (index: number, field: keyof GlobalNotice, value: any) => {
    setCmsData(prev => {
      if (!prev) return prev;
      const newNotices = [...prev.notices];
      newNotices[index] = { ...newNotices[index], [field]: value };
      return { ...prev, notices: newNotices };
    });
  };

  const updateMessage = (index: number, field: keyof AuthorityMessage, value: any) => {
    setCmsData(prev => {
      if (!prev) return prev;
      const newMessages = [...prev.messages];
      newMessages[index] = { ...newMessages[index], [field]: value };
      return { ...prev, messages: newMessages };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-950 flex items-center gap-2">
            <Layout className="w-6 h-6 text-accent-500" />
            Content Management (CMS)
          </h1>
          <p className="text-gray-600 mt-1">Manage global website content without coding.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-medium">
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'hero' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Layout className="w-4 h-4" /> Hero Section
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'messages' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4" /> Authority Messages
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'notices' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Announcements
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="space-y-6">
            <h2 className="text-lg font-bold text-primary-950 mb-4">Homepage Hero Text</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="headline">Main Headline</label>
                <input 
                  id="headline" 
                  value={cmsData.hero.headline} 
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, headline: e.target.value } })}
                  className="mt-1 font-heading text-lg"
                />
              </div>
              
              <div>
                <label htmlFor="subHeadline">Sub Headline</label>
                <textarea 
                  id="subHeadline" 
                  value={cmsData.hero.subHeadline}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, subHeadline: e.target.value } })}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" /> Save Hero Section
              </Button>
            </div>
          </form>
        )}

        {/* AUTHORITY MESSAGES */}
        {activeTab === 'messages' && (
          <form onSubmit={handleSaveMessages} className="space-y-8">
            <h2 className="text-lg font-bold text-primary-950 mb-4">Messages from Authority</h2>
            
            {cmsData.messages.map((msg, index) => (
              <div key={msg.id} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{msg.id === 'chairman' ? 'Chairman Section' : 'Principal Section'}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Name</label>
                    <input 
                      value={msg.name} 
                      onChange={(e) => updateMessage(index, 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label>Title/Designation</label>
                    <input 
                      value={msg.title} 
                      onChange={(e) => updateMessage(index, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Image URL (or path like /chairman.png)</label>
                    <div className="flex gap-2 mt-1">
                      <input 
                        value={msg.image} 
                        onChange={(e) => updateMessage(index, 'image', e.target.value)}
                      />
                      <div className="w-10 h-10 shrink-0 bg-gray-100 border border-gray-200 rounded overflow-hidden">
                        {msg.image && <img src={msg.image} alt="Preview" className="w-full h-full object-cover" />}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label>Message / Quote</label>
                    <textarea 
                      value={msg.quote}
                      onChange={(e) => updateMessage(index, 'quote', e.target.value)}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" /> Save Messages
              </Button>
            </div>
          </form>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'notices' && (
          <form onSubmit={handleSaveNotices} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-primary-950">Global Announcements</h2>
              <Button type="button" onClick={addNotice} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Add Notice
              </Button>
            </div>
            
            <div className="space-y-4">
              {cmsData.notices.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                  No announcements. Click "Add Notice" to create one.
                </div>
              ) : (
                cmsData.notices.map((notice, index) => (
                  <div key={notice.id} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                    <button
                      type="button"
                      onClick={() => deleteNotice(notice.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                      <div>
                        <label>Title</label>
                        <input 
                          value={notice.title} 
                          onChange={(e) => updateNotice(index, 'title', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label>Date</label>
                          <input 
                            value={notice.date} 
                            onChange={(e) => updateNotice(index, 'date', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <input 
                            type="checkbox" 
                            id={`isNew-${notice.id}`}
                            checked={notice.isNew}
                            onChange={(e) => updateNotice(index, 'isNew', e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded border-gray-300"
                          />
                          <label htmlFor={`isNew-${notice.id}`} className="mb-0 cursor-pointer">Mark as "New"</label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label>Content</label>
                        <textarea 
                          value={notice.content}
                          onChange={(e) => updateNotice(index, 'content', e.target.value)}
                          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" /> Save Announcements
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
