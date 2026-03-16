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
        if (data && data.length > 0) {
          setBuses(data);
        }
      } catch (err) {
        console.error('Failed to fetch buses:', err);
        setError('Unable to load bus schedules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [open, buses.length]);

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
    <div className="relative " style={{ marginLeft: "320px" }} ref={popupRef}>
      {/* ── Bus Schedule Toggle Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="group flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-full shadow-[0_8px_15px_-3px_rgba(16,185,129,0.4)] transition-all duration-300 hover:shadow-[0_15px_25px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-1 outline-none focus:outline-none border border-green-400/30 overflow-hidden relative"
        title="Bus Schedule"
      >
        {/* Shine effect overlay */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] animate-[shine_3s_infinite_ease-in-out]"></span>

        <Bus className="w-5 h-5 group-hover:animate-bounce" />
        <span className="relative z-10 tracking-wide text-[15px]">Bus Schedule</span>
        <span className={`ml-1 transition-transform duration-300 relative z-10 ${open ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>▾</span>
      </button>

      {/* ── Popup Dropdown ── */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100"
          style={{ animation: 'fadeSlideDown 0.18s ease-out', marginLeft: "200px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 flex items-center justify-between">
            <div style={{ marginLeft: "200px" }} className="flex items-center gap-2">
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
          <div style={{ width: "500px" }} className="max-h-[500px] overflow-y-auto p-4 space-y-3">
            {loading && (
              <div className="flex flex-col items-center py-10 gap-2">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <p className="text-gray-400 text-xs">Fetching schedules…</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-700 text-xs font-medium">{error}</p>
              </div>
            )}

            {!loading && buses.length === 0 && (
              <div className="text-center py-8">
                <Bus className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">No buses found.</p>
              </div>
            )}

            {!loading && buses.map((bus, i) => (
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
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
}
