/**
 * DSQR Custom Hook
 * Domain-specific hook for managing DSQR (Delivery Service Quality Rating) data and analysis
 * 
 * This hook:
 * - Provides access to processed DSQR performance data
 * - Manages platform-specific metrics and alerts
 * - Offers performance analysis and recommendations
 * - Handles filtering and alert management
 * - Integrates with the main DSPR API coordination
 */

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import {
  resetDSQRState,
  clearDSQRError,
  setDSQRFilter,
  updateDSQRConfig,
  dismissAlert,
  clearAllAlerts,
  reprocessDSQRData,
  selectDSQRState,
  selectRawDSQRData,
  selectProcessedDSQRData,
  selectFilteredPlatformMetrics,
  selectPerformanceAlerts,
  selectCriticalAlerts,
  selectDSQRLoading,
  selectDSQRError,
  selectOverallSummary,
  selectBestPlatform,
  selectAttentionRequired
} from '../store/dSQRSlice';
import {
  type DSQRFilter,
  type DSQRAnalysisConfig,
  type PerformanceAlert,
  type PlatformMetrics,
  DeliveryPlatform,
  AlertSeverity,
  PerformanceLevel,
  PerformanceGrade,
  isValidDeliveryPlatform,
  isOnTrack,
} from '../types/DSQR';
import { useDsprApi } from './useCoordinator';

// =============================================================================
// HOOK INTERFACE
// =============================================================================

/**
 * Configuration options for the DSQR hook
 */
export interface UseDSQROptions {
  /** Whether to automatically process alerts when data changes */
  autoProcessAlerts?: boolean;
  /** Default filter to apply */
  defaultFilter?: DSQRFilter;
  /** Whether to enable detailed logging */
  enableLogging?: boolean;
  /** Custom configuration overrides */
  configOverrides?: Partial<DSQRAnalysisConfig>;
  /** Platforms to monitor specifically */
  focusPlatforms?: DeliveryPlatform[];
}

/**
 * Action item for platform recommendations
 */
export interface ActionItem {
  action: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  timeline: string;
}

/**
 * Return type of the useDSQR hook
 */
export interface UseDSQRReturn {
  // Data and State
  /** Raw DSQR data from API */
  rawData: ReturnType<typeof selectRawDSQRData>;
  /** Processed DSQR data with analysis */
  processedData: ReturnType<typeof selectProcessedDSQRData>;
  /** Platform metrics with current filter applied */
  platformMetrics: ReturnType<typeof selectFilteredPlatformMetrics>;
  /** All performance alerts */
  alerts: ReturnType<typeof selectPerformanceAlerts>;
  /** Critical alerts only */
  criticalAlerts: ReturnType<typeof selectCriticalAlerts>;
  /** Overall performance summary */
  overallSummary: ReturnType<typeof selectOverallSummary>;
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: string | null;

  // Current Settings
  /** Current filter configuration */
  currentFilter: DSQRFilter | null;
  /** Current analysis configuration */
  currentConfig: DSQRAnalysisConfig;

  // Actions
  /** Update filter settings */
  setFilter: (filter: DSQRFilter | null) => void;
  /** Update analysis configuration */
  updateConfig: (config: Partial<DSQRAnalysisConfig>) => void;
  /** Dismiss specific alert */
  dismissSpecificAlert: (alertIndex: number) => void;
  /** Clear all alerts */
  clearAllPerformanceAlerts: () => void;
  /** Manually reprocess data */
  reprocessData: () => void;
  /** Reset DSQR state */
  resetState: () => void;
  /** Clear current error */
  clearError: () => void;

  // Platform Analysis Functions
  /** Get metrics for specific platform */
  getPlatformMetrics: (platform: DeliveryPlatform) => PlatformMetrics | null;
  /** Get platform performance comparison */
  getPlatformComparison: () => PlatformComparison;
  /** Get platform recommendations */
  getPlatformRecommendations: (platform: DeliveryPlatform) => PlatformRecommendations;
  /** Calculate platform ranking */
  getPlatformRanking: () => PlatformRanking[];

  // Alert Management Functions
  /** Get alerts by severity */
  getAlertsBySeverity: (severity: AlertSeverity) => PerformanceAlert[];
  /** Get alerts by platform */
  getAlertsByPlatform: (platform: DeliveryPlatform) => PerformanceAlert[];
  /** Get alert summary */
  getAlertSummary: () => AlertSummary;
  /** Check if platform needs attention */
  needsAttention: (platform: DeliveryPlatform) => boolean;

