import { db } from '../db';
import { SensorAnalyticsData, SensorPoint } from '../../src/types';

export class SensorService {
  public getSensorData(componentId: string = 'TB-007'): SensorAnalyticsData {
    const row = db.prepare('SELECT * FROM sensor_telemetry WHERE component_id = ? ORDER BY id DESC LIMIT 1').get(componentId) as any;
    if (!row) {
      return this.getDefaultBaseline();
    }

    const vibHistory: SensorPoint[] = JSON.parse(row.vibration_history_json || '[]');
    const tempHistory: SensorPoint[] = JSON.parse(row.temperature_history_json || '[]');
    const deviationPercent = Math.round(((row.vibration_current - row.vibration_baseline) / row.vibration_baseline) * 1000) / 10;

    return {
      isSimulating: false,
      vibration: {
        baseline: row.vibration_baseline,
        current: row.vibration_current,
        deviationPercent,
        status: row.vibration_status,
        unit: 'mm/s',
        history: vibHistory
      },
      temperature: {
        baseline: row.temperature_baseline,
        current: row.temperature_current,
        trend: row.temperature_trend,
        unit: '°C',
        history: tempHistory
      },
      rpm: {
        current: row.rpm_current,
        status: row.rpm_status,
        unit: 'RPM'
      },
      flightCycles: row.flight_cycles,
      operatingHours: row.operating_hours
    };
  }

  public updateTelemetry(componentId: string, updates: Partial<{
    vibrationCurrent: number;
    temperatureCurrent: number;
    rpmCurrent: number;
  }>): SensorAnalyticsData {
    const current = this.getSensorData(componentId);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newVib = updates.vibrationCurrent ?? current.vibration.current;
    const newTemp = updates.temperatureCurrent ?? current.temperature.current;
    const newRpm = updates.rpmCurrent ?? current.rpm.current;

    const newVibHistory = [...current.vibration.history.slice(1), { time: nowStr, value: newVib, baseline: current.vibration.baseline }];
    const newTempHistory = [...current.temperature.history.slice(1), { time: nowStr, value: newTemp, baseline: current.temperature.baseline }];

    const vibStatus = newVib > 6.0 ? 'ANOMALOUS' : newVib > 4.8 ? 'ANOMALOUS' : 'NORMAL';
    const tempTrend = newTemp > 75 ? 'INCREASING' : 'STABLE';

    db.prepare(`
      UPDATE sensor_telemetry
      SET vibration_current = ?,
          vibration_status = ?,
          vibration_history_json = ?,
          temperature_current = ?,
          temperature_trend = ?,
          temperature_history_json = ?,
          rpm_current = ?,
          updated_at = ?
      WHERE component_id = ?
    `).run(
      newVib,
      vibStatus,
      JSON.stringify(newVibHistory),
      newTemp,
      tempTrend,
      JSON.stringify(newTempHistory),
      newRpm,
      new Date().toISOString(),
      componentId
    );

    return this.getSensorData(componentId);
  }

  public resetToBaseline(componentId: string = 'TB-007'): SensorAnalyticsData {
    const baseline = this.getDefaultBaseline();
    db.prepare(`
      UPDATE sensor_telemetry
      SET vibration_current = ?,
          vibration_status = ?,
          vibration_history_json = ?,
          temperature_current = ?,
          temperature_trend = ?,
          temperature_history_json = ?,
          rpm_current = ?,
          updated_at = ?
      WHERE component_id = ?
    `).run(
      baseline.vibration.baseline,
      'NORMAL',
      JSON.stringify(baseline.vibration.history),
      baseline.temperature.baseline,
      'STABLE',
      JSON.stringify(baseline.temperature.history),
      baseline.rpm.current,
      new Date().toISOString(),
      componentId
    );

    return this.getSensorData(componentId);
  }

  private getDefaultBaseline(): SensorAnalyticsData {
    return {
      isSimulating: false,
      vibration: {
        baseline: 4.1,
        current: 4.1,
        deviationPercent: 0,
        status: 'NORMAL',
        unit: 'mm/s',
        history: [
          { time: '14:20', value: 4.1, baseline: 4.1 },
          { time: '14:22', value: 4.1, baseline: 4.1 },
          { time: '14:24', value: 4.1, baseline: 4.1 },
          { time: '14:26', value: 4.2, baseline: 4.1 },
          { time: '14:28', value: 4.1, baseline: 4.1 },
          { time: '14:30', value: 4.1, baseline: 4.1 },
          { time: '14:32', value: 4.1, baseline: 4.1 }
        ]
      },
      temperature: {
        baseline: 68,
        current: 68,
        trend: 'STABLE',
        unit: '°C',
        history: [
          { time: '14:20', value: 68, baseline: 68 },
          { time: '14:22', value: 68, baseline: 68 },
          { time: '14:24', value: 69, baseline: 68 },
          { time: '14:26', value: 68, baseline: 68 },
          { time: '14:28', value: 68, baseline: 68 },
          { time: '14:30', value: 69, baseline: 68 },
          { time: '14:32', value: 68, baseline: 68 }
        ]
      },
      rpm: {
        current: 8420,
        status: 'NORMAL',
        unit: 'RPM'
      },
      flightCycles: 2941,
      operatingHours: 3842
    };
  }
}

export const sensorService = new SensorService();
