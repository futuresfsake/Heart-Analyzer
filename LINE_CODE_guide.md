## Key Signal Processing Code

The key signal processing operations in the application are implemented in the following sections of the code:

- Lines 138–149: Moving average convolution (main DSP operation)
Implements a sliding window average that smooths the heart rate signal by averaging neighboring samples. This reduces high-frequency noise while preserving the overall trend.
- Line 122: Summation for mean calculation
Uses a reduce operation to compute the arithmetic mean of the heart rate signal.
- Line 127: Summation for variance calculation
Accumulates squared deviations from the mean to measure signal spread and variability.
- Lines 152–156: Summation for RMSSD calculation
Computes the sum of squared successive differences between heart rate samples to quantify Heart Rate Variability (HRV).
- Line 147: Window summation for local averaging
Sums values inside each sliding window before dividing by the window length to obtain the moving average.
- Lines 90–118: Fast Fourier Transform (FFT) computation
Converts the time-domain heart rate signal into the frequency domain by computing the discrete Fourier transform and generating a frequency–magnitude spectrum.
- Lines 160–164: Dominant frequency extraction
Identifies the frequency bin with the maximum magnitude (excluding the DC component), representing the strongest periodic component in the signal.

---

## Signal Processing Interpretation

The **moving average convolution** acts as a *low-pass filter*, removing high-frequency noise while preserving long-term heart rate trends.
The **FFT analysis** complements this by revealing periodic patterns in the signal that are not visible in the time domain.
Extracting the dominant frequency allows identification of underlying physiological rhythms, such as respiration-related modulation or autonomic nervous system activity.
