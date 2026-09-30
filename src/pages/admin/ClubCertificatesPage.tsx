import React, { useState, useEffect, useRef } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Award, Plus, Search, Trash2, Printer, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getCertificatesByClub, issueCertificate, deleteCertificate, CertificateRecord } from '../../services/certificates/certificateService';
import { getStudentsByClub } from '../../services/students/studentService';
import { getEventsByClub } from '../../services/events/eventService';
import { useClubsData } from '../../hooks/useAdminData';
import { Student } from '../../types';
import { CertificateTemplate } from '../../components/admin/CertificateTemplate';

export function ClubCertificatesPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const club = clubs.find(c => c.id === user?.clubId);
  
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [eventName, setEventName] = useState('');
  
  // Print State
  const [printingCert, setPrintingCert] = useState<CertificateRecord | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    if (user?.clubId) {
      setCertificates(getCertificatesByClub(user.clubId).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()));
      setStudents(getStudentsByClub(user.clubId).filter(s => s.registrationStatus === 'Confirmed'));
      
      // Get unique event names from the event service to populate datalist
      const clubEvents = getEventsByClub(user.clubId);
      setEvents(Array.from(new Set(clubEvents.map(e => e.title))));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('shksc_state_changed', loadData);
    return () => window.removeEventListener('shksc_state_changed', loadData);
  }, [user]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.includes(searchTerm)
  );

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clubId || !selectedStudentId || !eventName) return;

    issueCertificate(user.clubId, selectedStudentId, eventName);
    
    setSelectedStudentId('');
    setEventName('');
    setSearchTerm('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to revoke and delete this certificate record?')) {
      deleteCertificate(id);
    }
  };

  const handlePrint = (cert: CertificateRecord) => {
    setPrintingCert(cert);
    setTimeout(() => {
      window.print();
      setPrintingCert(null);
    }, 500);
  };

  // If we are currently printing, hide the rest of the app and only show the certificate
  if (printingCert && club) {
    const student = students.find(s => s.id === printingCert.studentId);
    if (!student) return null;
    
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center print:block print:w-full print:h-full">
        <style>
          {`
            @media print {
              @page { size: landscape; margin: 0; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}
        </style>
        <CertificateTemplate 
          studentName={student.name}
          eventName={printingCert.eventName}
          clubName={club.name}
          issueDate={printingCert.issueDate}
          certificateId={printingCert.id}
        />
      </div>
    );
  }

  return (
    <ClubAdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Certificates</h2>
          <p className="text-sm text-gray-500">Issue digital certificates for events and workshops.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-primary-950 hover:bg-primary-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> Issue Certificate
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Issue New Certificate</h3>
          
          <form onSubmit={handleIssueCertificate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Student</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:border-primary-500 outline-none"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <label key={student.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                        <input 
                          type="radio" 
                          name="student"
                          value={student.id}
                          checked={selectedStudentId === student.id}
                          onChange={() => setSelectedStudentId(student.id)}
                          className="text-primary-600"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.studentId} • Class {student.class}</p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No confirmed students found</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event / Achievement Name</label>
                <input 
                  type="text" 
                  value={eventName} 
                  onChange={e => setEventName(e.target.value)} 
                  placeholder="e.g. Science Fair 2026 Participation" 
                  className="w-full h-10 px-4 rounded-lg border border-gray-200 focus:border-primary-500 outline-none mb-2" 
                  list="event-suggestions"
                  required 
                />
                <datalist id="event-suggestions">
                  {events.map(e => <option key={e} value={e} />)}
                </datalist>
                <p className="text-xs text-gray-500">This will be printed on the certificate as the reason for issuance.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" disabled={!selectedStudentId || !eventName} className="bg-primary-950 hover:bg-primary-900 text-white">Issue Certificate</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length === 0 && !showAddForm ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No certificates issued yet.</p>
          </div>
        ) : (
          certificates.map(cert => {
            const student = students.find(s => s.id === cert.studentId);
            return (
              <div key={cert.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative">
                <div className="absolute top-4 right-4 flex gap-1">
                  <button onClick={() => handlePrint(cert)} className="text-gray-400 hover:text-accent-600 transition-colors p-1.5 rounded-md hover:bg-accent-50" title="Print / Save PDF">
                    <Printer size={16} />
                  </button>
                  <button onClick={() => handleDelete(cert.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50" title="Revoke">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4 pr-16">
                  <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{student?.name || 'Unknown Student'}</h3>
                    <p className="text-xs text-gray-500">{student?.studentId || '—'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                  <p className="font-semibold text-gray-800 line-clamp-2">{cert.eventName}</p>
                  <p className="text-xs text-gray-500 mt-1">Issued: {new Date(cert.issueDate).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ClubAdminLayout>
  );
}
