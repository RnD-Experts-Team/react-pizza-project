/**
 * DSQR Domain Slice
 * Redux slice for managing DSQR (Delivery Service Quality Rating) data and analysis
 * 
 * This slice:
 * - Listens to API coordinator success actions
 * - Extracts and processes DSQR performance data
 * - Analyzes delivery platform metrics (DoorDash, UberEats, GrubHub)
 * - Generates performance alerts and recommendations
 * - Manages domain-specific state and calculations
 */

import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { fetchDsprData, refreshDsprData } from './coordinatorSlice';
import {
  type DailyDSQRData,
  type ProcessedDSQRData,
  type DSQRFilter,
  type DSQRAnalysisConfig,
  type PerformanceAlert,
  type PlatformMetrics,
  DeliveryPlatform,
  TrackingStatus,
  AlertSeverity,
  AlertPriority,
  PerformanceLevel,
  PerformanceGrade,
  MetricUnit,
  TrendDirection,
  defaultDSQRConfig,
  isOnTrack
} from '../types/DSQR';
import { ApiStatus } from '../types/common';

// =============================================================================
// STATE INTERFACE
// =============================================================================

/**
 * State interface for DSQR domain
 */
export interface DSQRState {
  /** Raw DSQR data from API */
  rawData: DailyDSQRData | null;
  /** Processed DSQR data with analysis */
  processedData: ProcessedDSQRData | null;
  /** Current filter settings */
  currentFilter: DSQRFilter | null;
  /** Analysis configuration */
  config: DSQRAnalysisConfig;
  /** Generated performance alerts */
  alerts: PerformanceAlert[];
  /** Platform-specific metrics */
  platformMetrics: Record<DeliveryPlatform, PlatformMetrics | null>;
  /** Processing status */
  status: ApiStatus;
  /** Processing errors */
  error: string | null;
  /** Last processing timestamp */
  lastProcessed: number | null;
  /** Alert generation timestamp */
  lastAlertGeneration: number | null;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

/**
 * Initial state for DSQR domain
 */
const initialState: DSQRState = {
  rawData: null,
  processedData: null,
  currentFilter: null,
  config: defaultDSQRConfig,
  alerts: [],
  platformMetrics: {
    [DeliveryPlatform.DOORDASH]: null,
    [DeliveryPlatform.UBEREATS]: null,
    [DeliveryPlatform.GRUBHUB]: null
  },
  status: ApiStatus.IDLE,
  error: null,
  lastProcessed: null,
  lastAlertGeneration: null
};

// =============================================================================
// SLICE DEFINITION
// =============================================================================

/**
 * DSQR Domain Slice
 * Manages DSQR data processing and performance analysis
 */
export const dsqrSlice = createSlice({
  name: 'dsqr',
  initialState,
  reducers: {
    /**
     * Reset DSQR state
     */
    resetDSQRState: (state) => {
      Object.assign(state, initialState);
      console.log('[DSQR] State reset');
    },

    /**
     * Clear processing errors
     */
    clearDSQRError: (state) => {
      state.error = null;
      if (state.status === ApiStatus.FAILED) {
        state.status = ApiStatus.IDLE;
      }
    },

    /**
     * Update filter configuration
     */
    setDSQRFilter: (state, action: PayloadAction<DSQRFilter | null>) => {
      state.currentFilter = action.payload;
      console.log('[DSQR] Filter updated', action.payload);
    },

    /**
     * Update analysis configuration
     */
    updateDSQRConfig: (state, action: PayloadAction<Partial<DSQRAnalysisConfig>>) => {
      state.config = { ...state.config, ...action.payload };
      console.log('[DSQR] Configuration updated', action.payload);
      
      // Trigger reprocessing if data exists
      if (state.rawData) {
        state.status = ApiStatus.LOADING;
      }
    },

    /**
     * Dismiss specific alert
     */
    dismissAlert: (state, action: PayloadAction<number>) => {
      const alertIndex = action.payload;
      if (alertIndex >= 0 && alertIndex < state.alerts.length) {
        state.alerts.splice(alertIndex, 1);
        console.log('[DSQR] Alert dismissed', { alertIndex });
      }
    },

    /**
     * Clear all alerts
     */
    clearAllAlerts: (state) => {
      state.alerts = [];
      console.log('[DSQR] All alerts cleared');
    },

    /**
     * Manually trigger data reprocessing
     */
    reprocessDSQRData: (state) => {
      if (state.rawData) {
        state.status = ApiStatus.LOADING;
        state.error = null;
        console.log('[DSQR] Manual reprocessing triggered');
      }
    }
  },
  extraReducers: (builder) => {
    // Listen to API coordinator success actions
    builder
      .addCase(fetchDsprData.fulfilled, (state, action) => {
        try {
          state.status = ApiStatus.LOADING;
          state.error = null;
          
          const response = action.payload;
          const dsqrData = response.reports?.daily?.dailyDSQRData;
          
          if (dsqrData) {
            console.log('[DSQR] Processing new data from API', {
              hasScoreData: !!dsqrData.score,
              hasTrackingData: !!dsqrData.is_on_track,
              storeId: response['Filtering Values']?.store
            });
            
            // Store raw data
            state.rawData = dsqrData;
            
            // Process the data
            const processingResult = processDSQRData(
              dsqrData, 
              response['Filtering Values']?.store || 'unknown',
              response['Filtering Values']?.date || 'unknown',
              state.config
            );
            
            state.processedData = processingResult.processedData;
            state.alerts = processingResult.alerts;
            state.platformMetrics = processingResult.platformMetrics;
            state.lastProcessed = Date.now();
            state.lastAlertGeneration = Date.now();
            state.status = ApiStatus.SUCCEEDED;
            
            console.log('[DSQR] Data processing completed', {
              alertCount: state.alerts.length,
              overallPerformance: state.processedData?.overallSummary.overallPerformance || 0,
              bestPlatform: state.processedData?.overallSummary.bestPlatform,
              criticalAlerts: state.alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length
            });
            
          } else {
            state.status = ApiStatus.FAILED;
            state.error = 'DSQR data not found in API response';
            console.warn('[DSQR] No DSQR data found in API response');
          }
          
        } catch (error) {
          state.status = ApiStatus.FAILED;
          state.error = error instanceof Error ? error.message : 'Failed to process DSQR data';
          console.error('[DSQR] Processing error:', error);
        }
      })
      .addCase(refreshDsprData.fulfilled, (state, action) => {
        // Handle refresh the same way as initial fetch
        try {
          state.status = ApiStatus.LOADING;
          state.error = null;
          
          const response = action.payload;
          const dsqrData = response.reports?.daily?.dailyDSQRData;
          
          if (dsqrData) {
            console.log('[DSQR] Processing refreshed data');
            
            state.rawData = dsqrData;
            
            const processingResult = processDSQRData(
              dsqrData,
              response['Filtering Values']?.store || 'unknown',
              response['Filtering Values']?.date || 'unknown',
              state.config
            );
            
            state.processedData = processingResult.processedData;
            state.alerts = processingResult.alerts;
            state.platformMetrics = processingResult.platformMetrics;
            state.lastProcessed = Date.now();
            state.lastAlertGeneration = Date.now();
            state.status = ApiStatus.SUCCEEDED;
            
            console.log('[DSQR] Refresh processing completed');
            
          } else {
            state.status = ApiStatus.FAILED;
            state.error = 'DSQR data not found in refreshed response';
          }
          
        } catch (error) {
          state.status = ApiStatus.FAILED;
          state.error = error instanceof Error ? error.message : 'Failed to process refreshed DSQR data';
          console.error('[DSQR] Refresh processing error:', error);
        }
      })
      .addCase(fetchDsprData.pending, (state) => {
        state.status = ApiStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchDsprData.rejected, (state, _action) => {
        state.status = ApiStatus.FAILED;
        state.error = 'Failed to fetch DSPR data';
        state.rawData = null;
        state.processedData = null;
        state.alerts = [];
        state.platformMetrics = {
          [DeliveryPlatform.DOORDASH]: null,
          [DeliveryPlatform.UBEREATS]: null,
          [DeliveryPlatform.GRUBHUB]: null
        };
      });
  }
});

// =============================================================================
// ACTIONS EXPORT
// =============================================================================

export const {
  resetDSQRState,
  clearDSQRError,
  setDSQRFilter,
  updateDSQRConfig,
  dismissAlert,
  clearAllAlerts,
  reprocessDSQRData
} = dsqrSlice.actions;

// =============================================================================
// DATA PROCESSING FUNCTIONS
// =============================================================================

/**
 * Process raw DSQR data into analyzed format
 * @param rawData - Raw DSQR data from API
 * @param storeId - Store identifier
 * @param date - Business date
 * @param config - Analysis configuration
 * @returns Processed data with analysis
 */
function processDSQRData(
  rawData: DailyDSQRData,
  storeId: string,
  date: string,
  config: DSQRAnalysisConfig
) {
  console.log('[DSQR] Starting data processing', { storeId, date });

  // Process platform-specific metrics
  const platformMetrics = processPlatformMetrics(rawData, config);

  // Generate overall summary
  const overallSummary = generateOverallSummary(platformMetrics);

  // Generate alerts
  const alerts = generatePerformanceAlerts(rawData, platformMetrics, config);

  // Create processed data structure
  const processedData: ProcessedDSQRData = {
    storeId,
    date,
    platforms: {
      doorDash: platformMetrics[DeliveryPlatform.DOORDASH],
      uberEats: platformMetrics[DeliveryPlatform.UBEREATS],
      grubHub: platformMetrics[DeliveryPlatform.GRUBHUB]
    },
    overallSummary,
    alerts
  };

  return {
    processedData,
    platformMetrics,
    alerts
  };
}

/**
 * Process metrics for each delivery platform
 */
function processPlatformMetrics(
  rawData: DailyDSQRData,
  config: DSQRAnalysisConfig
): Record<DeliveryPlatform, PlatformMetrics> {
  const platforms: Record<DeliveryPlatform, PlatformMetrics> = {} as any;

  // Process DoorDash metrics
  platforms[DeliveryPlatform.DOORDASH] = processDoorDashMetrics(rawData, config);

  // Process UberEats metrics
  platforms[DeliveryPlatform.UBEREATS] = processUberEatsMetrics(rawData, config);

  // Process GrubHub metrics
  platforms[DeliveryPlatform.GRUBHUB] = processGrubHubMetrics(rawData, config);

  return platforms;
}

/**
 * Process DoorDash specific metrics
 */
function processDoorDashMetrics(
  rawData: DailyDSQRData,
  config: DSQRAnalysisConfig
): PlatformMetrics {
  const kpis = [
    {
      name: 'DD_Ratings_Average_Rating',
      label: 'Average Rating',
      value: rawData.score.DD_Ratings_Average_Rating,
      status: rawData.is_on_track.DD_NAOT_Ratings_Average_Rating,
      unit: MetricUnit.RATING,
      isCritical: config.criticalMetrics.includes('DD_Ratings_Average_Rating'),
      target: 4.5,
      trend: TrendDirection.STABLE
    },
    {
      name: 'DD_Cancellations_Sales_Lost',
      label: 'Sales Lost to Cancellations',
      value: rawData.score.DD_Cancellations_Sales_Lost,
      status: rawData.is_on_track.DD_NAOT_Cancellations_Sales_Lost,
      unit: MetricUnit.CURRENCY,
      isCritical: false,
      trend: TrendDirection.STABLE
    },
    {
      name: 'DD_Missing_or_Incorrect_Error_Charges',
      label: 'Error Charges',
      value: rawData.score.DD_Missing_or_Incorrect_Error_Charges,
      status: rawData.is_on_track.DD_NAOT_Missing_or_Incorrect_Error_Charges,
      unit: MetricUnit.CURRENCY,
      isCritical: false,
      trend: TrendDirection.STABLE
    },
    {
      name: 'DD_Avoidable_Wait_M_Sec',
      label: 'Avoidable Wait Time',
      value: rawData.score.DD_Avoidable_Wait_M_Sec,
      status: rawData.is_on_track.DD_NAOT_Avoidable_Wait_M_Sec,
      unit: MetricUnit.TIME_MINUTES,
      isCritical: false,
      target: 2.0,
      trend: TrendDirection.STABLE
    },
    {
      name: 'DD_Reviews_Responded',
      label: 'Review Response Rate',
      value: rawData.score.DD_Reviews_Responded,
      status: TrackingStatus.ON_TRACK, // Not tracked in API response
      unit: MetricUnit.PERCENTAGE,
      isCritical: false,
      target: 1.0,
      trend: TrendDirection.STABLE
    }
  ];

  const onTrackKPIs = kpis.filter(kpi => isOnTrack(kpi.status));
  const applicableKPIs = kpis.filter(kpi => kpi.status !== TrackingStatus.NOT_APPLICABLE);

  const performancePercentage = applicableKPIs.length > 0 
    ? (onTrackKPIs.length / applicableKPIs.length) * 100 
    : 0;

  return {
    platform: DeliveryPlatform.DOORDASH,
    overallRating: rawData.score.DD_Ratings_Average_Rating,
    kpis,
    onTrackCount: onTrackKPIs.length,
    totalApplicableMetrics: applicableKPIs.length,
    performancePercentage,
    performanceLevel: calculatePerformanceLevel(performancePercentage, config)
  };
}

/**
 * Process UberEats specific metrics
 */
function processUberEatsMetrics(
  rawData: DailyDSQRData,
  config: DSQRAnalysisConfig
): PlatformMetrics {
  const kpis = [
    {
      name: 'UE_Customer_reviews_overview',
      label: 'Customer Reviews',
      value: rawData.score.UE_Customer_reviews_overview,
      status: rawData.is_on_track.UE_NAOT_Customer_reviews_overview,
      unit: MetricUnit.RATING,
      isCritical: config.criticalMetrics.includes('UE_Customer_reviews_overview'),
      target: 4.0,
      trend: TrendDirection.STABLE
    },
    {
      name: 'UE_Cost_of_Refunds',
      label: 'Cost of Refunds',
      value: rawData.score.UE_Cost_of_Refunds,
      status: rawData.is_on_track.UE_NAOT_Cost_of_Refunds,
      unit: MetricUnit.CURRENCY,
      isCritical: false,
      trend: TrendDirection.STABLE
    },
    {
      name: 'UE_Unfulfilled_order_rate',
      label: 'Unfulfilled Order Rate',
      value: rawData.score.UE_Unfulfilled_order_rate,
      status: rawData.is_on_track.UE_NAOT_Unfulfilled_order_rate,
      unit: MetricUnit.PERCENTAGE,
      isCritical: false,
      target: 0.05,
      trend: TrendDirection.STABLE
    },
    {
      name: 'UE_Time_unavailable_during_open_hours_hh_mm',
      label: 'Unavailable Time',
      value: rawData.score.UE_Time_unavailable_during_open_hours_hh_mm,
      status: rawData.is_on_track.UE_NAOT_Time_unavailable_during_open_hours_hh_mm,
      unit: MetricUnit.TIME_HOURS,
      isCritical: false,
      target: 0,
      trend: TrendDirection.STABLE
    },
    {
      name: 'UE_Reviews_Responded',
      label: 'Review Response Rate',
      value: rawData.score.UE_Reviews_Responded,
      status: TrackingStatus.ON_TRACK, // Not tracked in API response
      unit: MetricUnit.PERCENTAGE,
      isCritical: false,
      target: 1.0,
      trend: TrendDirection.STABLE
    }
  ];

  const onTrackKPIs = kpis.filter(kpi => isOnTrack(kpi.status));
  const applicableKPIs = kpis.filter(kpi => kpi.status !== TrackingStatus.NOT_APPLICABLE);

  const performancePercentage = applicableKPIs.length > 0 
    ? (onTrackKPIs.length / applicableKPIs.length) * 100 
    : 0;

  return {
    platform: DeliveryPlatform.UBEREATS,
    overallRating: rawData.score.UE_Customer_reviews_overview,
    kpis,
    onTrackCount: onTrackKPIs.length,
    totalApplicableMetrics: applicableKPIs.length,
    performancePercentage,
    performanceLevel: calculatePerformanceLevel(performancePercentage, config)
  };
}

/**
 * Process GrubHub specific metrics
 */
function processGrubHubMetrics(
  rawData: DailyDSQRData,
  config: DSQRAnalysisConfig
): PlatformMetrics {
  const kpis = [
    {
      name: 'GH_Rating',
      label: 'Overall Rating',
      value: rawData.score.GH_Rating,
      status: rawData.is_on_track.GH_NAOT_Rating,
      unit: MetricUnit.RATING,
      isCritical: config.criticalMetrics.includes('GH_Rating'),
      target: 4.0,
      trend: TrendDirection.STABLE
    },
    {
      name: 'GH_Food_was_good',
      label: 'Food Quality Rating',
      value: rawData.score.GH_Food_was_good,
      status: rawData.is_on_track.GH_NAOT_Food_was_good,
      unit: MetricUnit.RATIO,
      isCritical: false,
      target: 0.8,
      trend: TrendDirection.STABLE
    },
    {
      name: 'GH_Delivery_was_on_time',
      label: 'On-Time Delivery Rating',
      value: rawData.score.GH_Delivery_was_on_time,
      status: rawData.is_on_track.GH_NAOT_Delivery_was_on_time,
      unit: MetricUnit.RATIO,
      isCritical: false,
      target: 0.9,
      trend: TrendDirection.STABLE
    },
    {
      name: 'GH_Order_was_accurate',
      label: 'Order Accuracy Rating',
      value: rawData.score.GH_Order_was_accurate,
      status: rawData.is_on_track.GH_NAOT_Order_was_accurate,
      unit: MetricUnit.RATIO,
      isCritical: false,
      target: 0.85,
      trend: TrendDirection.STABLE
    }
  ];

  const onTrackKPIs = kpis.filter(kpi => isOnTrack(kpi.status));
  const applicableKPIs = kpis.filter(kpi => kpi.status !== TrackingStatus.NOT_APPLICABLE);

  const performancePercentage = applicableKPIs.length > 0 
    ? (onTrackKPIs.length / applicableKPIs.length) * 100 
    : 0;

  return {
    platform: DeliveryPlatform.GRUBHUB,
    overallRating: rawData.score.GH_Rating,
    kpis,
    onTrackCount: onTrackKPIs.length,
    totalApplicableMetrics: applicableKPIs.length,
    performancePercentage,
    performanceLevel: calculatePerformanceLevel(performancePercentage, config)
  };
}

/**
 * Calculate performance level based on percentage
 */
function calculatePerformanceLevel(
  percentage: number,
  config: DSQRAnalysisConfig
): PerformanceLevel {
  const thresholds = config.performanceThresholds;
  
  if (percentage >= thresholds.excellent) return PerformanceLevel.EXCELLENT;
  if (percentage >= thresholds.good) return PerformanceLevel.GOOD;
  if (percentage >= thresholds.fair) return PerformanceLevel.FAIR;
  if (percentage >= thresholds.poor) return PerformanceLevel.POOR;
  return PerformanceLevel.CRITICAL;
}

/**
 * Generate overall performance summary
 */
function generateOverallSummary(platformMetrics: Record<DeliveryPlatform, PlatformMetrics>) {
  const platforms = Object.values(platformMetrics);
  const validPlatforms = platforms.filter(p => p.totalApplicableMetrics > 0);
  
  if (validPlatforms.length === 0) {
    return {
      averageRating: 0,
      totalOnTrack: 0,
      totalApplicable: 0,
      overallPerformance: 0,
      bestPlatform: DeliveryPlatform.DOORDASH,
      attentionRequired: DeliveryPlatform.DOORDASH,
      performanceGrade: PerformanceGrade.F
    };
  }

  const averageRating = validPlatforms.reduce((sum, p) => sum + p.overallRating, 0) / validPlatforms.length;
  const totalOnTrack = validPlatforms.reduce((sum, p) => sum + p.onTrackCount, 0);
  const totalApplicable = validPlatforms.reduce((sum, p) => sum + p.totalApplicableMetrics, 0);
  const overallPerformance = totalApplicable > 0 ? (totalOnTrack / totalApplicable) * 100 : 0;

  const bestPlatform = validPlatforms.reduce((best, current) => 
    current.performancePercentage > best.performancePercentage ? current : best
  ).platform;

  const attentionRequired = validPlatforms.reduce((worst, current) =>
    current.performancePercentage < worst.performancePercentage ? current : worst
  ).platform;

  const performanceGrade = calculatePerformanceGrade(overallPerformance);

  return {
    averageRating,
    totalOnTrack,
    totalApplicable,
    overallPerformance,
    bestPlatform,
    attentionRequired,
    performanceGrade
  };
}

/**
 * Calculate performance grade from percentage
 */
function calculatePerformanceGrade(percentage: number): PerformanceGrade {
  if (percentage >= 97) return PerformanceGrade.A_PLUS;
  if (percentage >= 93) return PerformanceGrade.A;
  if (percentage >= 90) return PerformanceGrade.B_PLUS;
  if (percentage >= 87) return PerformanceGrade.B;
  if (percentage >= 83) return PerformanceGrade.C_PLUS;
  if (percentage >= 80) return PerformanceGrade.C;
  if (percentage >= 70) return PerformanceGrade.D;
  return PerformanceGrade.F;
}

/**
 * Generate performance alerts based on metrics
 */
function generatePerformanceAlerts(
  _rawData: DailyDSQRData,
  platformMetrics: Record<DeliveryPlatform, PlatformMetrics>,
  config: DSQRAnalysisConfig
): PerformanceAlert[] {
  if (!config.alertConfig.enableAlerts) {
    return [];
  }

  const alerts: PerformanceAlert[] = [];

  // Check each platform for alerts
  Object.values(platformMetrics).forEach(platform => {
    platform.kpis.forEach(kpi => {
      if (!isOnTrack(kpi.status) && kpi.status !== TrackingStatus.NOT_APPLICABLE) {
        const alert = createPerformanceAlert(platform.platform, kpi, config);
        if (alert && config.alertConfig.includePriorities.includes(alert.priority)) {
          alerts.push(alert);
        }
      }
    });
  });

  // Sort alerts by priority and limit count
  const sortedAlerts = alerts
    .sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, config.alertConfig.maxAlerts);

  return sortedAlerts;
}

/**
 * Create performance alert for a specific KPI
 */
function createPerformanceAlert(
  platform: DeliveryPlatform,
  kpi: any,
  _config: DSQRAnalysisConfig
): PerformanceAlert | null {
  const severity = kpi.isCritical ? AlertSeverity.CRITICAL : AlertSeverity.WARNING;
  const priority = kpi.isCritical ? AlertPriority.HIGH : AlertPriority.MEDIUM;

  let message = `${platform} ${kpi.label} is not meeting targets`;
  const recommendations: string[] = [];

  // Platform-specific recommendations
  switch (platform) {
    case DeliveryPlatform.DOORDASH:
      if (kpi.name === 'DD_Ratings_Average_Rating') {
        recommendations.push('Focus on order accuracy and delivery speed');
        recommendations.push('Review recent customer feedback for improvement areas');
      }
      break;
    case DeliveryPlatform.UBEREATS:
      if (kpi.name === 'UE_Customer_reviews_overview') {
        recommendations.push('Improve food quality and packaging');
        recommendations.push('Reduce preparation time to maintain food temperature');
      }
      break;
    case DeliveryPlatform.GRUBHUB:
      if (kpi.name === 'GH_Rating') {
        recommendations.push('Enhance overall service quality');
        recommendations.push('Monitor order fulfillment process');
      }
      break;
  }

  if (recommendations.length === 0) {
    recommendations.push('Review operational procedures');
    recommendations.push('Monitor metric closely for improvement');
  }

  return {
    severity,
    platform,
    metric: kpi.name,
    message,
    currentValue: kpi.value,
    targetValue: kpi.target,
    recommendations,
    priority
  };
}

// =============================================================================
// SELECTORS
// =============================================================================

/**
 * Select complete DSQR state
 */
export const selectDSQRState = (state: { dsqr: DSQRState }) => state.dsqr;

/**
 * Select raw DSQR data
 */
export const selectRawDSQRData = (state: { dsqr: DSQRState }) => state.dsqr.rawData;

/**
 * Select processed DSQR data
 */
export const selectProcessedDSQRData = (state: { dsqr: DSQRState }) => state.dsqr.processedData;

/**
 * Select platform metrics with filtering
 */
export const selectFilteredPlatformMetrics = createSelector(
  [
    (state: { dsqr: DSQRState }) => state.dsqr.platformMetrics,
    (state: { dsqr: DSQRState }) => state.dsqr.currentFilter
  ],
  (platformMetrics, filter) => {
    if (!filter) return platformMetrics;

    const filtered: Record<DeliveryPlatform, PlatformMetrics | null> = {} as any;

    Object.entries(platformMetrics).forEach(([platform, metrics]) => {
      if (filter.platforms && !filter.platforms.includes(platform as DeliveryPlatform)) {
        filtered[platform as DeliveryPlatform] = null;
        return;
      }

      if (metrics) {
        let filteredMetrics = { ...metrics };

        if (filter.minRating && metrics.overallRating < filter.minRating) {
          filtered[platform as DeliveryPlatform] = null;
          return;
        }

        if (filter.offTrackOnly) {
          filteredMetrics.kpis = filteredMetrics.kpis.filter(kpi => !isOnTrack(kpi.status));
        }

        if (filter.criticalOnly) {
          filteredMetrics.kpis = filteredMetrics.kpis.filter(kpi => kpi.isCritical);
        }

        filtered[platform as DeliveryPlatform] = filteredMetrics;
      } else {
        filtered[platform as DeliveryPlatform] = null;
      }
    });

    return filtered;
  }
);

/**
 * Select performance alerts
 */
export const selectPerformanceAlerts = (state: { dsqr: DSQRState }) => state.dsqr.alerts;

/**
 * Select critical alerts only
 */
export const selectCriticalAlerts = createSelector(
  [selectPerformanceAlerts],
  (alerts) => alerts.filter(alert => alert.severity === AlertSeverity.CRITICAL)
);

/**
 * Select DSQR loading state
 */
export const selectDSQRLoading = (state: { dsqr: DSQRState }) => 
  state.dsqr.status === ApiStatus.LOADING;

/**
 * Select DSQR error
 */
export const selectDSQRError = (state: { dsqr: DSQRState }) => state.dsqr.error;

/**
 * Select overall performance summary
 */
export const selectOverallSummary = (state: { dsqr: DSQRState }) => 
  state.dsqr.processedData?.overallSummary;

/**
 * Select best performing platform
 */
export const selectBestPlatform = createSelector(
  [selectOverallSummary],
  (summary) => summary?.bestPlatform
);

/**
 * Select platform requiring attention
 */
export const selectAttentionRequired = createSelector(
  [selectOverallSummary],
  (summary) => summary?.attentionRequired
);

// =============================================================================
// SLICE EXPORT
// =============================================================================

export default dsqrSlice.reducer;