  // Performance Analysis Functions
  /** Get overall performance grade */
  getOverallGrade: () => PerformanceGrade | null;
  /** Get performance trends */
  getPerformanceTrends: () => PerformanceTrends | null;
  /** Calculate improvement opportunities */
  getImprovementOpportunities: () => ImprovementOpportunity[];
  /** Get benchmark comparison */
  getBenchmarkComparison: () => BenchmarkComparison | null;

  // Utilities
  /** Check if data is available and valid */
  hasValidData: () => boolean;
  /** Get data quality assessment */
  getDataQuality: () => DSQRDataQuality;
  /** Export DSQR data */
  exportData: (format: DSQRExportFormat) => DSQRExportResult;
}

/**
 * Platform comparison analysis
 */
export interface PlatformComparison {
  /** Best performing platform */
  best: {
    platform: DeliveryPlatform;
    score: number;
    strengths: string[];
  };
  /** Worst performing platform */
  worst: {
    platform: DeliveryPlatform;
    score: number;
    weaknesses: string[];
  };
  /** Performance gaps between platforms */
  gaps: Array<{
    metric: string;
    bestValue: number;
    worstValue: number;
    gap: number;
  }>;
}

/**
 * Platform-specific recommendations
 */
export interface PlatformRecommendations {
  /** Platform identifier */
  platform: DeliveryPlatform;
  /** Priority level */
  priority: 'High' | 'Medium' | 'Low';
  /** Key areas for improvement */
  focusAreas: string[];
  /** Specific action items */
  actions: ActionItem[];
  /** Expected outcomes */
  expectedOutcomes: string[];
}

/**
 * Platform ranking information
 */
export interface PlatformRanking {
  /** Platform identifier */
  platform: DeliveryPlatform;
  /** Overall score */
  score: number;
  /** Ranking position */
  rank: number;
  /** Performance level */
  level: PerformanceLevel;
  /** Key metrics summary */
  keyMetrics: {
    rating: number;
    onTrackPercentage: number;
    criticalIssues: number;
  };
}

/**
 * Alert summary information
 */
export interface AlertSummary {
  /** Total alert count */
  total: number;
  /** Count by severity */
  bySeverity: Record<AlertSeverity, number>;
  /** Count by platform */
  byPlatform: Record<DeliveryPlatform, number>;
  /** Most critical platform */
  mostCritical: DeliveryPlatform | null;
  /** Recent alert trends */
  trends: {
    increasing: boolean;
    changePercent: number;
  };
}

/**
 * Performance trends analysis
 */
export interface PerformanceTrends {
  /** Overall trend direction */
  overall: 'improving' | 'declining' | 'stable';
  /** Platform-specific trends */
  byPlatform: Record<DeliveryPlatform, {
    trend: 'improving' | 'declining' | 'stable';
    changePercent: number;
    keyChanges: string[];
  }>;
  /** Metric trends */
  byMetric: Array<{
    metric: string;
    trend: 'improving' | 'declining' | 'stable';
    platforms: DeliveryPlatform[];
  }>;
}

/**
 * Improvement opportunity
 */
export interface ImprovementOpportunity {
  /** Opportunity description */
  title: string;
  /** Affected platforms */
  platforms: DeliveryPlatform[];
  /** Potential impact */
  impact: {
    rating: 'High' | 'Medium' | 'Low';
    description: string;
    estimatedImprovement: number;
  };
  /** Implementation details */
  implementation: {
    effort: 'High' | 'Medium' | 'Low';
    timeline: string;
    resources: string[];
  };
  /** Success metrics */
  successMetrics: string[];
}

/**
 * Benchmark comparison
 */
export interface BenchmarkComparison {
  /** Industry benchmarks */
  industry: Record<string, number>;
  /** Current performance */
  current: Record<string, number>;
  /** Performance gaps */
  gaps: Array<{
    metric: string;
    current: number;
    benchmark: number;
    gap: number;
    status: 'above' | 'below' | 'at';
  }>;
  /** Overall benchmark score */
  overallScore: number;
}

/**
 * DSQR data quality assessment
 */
