import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ClubCard } from '../components/ClubCard';
import { ClubCategory } from '../types';
import { useClubsData } from '../hooks/useAdminData';

const CATEGORIES: ('All' | ClubCategory)[] = ['All', 'Academic', 'Sports', 'Arts & Culture', 'Technology', 'Community Service', 'General'];

export function ClubsPage() {
  const { clubs } = useClubsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ClubCategory>('All');
  const [sortBy, setSortBy] = useState<'name' | 'members'>('name');

  const filteredClubs = useMemo(() => {
    let result = [...clubs];

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(club => 
        club.name.toLowerCase().includes(lowerQuery) || 
        club.shortDescription.toLowerCase().includes(lowerQuery)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(club => club.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'members') {
      result.sort((a, b) => b.memberCount - a.memberCount);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="pt-24 pb-20 bg-surface-sec min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-primary-950 rounded-3xl p-8 md:p-12 text-center mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600 rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Explore Our Clubs
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Discover your interests and find the perfect community to grow your skills.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clubs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow shadow-sm"
            />
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Sort */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 h-12 rounded-xl shadow-sm">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'members')}
                className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 w-full"
              >
                <option value="name">Sort by A-Z</option>
                <option value="members">Sort by Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-primary-900 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Club Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

      </div>
    </div>
  );
}
