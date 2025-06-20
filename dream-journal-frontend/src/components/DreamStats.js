import { Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const emotionOptions = [
  'joy', 'fear', 'anger', 'sadness', 'surprise',
  'excitement', 'peace', 'confusion', 'love', 'anxiety', 'freedom'
];

const DreamStats = ({ stats, dreams }) => {
  // Count emotions from dreams
  const emotionCounts = {};
  emotionOptions.forEach(e => { emotionCounts[e] = 0; });
  if (dreams && dreams.length > 0) {
    dreams.forEach(dream => {
      (dream.emotions || []).forEach(emotion => {
        if (emotionCounts[emotion] !== undefined) {
          emotionCounts[emotion] += 1;
        }
      });
    });
  }
  const filteredEmotions = emotionOptions.filter(e => emotionCounts[e] > 0);
  const emotionData = {
    labels: filteredEmotions.length > 0 ? filteredEmotions : ['No Data'],
    datasets: [
      {
        data: filteredEmotions.length > 0 ? filteredEmotions.map(e => emotionCounts[e]) : [1],
        backgroundColor: [
          '#4CAF50', '#F44336', '#FF9800', '#2196F3', '#9E9E9E',
          '#BA68C8', '#FFD600', '#00B8D4', '#FF4081', '#8D6E63', '#00C853'
        ].slice(0, filteredEmotions.length > 0 ? filteredEmotions.length : 1),
      },
    ],
  };

  return (
    <div>
      <Typography variant="body1">
        Total Dreams: {stats.totalDreams || 0}
      </Typography>
      <Typography variant="body1">
        Average Rating: {stats.avgRating || 0}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Lucid Dreams: {stats.lucidPercentage || 0}%
      </Typography>
      <div style={{ height: '300px' }}>
        <Doughnut data={emotionData} />
      </div>
    </div>
  );
};

export default DreamStats;