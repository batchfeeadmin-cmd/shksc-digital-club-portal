import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Database, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getMasterStudents, saveMasterStudents, clearMasterStudents, type MasterStudent } from '../../services/students/masterStudentService';

const parseCSVLine = (line: string): string[] => {
  const cells: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && quoted && line[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }

  cells.push(cell.trim());
  return cells;
};

export function RootDataPage() {
  const [students, setStudents] = useState<MasterStudent[]>([]);
  const [csvText, setCsvText] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const handleUpdate = () => setStudents(getMasterStudents());
    handleUpdate();
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const handleImport = () => {
    try {
      const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        throw new Error('CSV must contain a header row and at least one data row.');
      }
      
      const headers = parseCSVLine(lines[0]).map(h => h.replace(/^\uFEFF/, '').trim().toLowerCase());
      
      const idIdx = headers.findIndex(h => h.includes('id'));
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const classIdx = headers.findIndex(h => h.includes('class'));
      const rollIdx = headers.findIndex(h => h.includes('roll'));
      const sectionIdx = headers.findIndex(h => h.includes('section'));

      if (idIdx === -1 || nameIdx === -1 || classIdx === -1) {
        throw new Error('CSV must contain "Student ID", "Name", and "Class" columns.');
      }

      const newStudents: MasterStudent[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length < 3 || !row[idIdx]) continue;

        newStudents.push({
          studentId: row[idIdx],
          name: row[nameIdx],
          class: row[classIdx],
          roll: rollIdx !== -1 ? row[rollIdx] : '',
          section: sectionIdx !== -1 ? row[sectionIdx] : ''
        });
      }

      if (newStudents.length === 0) {
        throw new Error('No valid student rows were found in the CSV content.');
      }

      const merged = new Map(students.map(student => [student.studentId.trim().toUpperCase(), student]));
      let added = 0;
      let updated = 0;
      newStudents.forEach(student => {
        const key = student.studentId.trim().toUpperCase();
        if (merged.has(key)) updated += 1;
        else added += 1;
        merged.set(key, { ...student, studentId: student.studentId.trim() });
      });

      saveMasterStudents(Array.from(merged.values()));
      setMessage({ type: 'success', text: `Import complete: ${added} added, ${updated} updated.` });
      setCsvText('');
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to parse CSV.' });
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire master student database? This cannot be undone.')) {
      clearMasterStudents();
      setMessage({ type: 'success', text: 'Master database cleared.' });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Data Management</h2>
        <p className="text-sm text-gray-500">Manage the master school student database to restrict registration.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Import Master Database</h3>
              <p className="text-sm text-gray-500">Upload CSV content</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
            <strong>CSV Format Required:</strong> The first row must be headers containing at least <code>Student ID, Name, Class</code>. Optional: <code>Roll, Section</code>.
          </div>

          <textarea
            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none font-mono text-sm mb-4"
            placeholder="Student ID, Name, Class, Roll&#10;SHKSC-2026-001, Arafat Rahman, 10, 12&#10;SHKSC-2026-002, Nusrat Jahan, 9, 45"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          ></textarea>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          <div className="mt-auto flex justify-end">
            <Button onClick={handleImport} disabled={!csvText.trim()}>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>

        {/* Database Status Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Database Status</h3>
              <p className="text-sm text-gray-500">Current master records</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="text-5xl font-extrabold text-primary-950 mb-2">
              {students.length}
            </div>
            <p className="text-gray-500 font-medium">Verified Students in Database</p>
            
            <div className="mt-8 text-center max-w-sm">
              {students.length > 0 ? (
                <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                  <CheckCircle2 className="inline w-4 h-4 mr-1 mb-0.5" />
                  <strong>Strict Registration is ON.</strong><br/>
                  Students must enter a valid Student ID from this database to register.
                </p>
              ) : (
                <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                  <AlertCircle className="inline w-4 h-4 mr-1 mb-0.5" />
                  <strong>Manual Registration is ON.</strong><br/>
                  The database is empty. Anyone can manually register and enter their details.
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Manage with caution</span>
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleClear} disabled={students.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Database
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