export interface DSQRDataQuality {
  /** Overall quality score */
  overallScore: number;
  /** Data completeness */
  completeness: number;
  /** Metric coverage */
  metricCoverage: number;
  /** Platform coverage */
  platformCoverage: number;
  /** Quality issues */
  issues: string[];
  /** Quality level */
  level: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

/**
 * Export formats for DSQR data
 */
export type DSQRExportFormat = 'detailed' | 'summary' | 'alerts' | 'recommendations';

/**
 * DSQR export result
 */
export interface DSQRExportResult {
  /** Export format used */
  format: DSQRExportFormat;
  /** Exported data */
  data: object;
  /** Filename suggestion */
  filename: string;
  /** Export metadata */
  metadata: {
    exportDate: string;
    platforms: DeliveryPlatform[];
    alertCount: number;
  };
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * DSQR domain hook
 * Provides comprehensive access to DSQR data and performance analysis
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing data, actions, and analysis functions
 */
export const useDSQR = (options: UseDSQROptions = {}): UseDSQRReturn => {
  const {
    defaultFilter,
    enableLogging = process.env.NODE_ENV === 'development',
    configOverrides,
    focusPlatforms
  } = options;

  const dispatch = useDispatch<AppDispatch>();

  // Get DSPR API state for coordination
  const {  isLoading: dsprLoading } = useDsprApi();

  // Selectors
  const dsqrState = useSelector((state: RootState) => selectDSQRState(state));
  const rawData = useSelector((state: RootState) => selectRawDSQRData(state));
  const processedData = useSelector((state: RootState) => selectProcessedDSQRData(state));
  const platformMetrics = useSelector((state: RootState) => selectFilteredPlatformMetrics(state));
  const alerts = useSelector((state: RootState) => selectPerformanceAlerts(state));
  const criticalAlerts = useSelector((state: RootState) => selectCriticalAlerts(state));
  const overallSummary = useSelector((state: RootState) => selectOverallSummary(state));
  const isLoading = useSelector((state: RootState) => selectDSQRLoading(state));
  const error = useSelector((state: RootState) => selectDSQRError(state));
  const bestPlatform = useSelector((state: RootState) => selectBestPlatform(state));
  const attentionRequired = useSelector((state: RootState) => selectAttentionRequired(state));

  // Apply default filter and focus platforms
  useMemo(() => {
    let filterToApply = defaultFilter;
    
    if (focusPlatforms && focusPlatforms.length > 0) {
      filterToApply = {
        ...defaultFilter,
        platforms: focusPlatforms
      };
    }
    
    if (filterToApply && !dsqrState.currentFilter) {
      dispatch(setDSQRFilter(filterToApply));
    }
  }, [defaultFilter, focusPlatforms, dsqrState.currentFilter, dispatch]);

  // Apply configuration overrides
  useMemo(() => {
    if (configOverrides) {
      dispatch(updateDSQRConfig(configOverrides));
      if (enableLogging) {
        console.log('[useDSQR] Configuration overrides applied', configOverrides);
      }
    }
  }, [configOverrides, dispatch, enableLogging]);

  // Actions
  const setFilter = useCallback((filter: DSQRFilter | null) => {
    dispatch(setDSQRFilter(filter));
    if (enableLogging) {
      console.log('[useDSQR] Filter updated', filter);
    }
  }, [dispatch, enableLogging]);

  const updateConfig = useCallback((config: Partial<DSQRAnalysisConfig>) => {
    dispatch(updateDSQRConfig(config));
    if (enableLogging) {
      console.log('[useDSQR] Configuration updated', config);
    }
  }, [dispatch, enableLogging]);

  const dismissSpecificAlert = useCallback((alertIndex: number) => {
    dispatch(dismissAlert(alertIndex));
    if (enableLogging) {
      console.log('[useDSQR] Alert dismissed', { alertIndex });
    }
  }, [dispatch, enableLogging]);

  const clearAllPerformanceAlerts = useCallback(() => {
    dispatch(clearAllAlerts());
    if (enableLogging) {
      console.log('[useDSQR] All alerts cleared');
    }
  }, [dispatch, enableLogging]);

  const reprocessData = useCallback(() => {
    dispatch(reprocessDSQRData());
    if (enableLogging) {
      console.log('[useDSQR] Data reprocessing triggered');
    }
  }, [dispatch, enableLogging]);

  const resetState = useCallback(() => {
    dispatch(resetDSQRState());
    if (enableLogging) {
      console.log('[useDSQR] State reset');
    }
  }, [dispatch, enableLogging]);

  const clearError = useCallback(() => {
    dispatch(clearDSQRError());
    if (enableLogging) {
      console.log('[useDSQR] Error cleared');
    }
  }, [dispatch, enableLogging]);

  // Platform Analysis Functions
  const getPlatformMetrics = useCallback((platform: DeliveryPlatform): PlatformMetrics | null => {
    if (!platformMetrics || !isValidDeliveryPlatform(platform)) {
      return null;
    }
    return platformMetrics[platform] || null;
  }, [platformMetrics]);

  const getPlatformComparison = useCallback((): PlatformComparison => {
    if (!platformMetrics) {
      throw new Error('No platform metrics available for comparison');
    }

    const validPlatforms = Object.entries(platformMetrics)
      .filter(([_, metrics]) => metrics !== null)
      .map(([platform, metrics]) => ({ platform: platform as DeliveryPlatform, metrics: metrics! }));

    if (validPlatforms.length < 2) {
      throw new Error('Need at least 2 platforms for comparison');
    }

    const sortedByPerformance = validPlatforms.sort((a, b) => 
      b.metrics.performancePercentage - a.metrics.performancePercentage
    );

    const best = sortedByPerformance[0];
    const worst = sortedByPerformance[sortedByPerformance.length - 1];

    // Identify strengths and weaknesses
    const bestStrengths = best.metrics.kpis
      .filter(kpi => isOnTrack(kpi.status))
      .map(kpi => kpi.label)
      .slice(0, 3);

    const worstWeaknesses = worst.metrics.kpis
      .filter(kpi => !isOnTrack(kpi.status))
      .map(kpi => kpi.label)
      .slice(0, 3);

    // Calculate gaps
    const gaps = best.metrics.kpis.map(bestKpi => {
      const worstKpi = worst.metrics.kpis.find(k => k.name === bestKpi.name);
      if (!worstKpi || typeof bestKpi.value !== 'number' || typeof worstKpi.value !== 'number') {
        return null;
      }

      return {
        metric: bestKpi.label,
        bestValue: bestKpi.value,
        worstValue: worstKpi.value,
        gap: Math.abs(bestKpi.value - worstKpi.value)
      };
    }).filter(Boolean) as any[];

    return {
      best: {
        platform: best.platform,
        score: best.metrics.performancePercentage,
        strengths: bestStrengths
      },
      worst: {
        platform: worst.platform,
        score: worst.metrics.performancePercentage,
        weaknesses: worstWeaknesses
      },
      gaps
    };
  }, [platformMetrics]);

  const getPlatformRecommendations = useCallback((platform: DeliveryPlatform): PlatformRecommendations => {
    const metrics = getPlatformMetrics(platform);
    if (!metrics) {
      throw new Error(`No metrics available for platform: ${platform}`);
    }

    const offTrackKPIs = metrics.kpis.filter(kpi => !isOnTrack(kpi.status));
    const criticalKPIs = offTrackKPIs.filter(kpi => kpi.isCritical);

    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (criticalKPIs.length > 0) priority = 'High';
    else if (offTrackKPIs.length > 2) priority = 'Medium';

    const focusAreas = offTrackKPIs.map(kpi => kpi.label).slice(0, 3);

    // Generate platform-specific actions
    const actions = generatePlatformActions(platform, offTrackKPIs);
    
    const expectedOutcomes = [
      'Improved customer satisfaction ratings',
      'Reduced operational issues',
      'Better delivery performance metrics'
    ];

    return {
      platform,
      priority,
      focusAreas,
      actions,
      expectedOutcomes
    };
  }, [getPlatformMetrics]);

  const getPlatformRanking = useCallback((): PlatformRanking[] => {
    if (!platformMetrics) {
      return [];
    }

    const validPlatforms = Object.entries(platformMetrics)
      .filter(([_, metrics]) => metrics !== null)
      .map(([platform, metrics]) => ({
        platform: platform as DeliveryPlatform,
        metrics: metrics!
      }));

    return validPlatforms
      .sort((a, b) => b.metrics.performancePercentage - a.metrics.performancePercentage)
      .map((item, index) => ({
        platform: item.platform,
        score: item.metrics.performancePercentage,
        rank: index + 1,
        level: item.metrics.performanceLevel,
        keyMetrics: {
          rating: item.metrics.overallRating,
          onTrackPercentage: item.metrics.performancePercentage,
          criticalIssues: item.metrics.kpis.filter(kpi => kpi.isCritical && !isOnTrack(kpi.status)).length
        }
      }));
  }, [platformMetrics]);

  // Alert Management Functions
  const getAlertsBySeverity = useCallback((severity: AlertSeverity): PerformanceAlert[] => {
    return alerts.filter(alert => alert.severity === severity);
  }, [alerts]);

  const getAlertsByPlatform = useCallback((platform: DeliveryPlatform): PerformanceAlert[] => {
    return alerts.filter(alert => alert.platform === platform);
  }, [alerts]);

  const getAlertSummary = useCallback((): AlertSummary => {
    const bySeverity = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<AlertSeverity, number>);

    const byPlatform = alerts.reduce((acc, alert) => {
      acc[alert.platform] = (acc[alert.platform] || 0) + 1;
      return acc;
    }, {} as Record<DeliveryPlatform, number>);

    const mostCritical = Object.entries(byPlatform)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as DeliveryPlatform || null;

    return {
      total: alerts.length,
      bySeverity,
      byPlatform,
      mostCritical,
      trends: {
        increasing: false, // Would need historical data
        changePercent: 0   // Would need historical data
      }
    };
  }, [alerts]);

