## Project Limitations

### 1. File Format Support
* **CSV Only:** The system exclusively accepts `.csv` (Comma Separated Values) files.
* **Unsupported Formats:** It cannot process Excel (`.xlsx`, `.xls`), JSON, XML, or plain text (`.txt`) files.

### 2. Data Requirements
* **Strict Column Naming:** The parser relies on specific keywords to identify data. It expects headers containing specific terms (e.g., "heart_rate", "bpm", "time") and may fail if column names deviate significantly.
* **Numerical Data Only:** The system requires pure numerical values in the heart rate column. It cannot handle text values, comments, or non-numeric characters within the data cells.
* **Case Sensitivity:** Column detection logic is sensitive to specific naming conventions and formatting.

### 3. Analysis Capabilities
* **Basic Statistics Only:** The analysis is limited to descriptive statistics (Mean, Range, Standard Deviation, RMSSD) and does not perform predictive modeling or machine learning.
* **Simple Smoothing:** The noise reduction is based on a simple Moving Average Convolution. It does not use advanced filtering techniques (like Butterworth or Kalman filters) that might be better suited for high-noise environments.
* **No Medical Diagnosis:** The system **cannot** detect specific heart conditions, arrhythmias (like AFib), or medical anomalies. It is strictly a data visualization tool, not a diagnostic device.

### 4. Technical Constraints
* **Sequential Data Required:** The algorithms (especially Moving Average and FFT) assume the data is time-sequential. Out-of-order timestamps will result in incorrect smoothing and frequency analysis.
* **Small Dataset Optimization:** As a browser-based tool, it is optimized for small-to-medium datasets. Large files (e.g., multi-day continuous recordings) may cause performance issues or browser crashes due to memory limits.
