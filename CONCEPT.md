# Signal Processing Concepts

## 1. Moving Average (Smoothing)

This algorithm creates a **sliding window** to smooth out noise in the heart rate data, making the underlying trend visible. It acts as a **low-pass filter**, removing high-frequency jitters.

### Code Implementation (TypeScript)

```ts
const windowSize = Math.min(10, Math.floor(n / 5)); // Window size (up to 10 points)
const movingAvg: number[] = [];

for (let i = 0; i < n; i++) {
  // Define the window boundaries relative to current index 'i'
  const start = Math.max(0, i - Math.floor(windowSize / 2));
  const end = Math.min(n, i + Math.ceil(windowSize / 2));
  
  // Extract values within the window
  const window = hrs.slice(start, end);
  
  // Calculate average of the window
  movingAvg.push(
    window.reduce((a: number, b: number) => a + b, 0) / window.length
  );
}
```

### How It Works

- Input: hrs (raw heart rate data)
- Output: movingAvg (smoothed data)
- Logic: For every data point, the algorithm looks at its neighboring values (defined by windowSize), sums them, and computes their average. This replaces the raw value with a local average, reducing noise.

### Mathematical Representation (Convolution)

This operation is a Finite Impulse Response (FIR) filter:

$$
y[n] = \frac{1}{M} \sum_{k=0}^{M-1} x\left[n - k + \frac{M}{2}\right]
$$

Where:
- 𝑦[𝑛] = smoothed output signal at index n
- 𝑥[𝑛] = raw input signal (heart rate)
- 𝑀 = window size (number of points averaged)

## 2. Summation Operations (Statistical Analysis)

The analysis relies heavily on summation (Σ) to calculate statistical properties of the signal.

### A. Arithmetic Mean (Average)

Sums all heart rate values and divides by the total count.

**Code (TypeScript)**

```ts
const mean = hrs.reduce((a: number, b: number) => a + b, 0) / n;
```

**Formula:**

$$
μ=N1​i=1∑N​xi​
$$

### B. Variance (Spread)

Sums the squared deviations from the mean to measure how spread out the data is.

**Code (TypeScript)**

```ts
const variance =
  hrs.reduce((sum: number, hr: number) => sum + Math.pow(hr - mean, 2), 0) / n;
```

**Formula:**

$$
σ2=N1​i=1∑N​(xi​−μ)2​
$$

### C. RMSSD (Root Mean Square of Successive Differences)

Sums the squared differences between consecutive beats. This is the standard measure for Heart Rate Variability (HRV).

**Code (TypeScript)**

```ts
let sumSquaredDiffs = 0;

for (let i = 1; i < n; i++) {
  sumSquaredDiffs += Math.pow(hrs[i] - hrs[i - 1], 2);
}

const rmssd = Math.sqrt(sumSquaredDiffs / (n - 1));
```

**Formula:**

$$
\text{RMSSD} =
\sqrt{
\frac{1}{N - 1}
\sum_{i=1}^{N-1}
\left( x_{i+1} - x_i \right)^2
}​
$$

### D. Window Sum (Smoothing Step)

Sums values in the current sliding window before dividing by the window size to obtain the average.

**Code (TypeScript)**

```ts
window.reduce((a: number, b: number) => a + b, 0) / window.length
```

**Formula:**

$$
xˉwindow​=M1​j=start∑end​xj​​
$$
