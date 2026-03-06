import React, { useState, useEffect, useRef } from 'react';
import { Bus, Clock, MapPin, X, AlertCircle, Loader2 } from 'lucide-react';
import { getAllBuses } from '../services/busService';

export function SearchBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);

  // Fetch buses when popup opens for the first time
  useEffect(() => {
    if (!open || buses.length > 0) return;
    const fetchBuses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBuses();
        setBuses(data);
      } catch {
        setError('Could not load bus data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [open]);

  // Close popup when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative " ref={popupRef}>
      {/* ── Bus Schedule Toggle Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl outline-none focus:outline-none"
        title="Bus Schedule"
      >
        <Bus className="w-4 h-4" />
        Bus Schedule
        <span className={`ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* ── Popup Dropdown ── */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100"
          style={{ animation: 'fadeSlideDown 0.18s ease-out' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">Bus Schedule</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="bg-white/20 hover:bg-white/35 text-white rounded-full p-1 transition-colors outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
            {loading && (
              <div className="flex flex-col items-center py-10 gap-2">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <p className="text-gray-400 text-xs">Fetching schedules…</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            {!loading && !error && buses.length === 0 && (
              <div className="text-center py-8">
                <Bus className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">No buses found.</p>
              </div>
            )}

            {!loading && !error && buses.map((bus, i) => (
              <div
                key={bus._id || i}
                className="bg-gray-50 hover:bg-green-50 rounded-xl p-3 transition-colors border border-transparent hover:border-green-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{bus.busName}</p>
                    <p className="text-xs text-gray-400">{bus.busNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                      <Clock className="w-3 h-3" />{bus.departureTime}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                      <Clock className="w-3 h-3" />{bus.arrivalTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-green-500" />
                  <span>{bus.startLocation}</span>
                  <span className="text-gray-300 mx-1">→</span>
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{bus.destination}</span>
                </div>
                {bus.stops && bus.stops.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {bus.stops.map((stop, j) => (
                      <span key={j} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-500">
                        {stop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
