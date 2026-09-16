import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Mail, MessageSquare, BellRing, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { 
  getCommunications, 
  sendCommunication, 
  CommunicationChannel, 
  CommunicationAudience, 
  CommunicationMessage 
} from '../../services/communication/communicationService';

export function RootCommunicationsPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [channel, setChannel] = useState<CommunicationChannel>('System Alert');
  const [audience, setAudience] = useState<CommunicationAudience>('All Students');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleUpdate = () => setMessages(getCommunications());
    handleUpdate();
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    sendCommunication(channel, audience, subject, body, user?.name || 'Root Admin');
    
    setSuccessMsg(`${channel} successfully sent to ${audience}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setSubject('');
    setBody('');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Communications</h2>
        <p className="text-sm text-gray-500">Send bulk emails, SMS, and dashboard alerts to students and admins.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Compose Section */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSend} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Compose Message</h3>

            {successMsg && (
              <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Channel</label>
                <div className="grid grid-cols-1 gap-2">
                  <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${channel === 'System Alert' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="channel" value="System Alert" checked={channel === 'System Alert'} onChange={(e) => setChannel(e.target.value as any)} className="hidden" />
                    <BellRing size={18} /> <span className="font-medium text-sm">System Alert (Dashboard)</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${channel === 'Email' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="channel" value="Email" checked={channel === 'Email'} onChange={(e) => setChannel(e.target.value as any)} className="hidden" />
                    <Mail size={18} /> <span className="font-medium text-sm">Email</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${channel === 'SMS' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="channel" value="SMS" checked={channel === 'SMS'} onChange={(e) => setChannel(e.target.value as any)} className="hidden" />
                    <MessageSquare size={18} /> <span className="font-medium text-sm">SMS (Mobile)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm font-medium text-gray-700 bg-white"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                >
                  <option value="All Students">All Registered Students</option>
                  <option value="Confirmed Students">Confirmed Students Only</option>
                  <option value="Pending Payment Students">Pending Payment Students Only</option>
                  <option value="Club Admins">All Club Admins</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">The message will be broadcast to this selected group.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject / Title</label>
                <input 
                  type="text" 
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none font-medium"
                  placeholder={channel === 'SMS' ? 'N/A for SMS' : 'Enter message subject'}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={channel === 'SMS'}
                  required={channel !== 'SMS'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message Body</label>
                <textarea 
                  className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none font-medium text-sm"
                  placeholder="Type your message here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">{body.length} characters</span>
                  {channel === 'SMS' && body.length > 160 && (
                    <span className="text-xs text-red-500 font-bold">Message exceeds 160 chars (multiple SMS will be charged).</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
              <Button type="submit" className="bg-accent-500 hover:bg-accent-600 text-white pl-5 pr-6">
                <Send className="w-4 h-4 mr-2" />
                Send Broadcast
              </Button>
            </div>
          </form>
        </div>

        {/* Sent History Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Sent History</h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[600px]">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages sent yet.</p>
                </div>
              ) : (
                [...messages].reverse().map(msg => (
                  <div key={msg.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        msg.channel === 'System Alert' ? 'bg-primary-100 text-primary-700' :
                        msg.channel === 'Email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {msg.channel}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(msg.sentAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short'})}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm mb-1">{msg.subject || 'No Subject'}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{msg.body}</p>
                    
                    <div className="pt-3 border-t border-gray-200/60 flex justify-between items-center text-xs text-gray-500">
                      <span>To: <strong>{msg.audience}</strong></span>
                      <span>By: {msg.sender}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
