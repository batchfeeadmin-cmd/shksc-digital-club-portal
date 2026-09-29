import React from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useRegistrationState } from '../hooks/useAdminData';
import { isRegistrationCurrentlyOpen } from '../services/clubs/clubService';

export function RegistrationStatus() {
  const { state: regState } = useRegistrationState();
  const registrationOpen = isRegistrationCurrentlyOpen(regState);

  const formattedDeadline = new Date(regState.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-30">
      <div className="moving-border bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold text-primary-950 mb-1">Club Registration {regState.year}</h3>
          <p className="text-gray-500 text-sm">{regState.message}</p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${registrationOpen ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</p>
              <p className={`font-semibold ${registrationOpen ? 'text-green-700' : 'text-gray-700'}`}>
                {registrationOpen ? 'OPEN' : 'CLOSED'}
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Deadline</p>
              <p className="font-semibold text-primary-950">{formattedDeadline}</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200"></div>

          <div>
            {registrationOpen ? (
              <Button asChild className="w-full md:w-auto shine">
                <Link to="/registration">
                  Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link to="/clubs">Explore Clubs</Link>
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
