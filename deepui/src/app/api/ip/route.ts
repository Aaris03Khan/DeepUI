import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = '';

  // Find the first non-internal IPv4 address
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName]?.forEach((networkInterface) => {
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        ipAddress = networkInterface.address;
      }
    });
  });

  return NextResponse.json({ ip: ipAddress });
}