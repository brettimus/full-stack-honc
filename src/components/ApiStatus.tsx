import { useState } from 'react';
import { apiClient } from '../api';

export function ApiStatus() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [healthData, setHealthData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const checkApiStatus = async () => {
    setStatus('loading');
    setHealthData(null);
    setError('');
    
    try {
      const response = await apiClient.healthCheck();
      setStatus('success');
      setHealthData(response);
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Failed to connect to API');
    }
  };

  return (
    <div className="api-status">
      <h3>API Status</h3>
      <button 
        onClick={checkApiStatus}
        disabled={status === 'loading'}
        className="status-button"
      >
        {status === 'loading' ? 'Checking...' : 'Check API Connection'}
      </button>
      
      {status !== 'idle' && (
        <div className={`status-result ${status}`}>
          <p>
            <strong>Status:</strong> {status === 'success' ? '✅ API Healthy' : '❌ Error'}
          </p>
          {status === 'success' && healthData && (
            <div className="health-details">
              <p><strong>Database:</strong> {healthData.database === 'connected' ? '✅ Connected' : '❌ Error'}</p>
              <p><strong>Timestamp:</strong> {new Date(healthData.timestamp).toLocaleString()}</p>
            </div>
          )}
          {status === 'error' && (
            <p><strong>Error:</strong> {error}</p>
          )}
        </div>
      )}
      
      <div className="api-links">
        <a href="/openapi.json" target="_blank" rel="noopener noreferrer">
          📋 OpenAPI Spec
        </a>
        <a href="/fp" target="_blank" rel="noopener noreferrer">
          🚀 API Explorer
        </a>
      </div>
    </div>
  );
}