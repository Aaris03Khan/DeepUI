import { Moon, Sun, QrCode, X, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  ipAddress: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, ipAddress }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [metrics, setMetrics] = useState<{ cpuUsage: string; memoryUsage: string; totalMemory: string; usedMemory: string } | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  useEffect(() => {
    fetchMetrics(); // Fetch metrics on component mount
    const interval = setInterval(fetchMetrics, 5000); // Update metrics every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className={`p-4 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">DeepUI</h1>
          <div className="flex gap-4 items-center">
            {/* CPU & RAM Info */}
            {metrics && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Cpu size={18} />
                <span>{metrics.cpuUsage}% CPU</span>
                <span>| {metrics.usedMemory}GB / {metrics.totalMemory}GB RAM</span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* QR Code Button (Hidden on Mobile) */}
            <button
              onClick={() => setShowQRCode(true)}
              className={`p-2 rounded-lg hidden sm:inline-flex ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <QrCode size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
            <button
              onClick={() => setShowQRCode(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Scan to Access on Mobile</h2>
            <div className="flex flex-col items-center">
              {ipAddress ? (
                <QRCodeSVG value={`http://${ipAddress}:3000`} size={200} />
              ) : (
                <p>Loading IP address...</p>
              )}
              <p className="mt-4 text-center text-sm text-gray-500">
                Scan this on your mobile device to use the app!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
