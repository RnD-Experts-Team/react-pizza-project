/**
 * View Employee Page
 *
 * This page displays detailed information about an employee including personal details,
 * store assignment, status, skills, employment info, schedule preferences, and provides
 * actions for editing and managing employee skills with A+/A/B/C/D rating system.
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { useSkills } from '../../skills/hooks/useSkills';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  User,
  Building2,
  Calendar,
  Users,
  Car,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  MoreHorizontal,
  Trash2,
  Trophy,
  Clock,
  DollarSign,
  Briefcase,
  CalendarDays,
  Shirt,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee, EmployeeStatus, SkillRating, Skill } from '../types';

// ============================================================================
// Component Types
// ============================================================================

interface ViewEmployeePageProps {
  className?: string;
}

interface AttachSkillDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onSkillAttached: () => void;
}

interface SkillTableRowProps {
  employeeSkill: Skill;
  onUpdateRating: (skillId: number, newRating: string) => void;
  onRemoveSkill: (skillId: number) => void;
}

interface EmployeeInfoCardProps {
  employee: Employee;
  onEdit: () => void;
}

// Valid skill ratings as per backend

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Status badge component with visual indicators
 */
const StatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
  const getStatusVariant = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Suspension':
        return 'secondary';
      case 'Terminated':
        return 'destructive';
      case 'On Leave':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return '🟢';
      case 'Suspension':
        return '🟡';
      case 'Terminated':
        return '🔴';
      case 'On Leave':
        return '🟠';
      default:
        return '⚪';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className="gap-1">
      <span className="text-xs">{getStatusIcon(status)}</span>
      {status}
    </Badge>
  );
};

/**
 * Skill rating display component with letter grades
 */
const SkillRatingBadge: React.FC<{
  rating: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, size = 'sm' }) => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+':
        return 'bg-green-600 text-white';
      case 'A':
        return 'bg-green-500 text-white';
      case 'B':
        return 'bg-blue-500 text-white';
      case 'C':
        return 'bg-yellow-500 text-white';
      case 'D':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRatingDescription = (rating: string) => {
    switch (rating) {
      case 'A+':
        return 'Exceptional';
      case 'A':
        return 'Excellent';
      case 'B':
        return 'Good';
      case 'C':
        return 'Satisfactory';
      case 'D':
        return 'Needs Improvement';
      default:
        return 'Unknown';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        className={cn(
          getRatingColor(rating),
          sizeClasses[size],
          'font-mono font-bold',
        )}
      >
        {rating}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {getRatingDescription(rating)}
      </span>
    </div>
  );
};

/**
 * Employee information card with all details
 */
