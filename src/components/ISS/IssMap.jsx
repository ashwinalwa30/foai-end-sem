import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import useStore from '../../store/useStore';

// Fix for default marker icons in Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom ISS Icon
const issIcon = L.divIcon({
  html: `<div class="bg-indigo-600 p-2 rounded-full border-2 border-white shadow-lg animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>
         </div>`,
  className: 'custom-div-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const IssMap = () => {
  const { issPosition, issHistory, isDarkMode } = useStore();
  const center = [issPosition.latitude || 0, issPosition.longitude || 0];
  
  const pathPositions = issHistory.map(pos => [pos.latitude, pos.longitude]);

  return (
    <div className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      <MapContainer 
        center={center} 
        zoom={3} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={isDarkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <ChangeView center={center} />
        
        {pathPositions.length > 1 && (
          <Polyline 
            positions={pathPositions} 
            color="#6366f1" 
            weight={3} 
            dashArray="5, 10"
          />
        )}

        <Marker position={center} icon={issIcon}>
          <Tooltip permanent direction="top" offset={[0, -20]} className="glass-tooltip">
            <div className="font-bold text-indigo-600">ISS Position</div>
            <div className="text-xs text-slate-500">{issPosition.latitude.toFixed(4)}, {issPosition.longitude.toFixed(4)}</div>
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default IssMap;
