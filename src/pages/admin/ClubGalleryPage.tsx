import React from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { GalleryForm } from '../../components/admin/GalleryForm';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { Image as ImageIcon } from 'lucide-react';

export function ClubGalleryPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const club = clubs.find(c => c.id === user?.clubId);

  const images = club?.gallery ?? [];

  return (
    <ClubAdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Gallery</h2>
        <p className="text-sm text-gray-500">
          {club?.name || 'Your club'} — new photos go live after Root Admin approval.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Live gallery */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-lg text-primary-950 mb-4 flex items-center gap-2">
            <ImageIcon size={20} className="text-accent-500" /> Live Gallery ({images.length})
          </h3>
          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((image, i) => (
                <div key={`${image}-${i}`} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                  <img src={image} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bangla text-sm text-gray-400 py-6 text-center">
              এখনো কোনো ছবি নেই — নিচে থেকে নতুন ছবি submit করো।
            </p>
          )}
        </div>

        <GalleryForm clubId={user?.clubId || ''} clubName={club?.name || 'Your Club'} />
      </div>
    </ClubAdminLayout>
  );
}