const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({
  employee,
  onEdit,
}) => {
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const getEmployeeAge = useCallback((dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">{employee.full_name}</CardTitle>
              <CardDescription>Employee ID: {employee.id}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={employee.status} />
            <Button onClick={onEdit} size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Employee
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date of Birth
            </div>
            <div className="text-sm">
              <div>{formatDate(employee.date_of_birth)}</div>
              <div className="text-muted-foreground">
                Age: {getEmployeeAge(employee.date_of_birth)} years old
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Store Assignment
            </div>
            <div className="text-sm">
              <div className="font-medium">{employee.store.name}</div>
              <div className="text-muted-foreground">
                Store #{employee.store.number} • ID: {employee.store_id}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Employment Info
            </div>
            <div className="text-sm">
              <div>Created: {formatDate(employee.created_at)}</div>
              <div className="text-muted-foreground">
                Updated: {formatDate(employee.updated_at)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Employee Attributes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employee Attributes
          </h4>
          <div className="flex flex-wrap gap-2">
            {employee.has_family && (
              <Badge variant="outline" className="gap-1">
                👨‍👩‍👧‍👦 Has Family
              </Badge>
            )}
            {employee.has_car && (
              <Badge variant="outline" className="gap-1">
                <Car className="h-3 w-3" />
                Has Car
              </Badge>
            )}
            {employee.is_arabic_team && (
              <Badge variant="outline" className="gap-1">
                🗣️ Arabic Team
              </Badge>
            )}
            {!employee.has_family &&
              !employee.has_car &&
              !employee.is_arabic_team && (
                <span className="text-sm text-muted-foreground">
                  No special attributes
                </span>
              )}
          </div>
        </div>

        {/* Employment Details */}
        {employee.employment_info && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Compensation
                  </div>
                  <div>
                    Base Pay:{' '}
                    <span className="font-medium">
                      ${employee.employment_info.base_pay}
                    </span>
                  </div>
                  <div>
                    Performance Pay:{' '}
                    <span className="font-medium">
                      ${employee.employment_info.performance_pay}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    Employment Type
                  </div>
                  <div>
                    <Badge variant="outline">
                      {employee.employment_info.employment_type}
                    </Badge>
                  </div>
                  {employee.employment_info.hired_date && (
                    <div className="text-muted-foreground">
                      Hired: {formatDate(employee.employment_info.hired_date)}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    Additional Info
                  </div>
                  {employee.employment_info.paychex_ids?.length > 0 && (
                    <div>
                      Paychex IDs:{' '}
                      <span className="font-medium">
                        {employee.employment_info.paychex_ids.join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Shirt className="h-3 w-3" />
                    <span>
                      Uniform:{' '}
                      {employee.employment_info.has_uniform ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Schedule Preferences */}
        {employee.schedule_preferences &&
          employee.schedule_preferences.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Schedule Preferences
                </h4>
                <div className="space-y-3">
                  {employee.schedule_preferences.map((preference) => (
                    <div
                      key={preference.id}
                      className="rounded-lg border p-3 space-y-2"
                    >
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">Maximum Hours:</span>
                          <span className="ml-2">
                            {preference.maximum_hours}h
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Employment Type:</span>
                          <Badge variant="outline" className="ml-2">
                            {preference.employment_type}
                          </Badge>
                        </div>
                      </div>
                      {preference.preference_id && (
                        <div className="text-xs text-muted-foreground">
                          Preference ID: {preference.preference_id}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        {/* Notes */}
        {employee.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes
              </h4>
              <div className="text-sm bg-muted/50 rounded-lg p-3">
                {employee.notes}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Skill table row component with letter grade ratings
 */
const SkillTableRow: React.FC<SkillTableRowProps> = ({
  employeeSkill,
  onUpdateRating,
  onRemoveSkill,
}) => {
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [newRating, setNewRating] = useState(employeeSkill.pivot.rating);

  const validRatings: SkillRating[] = ['A+', 'A', 'B', 'C', 'D'];

  const handleSaveRating = () => {
    if (
      newRating !== employeeSkill.pivot.rating &&
      validRatings.includes(newRating as SkillRating)
    ) {
      onUpdateRating(employeeSkill.id, newRating);
    }
    setIsEditingRating(false);
  };

  const handleCancelEdit = () => {
    setNewRating(employeeSkill.pivot.rating);
    setIsEditingRating(false);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{employeeSkill.name}</div>
            {employeeSkill.slug && (
              <div className="text-sm text-muted-foreground">
                Slug: {employeeSkill.slug}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        {/* Category not available in current Skill interface */}
      </TableCell>

      <TableCell>
        {isEditingRating ? (
          <div className="flex items-center gap-2">
            <Select
              value={newRating}
              onValueChange={(value) => setNewRating(value as SkillRating)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validRatings.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    <div className="flex items-center gap-2">
                      <SkillRatingBadge rating={rating} size="sm" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSaveRating}>
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              ✕
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingRating(true)}
            className="hover:bg-muted rounded p-1 transition-colors"
          >
            <SkillRatingBadge rating={employeeSkill.pivot.rating} />
          </button>
        )}
      </TableCell>

      <TableCell>
        <div className="text-sm space-y-1">
          <div>
            Created:{' '}
            {new Date(employeeSkill.pivot.created_at).toLocaleDateString()}
          </div>
          <div className="text-muted-foreground">
            Updated:{' '}
            {new Date(employeeSkill.pivot.updated_at).toLocaleDateString()}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setIsEditingRating(true)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Rating
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRemoveSkill(employeeSkill.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Skill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

/**
 * Attach skill dialog component with letter grade ratings
 */
const AttachSkillDialog: React.FC<AttachSkillDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  onSkillAttached,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [rating, setRating] = useState<SkillRating>('B');
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);

  const validRatings: SkillRating[] = ['A+', 'A', 'B', 'C', 'D'];
  const { skills, loading: skillsLoading, fetchSkills } = useSkills();
  const { actions: employeeActions } = useEmployees();

  // Fetch skills when dialog opens
  useEffect(() => {
    if (isOpen && skills.length === 0) {
      fetchSkills();
    }
  }, [isOpen, skills.length, fetchSkills]);

  // Filter out skills that employee already has
  const availableSkills = useMemo(() => {
    const employeeSkillIds = employee.skills.map((es) => es.id);
    return skills.filter((skill) => !employeeSkillIds.includes(skill.id));
  }, [skills, employee.skills]);

  const handleAttachSkill = async () => {
    if (!selectedSkillId || !rating) return;

    try {
      setIsAttaching(true);
      setAttachError(null);

      const skillId = parseInt(selectedSkillId, 10);

      await employeeActions.attachSkill(employee.id, skillId, {
        rating: rating,
      });

      // Reset form and close dialog
      setSelectedSkillId('');
      setRating('B');
      onOpenChange(false);
      onSkillAttached();
    } catch (error: any) {
      console.error('Error attaching skill:', error);
      setAttachError(error.message || 'Failed to attach skill');
    } finally {
      setIsAttaching(false);
    }
  };

  const handleClose = () => {
    setSelectedSkillId('');
    setRating('B');
    setAttachError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Skill to Employee</DialogTitle>
          <DialogDescription>
            Add a new skill to {employee.full_name}'s skill set with an initial
            rating.
          </DialogDescription>
        </DialogHeader>

        {attachError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{attachError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-select">Select Skill</Label>
            <Select
              value={selectedSkillId}
              onValueChange={setSelectedSkillId}
              disabled={isAttaching || skillsLoading.list}
            >
              <SelectTrigger id="skill-select">
                <SelectValue placeholder="Choose a skill..." />
              </SelectTrigger>
              <SelectContent>
                {skillsLoading.list ? (
                  <SelectItem value="loading" disabled>
                    Loading skills...
                  </SelectItem>
                ) : availableSkills.length === 0 ? (
                  <SelectItem value="no-skills" disabled>
                    No skills available
                  </SelectItem>
                ) : (
                  availableSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id.toString()}>
                      <span className="font-medium">{skill.name}</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating-select">Initial Rating</Label>
            <Select
              value={rating}
              onValueChange={(value) => setRating(value as SkillRating)}
              disabled={isAttaching}
            >
              <SelectTrigger id="rating-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validRatings.map((ratingValue) => (
                  <SelectItem key={ratingValue} value={ratingValue}>
                    <div className="flex items-center gap-2 w-full">
                      <SkillRatingBadge rating={ratingValue} size="sm" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAttaching}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAttachSkill}
            disabled={
              !selectedSkillId ||
              !rating ||
              isAttaching ||
              availableSkills.length === 0
            }
            className="gap-2"
          >
            {isAttaching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Attaching...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Attach Skill
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const ViewEmployeePage: React.FC<ViewEmployeePageProps> = ({ className }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? parseInt(id, 10) : null;

  // Local state
  const [isAttachSkillDialogOpen, setIsAttachSkillDialogOpen] = useState(false);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Hooks
  const { currentEmployee, loading, errors, actions } = useEmployees();

  // ========================================================================
  // Memoized callbacks
  // ========================================================================

  const fetchEmployeeData = useCallback(() => {
    if (employeeId && !hasInitialFetch && !loading.fetchById.isLoading) {
      console.log('Fetching employee data for ID:', employeeId);
      setHasInitialFetch(true);
      actions.fetchEmployeeById(employeeId);
    }
  }, [employeeId, hasInitialFetch, loading.fetchById.isLoading, actions]);

  // ========================================================================
  // Computed Values
  // ========================================================================

  const hasCorrectEmployee = useMemo(() => {
    return currentEmployee !== null && currentEmployee.id === employeeId;
  }, [currentEmployee, employeeId]);

  // ========================================================================
  // Effects
  // ========================================================================

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  // Reset state when employee ID changes
  useEffect(() => {
    setHasInitialFetch(false);
  }, [employeeId]);

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleBack = useCallback(() => {
    navigate('/employees/store');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (employeeId) {
      navigate(`/employees/${employeeId}/edit`);
    }
  }, [navigate, employeeId]);

  const handleUpdateSkillRating = useCallback(
    async (skillId: number, newRating: string) => {
      if (!employeeId) return;

      try {
        await actions.updateSkill(employeeId, skillId, {
          rating: newRating as SkillRating,
        });
        // Refresh employee data to show updated rating
        actions.fetchEmployeeById(employeeId);
      } catch (error) {
        console.error('Failed to update skill rating:', error);
      }
    },
    [employeeId, actions],
  );

  const handleRemoveSkill = useCallback(
    async (skillId: number) => {
      if (!employeeId || !currentEmployee) return;

      const skill = currentEmployee.skills.find((s) => s.id === skillId);
      if (!skill) return;

      const confirmed = window.confirm(
        `Are you sure you want to remove "${skill.name}" from ${currentEmployee.full_name}'s skills?`,
      );

      if (confirmed) {
        try {
          await actions.detachSkill(employeeId, skillId);
          // Refresh employee data to show updated skills
          actions.fetchEmployeeById(employeeId);
        } catch (error) {
          console.error('Failed to remove skill:', error);
        }
      }
    },
    [employeeId, currentEmployee, actions],
  );

  const handleSkillAttached = useCallback(() => {
    if (employeeId) {
      // Refresh employee data to show new skill
      actions.fetchEmployeeById(employeeId);
    }
  }, [employeeId, actions]);

  // ========================================================================
  // Render Methods
  // ========================================================================

  const renderPageHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employees
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <p className="text-muted-foreground">
            {hasCorrectEmployee && currentEmployee
              ? `Viewing: ${currentEmployee.full_name}`
              : 'View employee information'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSkillsSection = () => {
    if (!currentEmployee) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Employee Skills
              </CardTitle>
              <CardDescription>
                Skills and competencies for {currentEmployee.full_name} with
                letter grade ratings
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAttachSkillDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Attach Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentEmployee.skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Skills Assigned</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                This employee doesn't have any skills assigned yet. Attach
                skills to track their competencies with A+ through D ratings.
              </p>
              <Button
                onClick={() => setIsAttachSkillDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Attach First Skill
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEmployee.skills.map((employeeSkill) => (
                    <SkillTableRow
                      key={employeeSkill.id}
                      employeeSkill={employeeSkill}
                      onUpdateRating={handleUpdateSkillRating}
                      onRemoveSkill={handleRemoveSkill}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ========================================================================
  // Loading and Error States
  // ========================================================================

  if (!employeeId) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid employee ID. Please select a valid employee to view.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading.fetchById.isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        {renderPageHeader()}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errors.fetchById.hasError) {
    return (
      <div className={cn('space-y-6', className)}>
        {renderPageHeader()}
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.fetchById.message ||
                  'Failed to load employee data. Please try again.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasCorrectEmployee || !currentEmployee) {
    return (
      <div className={cn('space-y-6', className)}>
        {renderPageHeader()}
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Employee not found. The employee may have been deleted or you
                may not have permission to view it.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========================================================================
  // Main Render
  // ========================================================================

  return (
    <div className={cn('space-y-6', className)}>
      {renderPageHeader()}

      {/* Employee Information */}
      <EmployeeInfoCard employee={currentEmployee} onEdit={handleEdit} />

      {/* Skills Section */}
      {renderSkillsSection()}

      {/* Attach Skill Dialog */}
      <AttachSkillDialog
        isOpen={isAttachSkillDialogOpen}
        onOpenChange={setIsAttachSkillDialogOpen}
        employee={currentEmployee}
        onSkillAttached={handleSkillAttached}
      />
    </div>
  );
};

export default ViewEmployeePage;
