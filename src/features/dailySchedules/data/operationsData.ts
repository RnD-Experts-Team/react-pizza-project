import type { Operation } from '../types/scheduler.types';

/**
 * Mock operations data for operation segmentation
 * In a real application, this would come from an API endpoint
 */
export const operationsData: Operation[] = [
  {
    id: 'op1',
    name: 'Food Preparation',
    description: 'Preparing ingredients and cooking food items',
    color: '#3498db'
  },
  {
    id: 'op2',
    name: 'Customer Service',
    description: 'Taking orders and serving customers',
    color: '#e74c3c'
  },
  {
    id: 'op3',
    name: 'Cleaning & Maintenance',
    description: 'Cleaning equipment and maintaining workspace',
    color: '#2ecc71'
  },
  {
    id: 'op4',
    name: 'Inventory Management',
    description: 'Managing stock and supplies',
    color: '#f39c12'
  },
  {
    id: 'op5',
    name: 'Cash Handling',
    description: 'Processing payments and managing cash register',
    color: '#9b59b6'
  },
  {
    id: 'op6',
    name: 'Training',
    description: 'Training new employees or learning new skills',
    color: '#1abc9c'
  },
  {
    id: 'op7',
    name: 'Administrative Tasks',
    description: 'Paperwork, scheduling, and administrative duties',
    color: '#e67e22'
  },
  {
    id: 'op8',
    name: 'Break Time',
    description: 'Scheduled break or meal time',
    color: '#95a5a6'
  }
];