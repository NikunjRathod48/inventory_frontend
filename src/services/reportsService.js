import api from '../lib/api';

export const reportsService = {
  /**
   * Downloads the full Excel report. Uses fetch with Authorization header
   * so we can receive it as a blob and trigger a browser download.
   */
  downloadReport: async () => {
    const token = localStorage.getItem('access_token');
    const baseURL =
      import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

    const response = await fetch(`${baseURL}/reports/export`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition if present, or build one
    const disposition = response.headers.get('Content-Disposition');
    const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch
      ? filenameMatch[1]
      : `StockSense_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
