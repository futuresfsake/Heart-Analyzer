The key signal processing code is:

Lines 82-89: Moving average convolution (main DSP operation)
Line 70: Sum for mean
Line 76: Sum for variance
Lines 93-97: Sum for RMSSD
Line 88: Sum for window averaging

The moving average acts as a low-pass filter that removes high-frequency noise while preserving the overall trend