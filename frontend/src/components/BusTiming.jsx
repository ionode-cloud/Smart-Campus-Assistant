import React, { useState, useEffect } from 'react';
import { X, Bus, Clock, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { getAllBuses } from '../services/busService';

export function BusTiming({ onClose }) {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                setLoading(true);
                const data = await getAllBuses();
                setBuses(data);
            } catch (err) {
                setError('Unable to fetch bus data. Make sure the backend server is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Bus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">Bus Timing Schedule</h2>
                            <p className="text-green-100 text-xs">Live campus bus routes</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                            <p className="text-gray-500 text-sm">Fetching bus schedules...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-700 font-semibold text-sm">Connection Error</p>
                                <p className="text-red-600 text-xs mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && buses.length === 0 && (
                        <div className="text-center py-12">
                            <Bus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No buses found. Add buses via POST /api/buses</p>
                        </div>
                    )}

                    {!loading && !error && buses.length > 0 && (
                        <>
                            <p className="text-xs text-gray-500 mb-4 font-medium">
                                {buses.length} bus route{buses.length !== 1 ? 's' : ''} available
                            </p>
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Bus</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />From</span>
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />To</span>
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Departure</span>
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Arrival</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {buses.map((bus, index) => (
                                            <tr
                                                key={bus._id}
                                                className={`hover:bg-green-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{bus.busName}</p>
                                                        <p className="text-xs text-gray-400">{bus.busNumber}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{bus.startLocation}</td>
                                                <td className="px-4 py-3 text-gray-700">{bus.destination}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                        {bus.departureTime}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                        {bus.arrivalTime}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Stops detail */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-sm font-bold text-gray-700">Route Stops</h3>
                                {buses.map(bus => (
                                    bus.stops && bus.stops.length > 0 && (
                                        <div key={bus._id} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">{bus.busName}</p>
                                            <div className="flex flex-wrap items-center gap-1">
                                                {bus.stops.map((stop, i) => (
                                                    <React.Fragment key={i}>
                                                        <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">{stop}</span>
                                                        {i < bus.stops.length - 1 && <span className="text-gray-300 text-xs">→</span>}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Data from: <code className="bg-gray-100 px-1 rounded">GET /api/buses</code></p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
