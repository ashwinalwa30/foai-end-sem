import React from 'react';
import { Compass, Gauge, MapPin, Users, Activity } from 'lucide-react';
import useStore from '../../store/useStore';

const StatCard = ({ icon: Icon, title, value, subValue, colorClass }) => (
  <div className="p-6 glass dark:glass-dark rounded-2xl border border-white/10 dark:border-white/5 flex items-start gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-white">{value}</h3>
      {subValue && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subValue}</p>}
    </div>
  </div>
);

const IssStats = () => {
  const { issPosition, issHistory, speedHistory, currentLocationName, totalAstronauts, astronauts } = useStore();
  
  const currentSpeed = speedHistory.length > 0 
    ? speedHistory[speedHistory.length - 1].speed.toFixed(2) 
    : '0.00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        icon={MapPin}
        title="Current Coordinates"
        value={`${issPosition.latitude.toFixed(2)}°, ${issPosition.longitude.toFixed(2)}°`}
        subValue={currentLocationName}
        colorClass="bg-indigo-500 shadow-indigo-500/20 shadow-lg"
      />
      <StatCard 
        icon={Gauge}
        title="Current Speed"
        value={`${currentSpeed} km/h`}
        subValue={`Avg: ${(speedHistory.reduce((acc, curr) => acc + curr.speed, 0) / (speedHistory.length || 1)).toFixed(2)} km/h`}
        colorClass="bg-emerald-500 shadow-emerald-500/20 shadow-lg"
      />
      <StatCard 
        icon={Activity}
        title="Positions Tracked"
        value={issHistory.length}
        subValue="Last 15 minutes trajectory"
        colorClass="bg-amber-500 shadow-amber-500/20 shadow-lg"
      />
      <StatCard 
        icon={Users}
        title="People in Space"
        value={totalAstronauts}
        subValue={astronauts.map(a => a.name).slice(0, 2).join(', ') + '...'}
        colorClass="bg-purple-500 shadow-purple-500/20 shadow-lg"
      />
    </div>
  );
};

export default IssStats;
