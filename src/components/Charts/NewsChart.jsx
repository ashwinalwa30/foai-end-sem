import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import useStore from '../../store/useStore';

ChartJS.register(ArcElement, Tooltip, Legend);

const NewsChart = () => {
  const { newsArticles, isDarkMode } = useStore();

  const sourceCounts = newsArticles.reduce((acc, article) => {
    const source = article.source.name;
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(sourceCounts),
    datasets: [
      {
        data: Object.values(sourceCounts),
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#f43f5e',
          '#f59e0b',
          '#10b981',
          '#3b82f6',
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#94a3b8' : '#64748b',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        titleColor: isDarkMode ? '#f8fafc' : '#1e293b',
        bodyColor: isDarkMode ? '#f8fafc' : '#1e293b',
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/10 h-80">
      <h3 className="font-bold text-slate-800 dark:text-white mb-6">Article Distribution</h3>
      <div className="h-56">
        {newsArticles.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            No article data available
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsChart;