  const needsAttention = useCallback((platform: DeliveryPlatform): boolean => {
    const platformAlerts = getAlertsByPlatform(platform);
    const criticalAlerts = platformAlerts.filter(alert => 
      alert.severity === AlertSeverity.CRITICAL || alert.severity === AlertSeverity.ERROR
    );
    return criticalAlerts.length > 0;
  }, [getAlertsByPlatform]);

  // Performance Analysis Functions
  const getOverallGrade = useCallback((): PerformanceGrade | null => {
    return overallSummary?.performanceGrade || null;
  }, [overallSummary]);

  const getPerformanceTrends = useCallback((): PerformanceTrends | null => {
    // This would require historical data - returning placeholder structure
    if (!platformMetrics) return null;

    const byPlatform = Object.keys(platformMetrics).reduce((acc, platform) => {
      acc[platform as DeliveryPlatform] = {
        trend: 'stable' as const,
        changePercent: 0,
        keyChanges: []
      };
      return acc;
    }, {} as Record<DeliveryPlatform, any>);

    return {
      overall: 'stable',
      byPlatform,
      byMetric: []
    };
  }, [platformMetrics]);

  const getImprovementOpportunities = useCallback((): ImprovementOpportunity[] => {
    if (!alerts || alerts.length === 0) {
      return [];
    }

    // Group alerts by common themes to identify opportunities
    const opportunities: ImprovementOpportunity[] = [];

    // Rating improvement opportunity
    const ratingAlerts = alerts.filter(alert => 
      alert.metric.includes('Rating') || alert.metric.includes('reviews')
    );

    if (ratingAlerts.length > 0) {
      opportunities.push({
        title: 'Improve Customer Rating Scores',
        platforms: ratingAlerts.map(alert => alert.platform),
        impact: {
          rating: 'High',
          description: 'Higher ratings improve platform visibility and customer trust',
          estimatedImprovement: 15
        },
        implementation: {
          effort: 'Medium',
          timeline: '30-60 days',
          resources: ['Kitchen staff training', 'Quality control processes']
        },
        successMetrics: ['Average rating > 4.5', 'Positive review percentage > 90%']
      });
    }

    // Operational efficiency opportunity
    const operationalAlerts = alerts.filter(alert =>
      alert.metric.includes('Wait') || alert.metric.includes('Downtime')
    );

    if (operationalAlerts.length > 0) {
      opportunities.push({
        title: 'Optimize Operational Efficiency',
        platforms: operationalAlerts.map(alert => alert.platform),
        impact: {
          rating: 'Medium',
          description: 'Reduced wait times and downtime improve delivery partner satisfaction',
          estimatedImprovement: 10
        },
        implementation: {
          effort: 'High',
          timeline: '60-90 days',
          resources: ['Process optimization', 'Staff scheduling', 'Technology upgrades']
        },
        successMetrics: ['Wait time < 2 minutes', 'Downtime < 30 minutes/day']
      });
    }

    return opportunities;
  }, [alerts]);

