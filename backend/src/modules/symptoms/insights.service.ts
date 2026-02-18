import { Injectable } from '@nestjs/common';
import { SymptomEntry } from '@prisma/client';
import { InsightsResponseDto } from './dto/insights-response.dto';

// Computes clinical insights from symptom entries (top symptom, trends, alerts)
@Injectable()
export class InsightsService {
  compute(entries: SymptomEntry[]): InsightsResponseDto {
    const now = new Date();

    const last7Start = new Date(now);
    last7Start.setDate(now.getDate() - 7);

    const prev7Start = new Date(now);
    prev7Start.setDate(now.getDate() - 14);

    const last30Start = new Date(now);
    last30Start.setDate(now.getDate() - 30);

    if (!entries.length) {
      return {
        topSymptom: null,
        topSymptomCount: 0,
        severityTrend: 'no_data',
        avgSeverityLast7Days: null,
        avgSeverityPrev7Days: null,
        alert: false,
        alertDetails: 'No symptom entries recorded for this patient',
        totalEntries: 0,
        periodStart: last30Start.toISOString(),
        periodEnd: now.toISOString(),
      };
    }

    const entriesLast7 = entries.filter(
      (e) => new Date(e.occurredAt) >= last7Start,
    );
    const entriesPrev7 = entries.filter(
      (e) =>
        new Date(e.occurredAt) >= prev7Start &&
        new Date(e.occurredAt) < last7Start,
    );
    const entriesLast30 = entries.filter(
      (e) => new Date(e.occurredAt) >= last30Start,
    );

    // Count occurrences of each symptom type in the last 30 days
    const symptomCount: Record<string, number> = {};
    entriesLast30.forEach((e) => {
      symptomCount[e.symptomType] = (symptomCount[e.symptomType] || 0) + 1;
    });

    let topSymptom: string | null = null;
    let topSymptomCount = 0;

    if (Object.keys(symptomCount).length > 0) {
      const sorted = Object.entries(symptomCount).sort(
        (a, b) => b[1] - a[1],
      );
      topSymptom = sorted[0][0];
      topSymptomCount = sorted[0][1];
    }

    // Compare average severity between the two 7-day periods
    const avg = (arr: SymptomEntry[]): number | null =>
      arr.length
        ? arr.reduce((sum, e) => sum + e.severity, 0) / arr.length
        : null;

    const avgLast7 = avg(entriesLast7);
    const avgPrev7 = avg(entriesPrev7);

    let severityTrend: string;

    if (avgLast7 === null && avgPrev7 === null) {
      severityTrend = 'no_data';
    } else if (avgLast7 !== null && avgPrev7 !== null) {
      const diff = avgLast7 - avgPrev7;
      if (diff > 0.1) {
        severityTrend = 'worsening';
      } else if (diff < -0.1) {
        severityTrend = 'improving';
      } else {
        severityTrend = 'stable';
      }
    } else {
      severityTrend = 'insufficient_data';
    }

    // Alert triggers when 3+ entries with severity >= 4 in the last 7 days
    const highSeverityCount = entriesLast7.filter(
      (e) => e.severity >= 4,
    ).length;
    const alert = highSeverityCount >= 3;

    let alertDetails: string;
    if (alert) {
      alertDetails = `ALERT: ${highSeverityCount} high-severity entries (>=4) logged in the last 7 days`;
    } else if (highSeverityCount > 0) {
      alertDetails = `${highSeverityCount} high-severity entry/entries in the last 7 days (threshold: 3)`;
    } else {
      alertDetails = 'No high-severity entries (>=4) in the last 7 days';
    }

    return {
      topSymptom,
      topSymptomCount,
      severityTrend,
      avgSeverityLast7Days: avgLast7 !== null ? Math.round(avgLast7 * 100) / 100 : null,
      avgSeverityPrev7Days: avgPrev7 !== null ? Math.round(avgPrev7 * 100) / 100 : null,
      alert,
      alertDetails,
      totalEntries: entries.length,
      periodStart: last30Start.toISOString(),
      periodEnd: now.toISOString(),
    };
  }
}
