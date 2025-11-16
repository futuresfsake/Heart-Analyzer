import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Upload, Heart, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import './App.css';
interface HeartRateData {
  index: number;
  time: string;
  heartRate: number;
}

interface Analysis {
  mean: string;
  min: string;
  max: string;
  stdDev: string;
  rmssd: string;
  range: string;
  trend: string;
  anomalies: number;
  interpretation: string[];
  movingAvg: (HeartRateData & { smoothed: number })[];
}

export default function HeartRateAnalyzer() {
  const [data, setData] = useState<HeartRateData[] | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (text: string): HeartRateData[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
    
    // Find relevant columns
    const timeCol = headers.findIndex((h: string) => h.includes('time') || h.includes('timestamp') || h.includes('date'));
    const hrCol = headers.findIndex((h: string) => h.includes('heart') || h.includes('hr') || h.includes('bpm') || h.includes('rate'));
    
    if (hrCol === -1) {
      throw new Error('Could not find heart rate column. Expected column names like "heart_rate", "hr", "bpm", or "rate"');
    }

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length > hrCol) {
        const hr = parseFloat(values[hrCol]);
        if (!isNaN(hr)) {
          parsed.push({
            index: i - 1,
            time: timeCol !== -1 ? values[timeCol].trim() : `${i - 1}`,
            heartRate: hr
          });
        }
      }
    }
    
    if (parsed.length === 0) {
      throw new Error('No valid heart rate data found in CSV');
    }
    
    return parsed;
  };

  const analyzeData = (data: HeartRateData[]): Analysis => {
    const hrs = data.map((d: HeartRateData) => d.heartRate);
    const n = hrs.length;
    
    // Basic statistics
    const mean = hrs.reduce((a: number, b: number) => a + b, 0) / n;
    const min = Math.min(...hrs);
    const max = Math.max(...hrs);
    const range = max - min;
    
    // Standard deviation
    const variance = hrs.reduce((sum: number, hr: number) => sum + Math.pow(hr - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Moving average (convolution with uniform kernel)
    const windowSize = Math.min(10, Math.floor(n / 5));
    const movingAvg: number[] = [];
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(n, i + Math.ceil(windowSize / 2));
      const window = hrs.slice(start, end);
      movingAvg.push(window.reduce((a: number, b: number) => a + b, 0) / window.length);
    }
    
    // Heart Rate Variability (RMSSD approximation)
    let sumSquaredDiffs = 0;
    for (let i = 1; i < n; i++) {
      sumSquaredDiffs += Math.pow(hrs[i] - hrs[i - 1], 2);
    }
    const rmssd = Math.sqrt(sumSquaredDiffs / (n - 1));
    
    // Detect anomalies (values beyond 2 std devs)
    const anomalies = data.filter((d: HeartRateData) => 
      Math.abs(d.heartRate - mean) > 2 * stdDev
    );
    
    // Trend detection
    let trend = 'stable';
    const firstHalf = movingAvg.slice(0, Math.floor(n / 2));
    const secondHalf = movingAvg.slice(Math.floor(n / 2));
    const firstAvg = firstHalf.reduce((a: number, b: number) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a: number, b: number) => a + b, 0) / secondHalf.length;
    const trendDiff = secondAvg - firstAvg;
    
    if (trendDiff > 5) trend = 'increasing';
    else if (trendDiff < -5) trend = 'decreasing';
    
    // Interpretation
    let interpretation: string[] = [];
    
    if (mean >= 60 && mean <= 100) {
      interpretation.push('Average heart rate is within normal resting range (60-100 bpm)');
    } else if (mean < 60) {
      interpretation.push('Average heart rate suggests bradycardia (below 60 bpm) - possibly athletic or needs medical attention');
    } else {
      interpretation.push('Average heart rate is elevated (above 100 bpm) - could indicate tachycardia, exercise, or stress');
    }
    
    if (rmssd < 20) {
      interpretation.push('Low heart rate variability detected - may indicate stress or fatigue');
    } else if (rmssd > 50) {
      interpretation.push('High heart rate variability - generally indicates good cardiovascular health');
    } else {
      interpretation.push('Moderate heart rate variability - within normal range');
    }
    
    if (range > 50) {
      interpretation.push(`Large variation in heart rate (${range.toFixed(0)} bpm range) - suggests periods of activity and rest`);
    }
    
    if (trend === 'increasing') {
      interpretation.push('Heart rate shows an increasing trend over time');
    } else if (trend === 'decreasing') {
      interpretation.push('Heart rate shows a decreasing trend over time');
    }
    
    if (anomalies.length > 0) {
      interpretation.push(`${anomalies.length} anomalous readings detected that deviate significantly from the average`);
    }
    
    return {
      mean: mean.toFixed(1),
      min: min.toFixed(0),
      max: max.toFixed(0),
      stdDev: stdDev.toFixed(1),
      rmssd: rmssd.toFixed(1),
      range: range.toFixed(0),
      trend,
      anomalies: anomalies.length,
      interpretation,
      movingAvg: data.map((d: HeartRateData, i: number) => ({ ...d, smoothed: movingAvg[i] }))
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result === 'string') {
          const parsed = parseCSV(event.target.result);
          const analyzed = analyzeData(parsed);
          setData(parsed);
          setAnalysis(analyzed);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
        setAnalysis(null);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-800">Heart Rate Analyzer</h1>
          </div>
          <p className="text-gray-600">Upload CSV data for time-series analysis and interpretation</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-red-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-lg font-medium text-gray-700 mb-1">Upload Heart Rate CSV</span>
            <span className="text-sm text-gray-500">CSV should have columns for time and heart rate/bpm</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        {analysis && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Average HR</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{analysis.mean}</div>
                <div className="text-xs text-gray-500">bpm</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Range</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{analysis.range}</div>
                <div className="text-xs text-gray-500">{analysis.min} - {analysis.max} bpm</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">HRV (RMSSD)</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{analysis.rmssd}</div>
                <div className="text-xs text-gray-500">ms (approx)</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Trend</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 capitalize">{analysis.trend}</div>
                <div className="text-xs text-gray-500">{analysis.anomalies} anomalies</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Heart Rate Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analysis.movingAvg}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" label={{ value: 'Time Point', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Heart Rate (bpm)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fill="#fecaca" name="Raw HR" />
                  <Line type="monotone" dataKey="smoothed" stroke="#dc2626" strokeWidth={2} dot={false} name="Smoothed (Moving Avg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis & Interpretation</h2>
              <div className="space-y-3">
                {analysis.interpretation.map((text: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This analysis uses signal processing techniques including moving average convolution 
                  for smoothing and statistical measures for pattern detection. Results are for informational purposes only 
                  and should not replace professional medical advice.
                </p>
              </div>
            </div>
          </>
        )}

        {!data && !error && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Yet</h3>
            <p className="text-gray-500">Upload a CSV file to see heart rate analysis</p>
            <div className="mt-6 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">Expected CSV format:</p>
              <code className="block bg-gray-100 p-3 rounded text-xs">
                time,heart_rate<br/>
                0,72<br/>
                1,75<br/>
                2,73<br/>
                ...
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}