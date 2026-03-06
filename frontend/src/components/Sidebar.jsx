import React, { useEffect, useRef, useState } from 'react';
import { School, ChevronLeft, ChevronRight, MapPin, Clock, Building2, Volume2, VolumeX } from 'lucide-react';

export function Sidebar({
  locations,
  selectedLocation,
  onLocationSelect,
  collapsed,
  onToggleCollapse
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const autoSpeakRef = useRef(true);
  const synthRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Function to speak the location details
  const speakLocationDetails = () => {
    if (!selectedLocation) return;

    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Build the text to speak
    let textToSpeak = `You have selected ${selectedLocation.name}. `;
    textToSpeak += `${selectedLocation.description}. `;
    
    if (selectedLocation.departments && selectedLocation.departments.length > 0) {
      textToSpeak += `It houses departments of ${selectedLocation.departments.join(', ')}. `;
    }
    
    if (selectedLocation.timings) {
      textToSpeak += `The timings are ${selectedLocation.timings}. `;
    }

    textToSpeak += `This is a ${selectedLocation.type} location.`;

    console.log('Speaking:', textToSpeak);

    // Use speech synthesis
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get a working voice
    if (voices.length > 0) {
      const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      utterance.voice = englishVoice;
      console.log('Using voice:', englishVoice?.name || 'default');
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
    };

    // Speak the text
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  // Auto-speak when location is selected
  useEffect(() => {
    if (selectedLocation && autoSpeakRef.current) {
      const timer = setTimeout(() => {
        speakLocationDetails();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedLocation, voices]);

  // Stop speaking when location changes
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [selectedLocation]);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  return (
    <aside
      className={`bg-white shadow-xl transition-all duration-300 flex-shrink-0 relative ${
        collapsed ? 'w-0' : 'w-80'
      }`}
    >
      <button
        onClick={onToggleCollapse}
        className={`absolute ${collapsed ? '-right-12' : '-right-4'} top-6 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all`}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div className={`h-full overflow-y-auto p-6 rounded-r-3xl ${collapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-100 p-3 rounded-xl">
            <School className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Campus Assistant</h1>
            <p className="text-sm text-gray-500">Smart Navigation</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Navigate to
          </label>
          <select
            onChange={(e) => onLocationSelect(e.target.value)}
            value={selectedLocation?.id || ''}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white cursor-pointer"
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Location Details
            {selectedLocation && (
              <button
                onClick={isSpeaking ? stopSpeaking : speakLocationDetails}
                className={`ml-auto p-2 rounded-full transition-colors ${
                  isSpeaking 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            )}
          </h2>

          {selectedLocation ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {selectedLocation.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedLocation.description}
                </p>
              </div>

              {selectedLocation.departments && selectedLocation.departments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm text-gray-700">Departments</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.departments.map((dept, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedLocation.timings && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h4 className="font-semibold text-sm text-gray-700">Timings</h4>
                  </div>
                  <p className="text-gray-600 text-sm bg-white rounded-lg px-3 py-2">
                    {selectedLocation.timings}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                  {selectedLocation.type}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">
                Select a building or search to view details here
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-50 rounded-2xl p-4">
          <h3 className="font-bold text-sm text-gray-800 mb-3">Map Legend</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-600"></div>
              <span className="text-gray-700">Selected Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 bg-opacity-50 rounded border-2 border-yellow-500"></div>
              <span className="text-gray-700">Hover to Explore</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Location Marker</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