  const getBenchmarkComparison = useCallback((): BenchmarkComparison | null => {
    if (!overallSummary || !platformMetrics) {
      return null;
    }

    // Industry benchmarks (these would typically come from configuration)
    const industry = {
      'Average Rating': 4.3,
      'On Track Percentage': 85,
      'Customer Satisfaction': 90
    };

    const current = {
      'Average Rating': overallSummary.averageRating,
      'On Track Percentage': overallSummary.overallPerformance,
      'Customer Satisfaction': overallSummary.overallPerformance
    };

    const gaps = Object.entries(industry).map(([metric, benchmark]) => {
      const currentValue = (current as Record<string, number>)[metric] || 0;
      const gap = currentValue - benchmark;
      
      return {
        metric,
        current: currentValue,
        benchmark,
        gap,
        status: gap > 0 ? 'above' as const : gap < 0 ? 'below' as const : 'at' as const
      };
    });

    const overallScore = gaps.reduce((acc, gap) => {
      const score = gap.status === 'above' ? 100 : gap.status === 'at' ? 90 : Math.max(0, 90 + (gap.gap / gap.benchmark) * 90);
      return acc + score;
    }, 0) / gaps.length;

    return {
      industry,
      current,
      gaps,
      overallScore
    };
  }, [overallSummary, platformMetrics]);

