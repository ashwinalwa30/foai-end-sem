import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useStore from '../../store/useStore';
import { ChartSkeleton } from '../UI/Skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const SpeedChart = () => {
  const { speedHistory, isDarkMode } = useStore();

  if (speedHistory.length < 2) {
    return (
      <div className="glass dark:glass-dark p-6 rounded-2xl h-80 flex flex-col justify-center items-center text-slate-400">
        <p>Waiting for more data points...</p>
        <ChartSkeleton />
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        titleColor: isDarkMode ? '#f8fafc' : '#1e293b',
        bodyColor: isDarkMode ? '#f8fafc' : '#1e293b',
        borderColor: '#6366f1',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: speedHistory.map(h => new Date(h.timestamp * 1000).toLocaleTimeString()),
    datasets: [
      {
        fill: true,
        label: 'Speed (km/h)',
        data: speedHistory.map(h => h.speed),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/10 h-80">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          ISS Real-time Speed
        </h3>
        <span className="text-xs font-medium text-slate-400">km/h over time</span>
      </div>
      <div className="h-56">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default SpeedChart;
