import React, { useState, useEffect } from 'react';
import { Scale, RotateCcw, Plane } from 'lucide-react';

type AircraftType = 'C172' | 'C152' | 'P2008' | 'P2006T' | 'P2002JF';

interface Station {
  id: string;
  name: string;
  weight: number;
  arm: number;
}

const AIRCRAFT_DEFAULTS: Record<AircraftType, Station[]> = {
  C172: [
    { id: 'bew', name: 'Basic Empty Weight', weight: 1450, arm: 39.0 },
    { id: 'front', name: 'Pilot & Front Pax', weight: 170, arm: 37.0 },
    { id: 'rear', name: 'Rear Passengers', weight: 0, arm: 73.0 },
    { id: 'bag1', name: 'Baggage Area 1', weight: 0, arm: 95.0 },
    { id: 'bag2', name: 'Baggage Area 2', weight: 0, arm: 123.0 },
    { id: 'fuel', name: 'Fuel (Standard)', weight: 30 * 6, arm: 48.0 },
  ],
  C152: [
    { id: 'bew', name: 'Basic Empty Weight', weight: 1100, arm: 30.0 }, // Approx arm
    { id: 'front', name: 'Pilot & Pax', weight: 170, arm: 39.0 },
    { id: 'bag1', name: 'Baggage Area 1', weight: 0, arm: 64.0 },
    { id: 'bag2', name: 'Baggage Area 2', weight: 0, arm: 84.0 },
    { id: 'fuel', name: 'Fuel', weight: 24 * 6, arm: 42.0 },
  ],
  P2008: [
    { id: 'bew', name: 'Basic Empty Weight', weight: 800, arm: 10.0 }, // Datum: Prop flange
    { id: 'front', name: 'Pilot & Pax', weight: 170, arm: 20.6 },
    { id: 'bag', name: 'Baggage', weight: 0, arm: 39.4 },
    { id: 'fuel', name: 'Fuel', weight: 25 * 6, arm: 21.3 },
  ],
  P2006T: [
    { id: 'bew', name: 'Basic Empty Weight', weight: 1800, arm: 11.0 }, // Datum: Prop flange
    { id: 'front', name: 'Pilot & Co-Pilot', weight: 340, arm: 26.2 },
    { id: 'rear', name: 'Rear Passengers', weight: 0, arm: 59.9 },
    { id: 'bag', name: 'Baggage', weight: 0, arm: 82.9 },
    { id: 'fuel', name: 'Fuel', weight: 50 * 6, arm: 26.2 },
  ],
  P2002JF: [
    { id: 'bew', name: 'Basic Empty Weight', weight: 840, arm: 15.0 }, // Datum: Leading Edge
    { id: 'front', name: 'Pilot & Pax', weight: 170, arm: 23.6 },
    { id: 'bag', name: 'Baggage', weight: 0, arm: 35.4 },
    { id: 'fuel', name: 'Fuel', weight: 26 * 6, arm: 23.6 },
  ]
};

export const WeightBalanceView: React.FC = () => {
  const [activeAircraft, setActiveAircraft] = useState<AircraftType>('C172');
  const [stations, setStations] = useState<Station[]>(AIRCRAFT_DEFAULTS['C172']);

  useEffect(() => {
    // Reset to defaults when aircraft changes, deep copy to avoid reference issues
    setStations(JSON.parse(JSON.stringify(AIRCRAFT_DEFAULTS[activeAircraft])));
  }, [activeAircraft]);

  const updateStation = (id: string, field: 'weight' | 'arm', value: string) => {
    const numValue = parseFloat(value) || 0;
    setStations(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: numValue } : s
    ));
  };

  const calculateTotalWeight = () => stations.reduce((acc, s) => acc + s.weight, 0);
  const calculateTotalMoment = () => stations.reduce((acc, s) => acc + (s.weight * s.arm), 0);
  
  const totalWeight = calculateTotalWeight();
  const totalMoment = calculateTotalMoment();
  const cg = totalWeight > 0 ? (totalMoment / totalWeight).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
             Weight & Balance
           </h2>
           <p className="text-xs text-slate-500 dark:text-slate-400">Calculate CG and Moments</p>
        </div>
        <button 
          onClick={() => setStations(JSON.parse(JSON.stringify(AIRCRAFT_DEFAULTS[activeAircraft])))}
          className="p-2 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Aircraft Selector - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {(['C172', 'C152', 'P2008', 'P2006T', 'P2002JF'] as AircraftType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveAircraft(type)}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap border ${
                activeAircraft === type 
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Stations Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
           <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Station</div>
              <div className="col-span-2 text-center">Wgt</div>
              <div className="col-span-2 text-center">Arm</div>
              <div className="col-span-3 text-right">Mom</div>
           </div>
           
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
             {stations.map((station) => (
               <div key={station.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-5 text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {station.name}
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      value={station.weight || ''} 
                      onChange={(e) => updateStation(station.id, 'weight', e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-1 text-center text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      value={station.arm || ''} 
                      onChange={(e) => updateStation(station.id, 'arm', e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 rounded-none p-1 text-center text-xs text-slate-500 dark:text-slate-500 focus:border-sky-500 outline-none"
                    />
                  </div>
                  <div className="col-span-3 text-right text-sm font-mono text-slate-600 dark:text-slate-400">
                    {(station.weight * station.arm).toLocaleString('en-US', {maximumFractionDigits: 0})}
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Plane size={120} />
           </div>
           
           <div className="grid grid-cols-2 gap-8 relative z-10">
              <div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Gross Weight</div>
                <div className="text-3xl font-black text-sky-400">{totalWeight.toLocaleString()} <span className="text-sm font-normal text-slate-500">lbs</span></div>
              </div>
              <div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Moment</div>
                <div className="text-2xl font-bold text-white">{totalMoment.toLocaleString()}</div>
              </div>
           </div>

           <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
              <div className="flex justify-between items-end">
                 <div>
                   <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Center of Gravity</div>
                   <div className="text-5xl font-black text-white">{cg}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-sky-500 text-xs font-bold uppercase border border-sky-500 px-2 py-1 rounded">
                       Check POH Limits
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};