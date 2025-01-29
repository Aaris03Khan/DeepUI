// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import os from 'os';

function calculateCpuUsage() {
  const cpus = os.cpus();
  const totalTimes = cpus.reduce(
    (acc, cpu) => {
      acc.user += cpu.times.user;
      acc.nice += cpu.times.nice;
      acc.sys += cpu.times.sys;
      acc.idle += cpu.times.idle;
      acc.irq += cpu.times.irq;
      return acc;
    },
    { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
  );

  const total = totalTimes.user + totalTimes.nice + totalTimes.sys + totalTimes.idle + totalTimes.irq;
  const idle = totalTimes.idle;

  return { total, idle };
}

export async function GET() {
  const start = calculateCpuUsage();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
  const end = calculateCpuUsage();

  const idleDifference = end.idle - start.idle;
  const totalDifference = end.total - start.total;
  const cpuUsage = ((totalDifference - idleDifference) / totalDifference) * 100;

  // Get total and free memory
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = (usedMemory / totalMemory) * 100;

  return NextResponse.json({
    cpuUsage: cpuUsage.toFixed(2),
    memoryUsage: memoryUsage.toFixed(2),
    totalMemory: (totalMemory / (1024 ** 3)).toFixed(2), // Convert to GB
    usedMemory: (usedMemory / (1024 ** 3)).toFixed(2),   // Convert to GB
  });
}