  // Utilities
  const hasValidData = useCallback((): boolean => {
    return !!(processedData && platformMetrics && Object.values(platformMetrics).some(m => m !== null));
  }, [processedData, platformMetrics]);

  const getDataQuality = useCallback((): DSQRDataQuality => {
    if (!rawData || !processedData) {
      return {
        overallScore: 0,
        completeness: 0,
        metricCoverage: 0,
        platformCoverage: 0,
        issues: ['No data available'],
        level: 'Poor'
      };
    }

    // Calculate completeness based on available metrics
    const totalPossibleMetrics = 20; // Approximate total DSQR metrics
    const availableMetrics = Object.values(rawData.score).filter(value => 
      value !== null && value !== undefined && value !== 0
    ).length;
    
    const completeness = (availableMetrics / totalPossibleMetrics) * 100;

    // Calculate platform coverage
    const totalPlatforms = Object.values(DeliveryPlatform).length;
    const activePlatforms = platformMetrics ? 
      Object.values(platformMetrics).filter(m => m !== null).length : 0;
    const platformCoverage = (activePlatforms / totalPlatforms) * 100;

    const metricCoverage = completeness; // Same calculation for now
    const overallScore = (completeness + platformCoverage + metricCoverage) / 3;

    let level: DSQRDataQuality['level'] = 'Poor';
    if (overallScore >= 90) level = 'Excellent';
    else if (overallScore >= 75) level = 'Good';
    else if (overallScore >= 60) level = 'Fair';

    return {
      overallScore,
      completeness,
      metricCoverage,
      platformCoverage,
      issues: alerts.map(alert => alert.message),
      level
    };
  }, [rawData, processedData, platformMetrics, alerts]);

