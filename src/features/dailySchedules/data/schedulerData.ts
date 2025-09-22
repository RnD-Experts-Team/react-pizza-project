import { DayPilot } from '@daypilot/daypilot-lite-react';
import type { ExtendedEventData, Employee, Store, Status } from '../types/scheduler.types';

/**
 * Static data for the scheduler application
 * In a real application, this data would typically come from API endpoints
 */

export const statusesData: Status[] = [
  { id: '1', name: 'Scheduled' },
  { id: '2', name: 'In Progress' },
  { id: '3', name: 'Completed' },
  { id: '4', name: 'Cancelled' },
  { id: '5', name: 'No Show' }
];

export const storesData: Store[] = [
  { id: 'store1', name: 'Downtown Store' },
  { id: 'store2', name: 'Mall Location' },
  { id: 'store3', name: 'Airport Branch' },
  { id: 'store4', name: 'Suburban Center' }
];

export const employeesData: Employee[] = [
  { id: 'emp1', name: 'Alice Johnson', storeId: 'store1', color: '#3498db' },
  { id: 'emp2', name: 'Bob Smith', storeId: 'store1', color: '#e74c3c' },
  { id: 'emp3', name: 'Carol Davis', storeId: 'store2', color: '#2ecc71' },
  { id: 'emp4', name: 'David Wilson', storeId: 'store2', color: '#f39c12' },
  { id: 'emp5', name: 'Eva Brown', storeId: 'store3', color: '#9b59b6' },
  { id: 'emp6', name: 'Frank Miller', storeId: 'store3', color: '#1abc9c' },
  { id: 'emp7', name: 'Grace Lee', storeId: 'store4', color: '#e67e22' },
  { id: 'emp8', name: 'Henry Taylor', storeId: 'store4', color: '#34495e' }
];

export const originalEventData: ExtendedEventData[] = [
  {
    id: 'event1',
    text: 'Morning Shift',
    start: DayPilot.Date.today().addHours(9),
    end: DayPilot.Date.today().addHours(17),
    resource: 'emp1',
    barColor: '#3498db',
    description: 'Regular morning shift',
    status: 'Confirmed',
    priority: 'High'
  },
  {
    id: 'event2',
    text: 'Training Session',
    start: DayPilot.Date.today().addDays(1).addHours(10),
    end: DayPilot.Date.today().addDays(1).addHours(12),
    resource: 'emp2',
    barColor: '#e74c3c',
    description: 'New employee training',
    status: 'Scheduled',
    priority: 'Medium'
  },
  {
    id: 'event3',
    text: 'Customer Meeting',
    start: DayPilot.Date.today().addDays(2).addHours(14),
    end: DayPilot.Date.today().addDays(2).addHours(16),
    resource: 'emp3',
    barColor: '#2ecc71',
    description: 'Important client presentation',
    status: 'Confirmed',
    priority: 'High'
  }
];