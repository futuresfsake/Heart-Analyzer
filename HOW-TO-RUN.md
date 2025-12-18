# How to Run the Heart Rate Analyzer

This document explains how to set up and run the **Heart Rate Analyzer** React application, which includes signal smoothing, statistical analysis, Heart Rate Variability (HRV), **Fast Fourier Transform (FFT)**, and **dominant frequency analysis**.

---

## 1. Create a New React Project (Vite – Recommended)

Vite is used for faster builds and development.

```bash
npm create vite@latest heart-rate-analyzer -- --template react
cd heart-rate-analyzer
```

## 2. Install Required Dependencies

Install the libraries used for charts and UI icons:

```bash
npm install recharts lucide-react
```
Note:
FFT and dominant frequency calculations are implemented using native JavaScript
(no external DSP libraries are required).

## 3. Add the Application Code

Replace the contents of the following file with the provided project code:

```text
src/App.jsx
```

The application includes:

- Moving average smoothing (convolution)
- Statistical analysis (mean, variance)
- Heart Rate Variability (RMSSD)
- Fast Fourier Transform (FFT)
- Dominant frequency extraction
- Time-domain and frequency-domain visualizations

## 4. Run the Development Server

From the project root folder, start the development server:

```bash
npm run dev -- heart-rate-analyzer
```

## 5. View the Application

Open your browser and go to:

```text
http://localhost:5173
```

You should see:
- Raw vs. smoothed heart rate graphs
- Computed HRV metrics
- Frequency spectrum from FFT
- Highlighted dominant frequency component

## Troubleshooting

- Make sure you are inside the heart-rate-analyzer folder before running commands.
- If dependencies fail to install, try:

```bash
npm install
```
- Ensure you are using Node.js v18 or later.

## Summary

This application performs a complete heart rate signal analysis pipeline, combining:
- Time-domain smoothing and statistics
- HRV assessment using RMSSD
- Frequency-domain analysis using FFT
- Dominant frequency detection

The result is an interactive tool that transforms noisy heart rate data into meaningful physiological insights.