  const exportData = useCallback((format: DSQRExportFormat): DSQRExportResult => {
    if (!processedData) {
      throw new Error('No data available for export');
    }

    const exportDate = new Date().toISOString();
    const platforms = Object.keys(platformMetrics || {}) as DeliveryPlatform[];
    const alertCount = alerts.length;

    let data: object;
    let filename: string;

    switch (format) {
      case 'detailed':
        data = {
          summary: overallSummary,
          platforms: platformMetrics,
          alerts,
          rawData
        };
        filename = `dsqr-detailed-${exportDate.split('T')[0]}.json`;
        break;

      case 'summary':
        data = {
          overallGrade: overallSummary?.performanceGrade,
          averageRating: overallSummary?.averageRating,
          totalOnTrack: overallSummary?.totalOnTrack,
          totalApplicable: overallSummary?.totalApplicable,
          bestPlatform: bestPlatform,
          attentionRequired: attentionRequired
        };
        filename = `dsqr-summary-${exportDate.split('T')[0]}.json`;
        break;

      case 'alerts':
        data = {
          alerts,
          summary: getAlertSummary(),
          criticalAlerts
        };
        filename = `dsqr-alerts-${exportDate.split('T')[0]}.json`;
        break;

      case 'recommendations':
        const recommendations = platforms.map(platform => 
          getPlatformRecommendations(platform)
        );
        data = {
          recommendations,
          improvementOpportunities: getImprovementOpportunities()
        };
        filename = `dsqr-recommendations-${exportDate.split('T')[0]}.json`;
        break;

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return {
      format,
      data,
      filename,
      metadata: {
        exportDate,
        platforms,
        alertCount
      }
    };
  }, [processedData, platformMetrics, alerts, overallSummary, bestPlatform, attentionRequired, getAlertSummary, getPlatformRecommendations, getImprovementOpportunities]);

  return {
    // Data and State
    rawData,
    processedData,
    platformMetrics,
    alerts,
    criticalAlerts,
    overallSummary,
    isLoading: isLoading || dsprLoading,
    error,

    // Current Settings
    currentFilter: dsqrState.currentFilter,
    currentConfig: dsqrState.config,

    // Actions
    setFilter,
    updateConfig,
    dismissSpecificAlert,
    clearAllPerformanceAlerts,
    reprocessData,
    resetState,
    clearError,

    // Platform Analysis Functions
    getPlatformMetrics,
    getPlatformComparison,
    getPlatformRecommendations,
    getPlatformRanking,

    // Alert Management Functions
    getAlertsBySeverity,
    getAlertsByPlatform,
    getAlertSummary,
    needsAttention,

    // Performance Analysis Functions
    getOverallGrade,
    getPerformanceTrends,
    getImprovementOpportunities,
    getBenchmarkComparison,

    // Utilities
    hasValidData,
    getDataQuality,
    exportData
  };
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate platform-specific action recommendations
 */
function generatePlatformActions(platform: DeliveryPlatform, offTrackKPIs: any[]): ActionItem[] {
  const actions: ActionItem[] = [];

  for (const kpi of offTrackKPIs.slice(0, 3)) { // Limit to top 3
    switch (platform) {
      case DeliveryPlatform.DOORDASH:
        if (kpi.name.includes('Rating')) {
          actions.push({
            action: 'Implement order accuracy checklist',
            impact: 'High',
            effort: 'Medium',
            timeline: '2-3 weeks'
          });
        }
        break;
      case DeliveryPlatform.UBEREATS:
        if (kpi.name.includes('reviews')) {
          actions.push({
            action: 'Enhance food packaging and presentation',
            impact: 'Medium',
            effort: 'Low',
            timeline: '1-2 weeks'
          });
        }
        break;
      case DeliveryPlatform.GRUBHUB:
        if (kpi.name.includes('Rating')) {
          actions.push({
            action: 'Optimize preparation timing',
            impact: 'High',
            effort: 'Medium',
            timeline: '3-4 weeks'
          });
        }
        break;
    }
  }

  return actions;
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Simplified hook for basic DSQR data
 */
export const useSimpleDSQR = () => {
  const {
    overallSummary,
    alerts,
    isLoading,
    error,
    hasValidData
  } = useDSQR();

  return {
    summary: overallSummary,
    alerts: alerts.slice(0, 5), // Top 5 alerts
    isLoading,
    error,
    hasData: hasValidData()
  };
};

/**
 * Hook for platform comparison analysis
 */
export const usePlatformComparison = () => {
  const { getPlatformComparison, getPlatformRanking } = useDSQR();

  const comparison = useMemo(() => {
    try {
      return getPlatformComparison();
    } catch {
      return null;
    }
  }, [getPlatformComparison]);

  const ranking = getPlatformRanking();

  return {
    comparison,
    ranking
  };
};

/**
 * Hook for alert management
 */
export const useAlertManagement = () => {
  const {
    alerts,
    criticalAlerts,
    getAlertSummary,
    dismissSpecificAlert,
    clearAllPerformanceAlerts
  } = useDSQR();

  const summary = getAlertSummary();

  return {
    alerts,
    criticalAlerts,
    summary,
    dismissAlert: dismissSpecificAlert,
    clearAllAlerts: clearAllPerformanceAlerts
  };
};

// =============================================================================
// HOOK EXPORTS
// =============================================================================

export default useDSQR;
