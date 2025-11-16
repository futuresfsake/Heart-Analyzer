const windowSize = Math.min(10, Math.floor(n / 5));
const movingAvg: number[] = [];
for (let i = 0; i < n; i++) {
  const start = Math.max(0, i - Math.floor(windowSize / 2));
  const end = Math.min(n, i + Math.ceil(windowSize / 2));
  const window = hrs.slice(start, end);
  movingAvg.push(window.reduce((a: number, b: number) => a + b, 0) / window.length);
}


* what this code does, creates a sliding window od size
WindowSize (up to 10 points)

* for each data point, it takes the average of values iwthin the window

Input signal = hrs (heart rate data)'
Output signal = movingAvg (smoothed data)

Operation: y[i] = (1/N) * Σ x[i-k to i+k] where N = window size

Sum Operations used in analysis
const mean = hrs.reduce((a: number, b: number) => a + b, 0) / n;

Sums all heart rate values and divides by count

const variance = hrs.reduce((sum: number, hr: number) => sum + Math.pow(hr - mean, 2), 0) / n;

Sums squared deviations from mean

let sumSquaredDiffs = 0;
for (let i = 1; i < n; i++) {
  sumSquaredDiffs += Math.pow(hrs[i] - hrs[i - 1], 2);
}
const rmssd = Math.sqrt(sumSquaredDiffs / (n - 1));


Sums squared differences between consecutive beats
Takes square root for Root Me


movingAvg.push(window.reduce((a: number, b: number) => a + b, 0) / window.length);
```
- Sums values in the current window and divides by window size

---

## **Mathematical Representation**

**Moving Average Convolution:**
```
y[n] = (1/M) * Σ(k=0 to M-1) x[n - k + M/2]


y[n] = smoothed output
x[n] = input signal (heart rate)
M = window size
This is a finite impulse response (FIR) filter


