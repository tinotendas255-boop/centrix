/**
 * AccessGuard Enterprise Context & Reactive State Engine
 * Handles persistent storage, role-based views, risk re-evaluation,
 * campaign review pipelines, audit logging, and corrective action workflows.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  CurrentUser,
  UserRole,
  Employee,
  Application,
  RecertificationCampaign,
  RecertificationReviewItem,
  SecurityViolation,
  ApprovalWorkflow,
  CorrectiveAction,
  AuditRecord,
  AppNotification,
  PermissionAssignment,
  ReviewDecision,
  ActionStatus,
  PermissionLevel
} from '../types';
import {
  INITIAL_EMPLOYEES,
  APPLICATIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_REVIEWS,
  INITIAL_APPROVAL_WORKFLOWS,
  INITIAL_CORRECTIVE_ACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEMO_USERS,
  DEPARTMENTS
} from '../data/initialData';
import { analyzeEmployeeRisk, SOD_RULES } from '../utils/riskEngine';

const STORAGE_KEY_PREFIX = 'accessguard_v1_';

interface AccessGuardContextType {
  // Current user & role
  currentUser: CurrentUser;
  switchUser: (role: UserRole) => void;
  availableDemoUsers: CurrentUser[];

  // Navigation & Modals
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;

  // Selected Entities for Detail Views
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;

  // Domain Collections
  employees: Employee[];
  applications: Application[];
  campaigns: RecertificationCampaign[];
  reviewItems: RecertificationReviewItem[];
  violations: SecurityViolation[];
  approvalWorkflows: ApprovalWorkflow[];
  correctiveActions: CorrectiveAction[];
  auditLogs: AuditRecord[];
  notifications: AppNotification[];

  // Real-time Calculated Metrics
  metrics: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    totalConnectedApps: number;
    totalAssignedPermissions: number;
    recertificationCompletionRate: number;
    pendingReviewsCount: number;
    overdueReviewsCount: number;
    criticalViolationsCount: number;
    highRiskIdentitiesCount: number;
    outstandingCorrectiveActionsCount: number;
    riskDistribution: {
      critical: number;
      high: number;
      moderate: number;
      low: number;
    };
    departmentRiskStats: {
      department: string;
      totalUsers: number;
      avgRiskScore: number;
      violationsCount: number;
    }[];
  };

  // Actions
  createEmployee: (emp: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deactivateEmployee: (id: string, reason: string) => void;
  importEmployees: (newEmps: Employee[]) => void;
  
  createApplication: (app: Partial<Application>) => void;

  grantPermission: (employeeId: string, permission: Omit<PermissionAssignment, 'id'>) => void;
  revokePermission: (employeeId: string, permissionId: string, justification: string) => void;
  modifyPermission: (employeeId: string, permissionId: string, newLevel: PermissionLevel, newEntitlements: string[], justification: string) => void;

  createCampaign: (campaign: Omit<RecertificationCampaign, 'id' | 'campaignCode' | 'totalReviewItems' | 'completedReviewItems' | 'revokedReviewItems' | 'modifiedReviewItems' | 'escalatedReviewItems' | 'createdDate'>) => void;
  submitReviewDecision: (reviewId: string, decision: ReviewDecision, justification?: string, modifiedPrivileges?: string[], escalateTo?: string) => void;
  bulkCertifyReviews: (reviewIds: string[], justification: string) => void;

  createCorrectiveAction: (action: Omit<CorrectiveAction, 'id' | 'actionCode'>) => void;
  updateCorrectiveActionStatus: (id: string, status: ActionStatus, resolutionNotes?: string) => void;
  executeRemediation: (actionId: string) => void;

  approveWorkflowStep: (workflowId: string, stepNumber: number, comments?: string) => void;
  rejectWorkflowStep: (workflowId: string, stepNumber: number, comments?: string) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
}

const AccessGuardContext = createContext<AccessGuardContextType | undefined>(undefined);

export const AccessGuardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state (defaults to Super Administrator Alexander Jenaya)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user`);
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Persistent Domain Collections
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}employees`);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
    return saved ? JSON.parse(saved) : APPLICATIONS;
  });

  const [campaigns, setCampaigns] = useState<RecertificationCampaign[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}campaigns`);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [reviewItems, setReviewItems] = useState<RecertificationReviewItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}workflows`);
    return saved ? JSON.parse(saved) : INITIAL_APPROVAL_WORKFLOWS;
  });

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}corrective_actions`);
    return saved ? JSON.parse(saved) : INITIAL_CORRECTIVE_ACTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Save to localStorage whenever collections change
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}employees`, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}campaigns`, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}reviews`, JSON.stringify(reviewItems));
  }, [reviewItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}workflows`, JSON.stringify(approvalWorkflows));
  }, [approvalWorkflows]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}corrective_actions`, JSON.stringify(correctiveActions));
  }, [correctiveActions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Dynamic Violations Engine: Re-evaluated whenever employees or applications change
  const violations = useMemo<SecurityViolation[]>(() => {
    const allViolations: SecurityViolation[] = [];
    employees.forEach(emp => {
      const result = analyzeEmployeeRisk(emp, applications, SOD_RULES);
      result.violations.forEach(v => allViolations.push(v));
    });
    return allViolations;
  }, [employees, applications]);

  // Compute live executive metrics from real data
  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.employmentStatus === 'ACTIVE').length;
    const inactiveEmployees = employees.filter(e => e.employmentStatus === 'TERMINATED' || e.employmentStatus === 'RESIGNED' || e.employmentStatus === 'SUSPENDED').length;
    const totalConnectedApps = applications.length;

    let totalAssignedPermissions = 0;
    employees.forEach(e => {
      totalAssignedPermissions += e.permissions.filter(p => p.level !== 'NO_ACCESS').length;
    });

    const totalReviews = reviewItems.length;
    const completedReviews = reviewItems.filter(r => r.decision !== 'PENDING').length;
    const pendingReviewsCount = reviewItems.filter(r => r.decision === 'PENDING').length;
    const overdueReviewsCount = reviewItems.filter(r => r.decision === 'PENDING' && r.isOverdue).length;
    const recertificationCompletionRate = totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 100;

    const criticalViolationsCount = violations.filter(v => v.severity === 'CRITICAL').length;
    const highRiskIdentitiesCount = employees.filter(e => e.riskLevel === 'CRITICAL' || e.riskLevel === 'HIGH').length;
    const outstandingCorrectiveActionsCount = correctiveActions.filter(a => a.status === 'OPEN' || a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS').length;

    const riskDistribution = {
      critical: employees.filter(e => e.riskLevel === 'CRITICAL').length,
      high: employees.filter(e => e.riskLevel === 'HIGH').length,
      moderate: employees.filter(e => e.riskLevel === 'MODERATE').length,
      low: employees.filter(e => e.riskLevel === 'LOW').length
    };

    // Department Risk Breakdown
    const departmentRiskStats = DEPARTMENTS.map(dept => {
      const deptEmployees = employees.filter(e => e.department === dept.name || e.departmentId === dept.id);
      const totalUsers = deptEmployees.length;
      const sumRisk = deptEmployees.reduce((acc, curr) => acc + curr.riskScore, 0);
      const avgRiskScore = totalUsers > 0 ? Math.round(sumRisk / totalUsers) : 0;
      const deptViolations = violations.filter(v => v.employeeDepartment === dept.name).length;

      return {
        department: dept.name,
        totalUsers,
        avgRiskScore,
        violationsCount: deptViolations
      };
    });

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalConnectedApps,
      totalAssignedPermissions,
      recertificationCompletionRate,
      pendingReviewsCount,
      overdueReviewsCount,
      criticalViolationsCount,
      highRiskIdentitiesCount,
      outstandingCorrectiveActionsCount,
      riskDistribution,
      departmentRiskStats
    };
  }, [employees, applications, reviewItems, violations, correctiveActions]);

  // Logging Helper
  const logAudit = (
    action: string,
    category: AuditRecord['category'],
    description: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    targetEmployee?: { id: string; name: string },
    targetApp?: { id: string; name: string },
    prevVal?: string,
    newVal?: string
  ) => {
    const record: AuditRecord = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      category,
      targetEmployeeId: targetEmployee?.id,
      targetEmployeeName: targetEmployee?.name,
      targetApplicationId: targetApp?.id,
      targetApplicationName: targetApp?.name,
      previousValue: prevVal,
      newValue: newVal,
      description,
      ipAddress: '192.168.10.24',
      severity
    };
    setAuditLogs(prev => [record, ...prev]);
  };

  // User Switcher
  const switchUser = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    logAudit(
      'ROLE_SWITCH',
      'AUTHENTICATION',
      `Simulated active user switch to ${user.name} (${user.roleLabel}).`,
      'INFO'
    );
  };

  // Re-calculate risk score on an updated employee
  const recalculateEmployeeRisk = (emp: Employee): Employee => {
    const analysis = analyzeEmployeeRisk(emp, applications, SOD_RULES);
    return {
      ...emp,
      riskScore: analysis.score,
      riskLevel: analysis.level,
      riskFactors: analysis.factors
    };
  };

  // Employee Management
  const createEmployee = (empData: Partial<Employee>) => {
    const empId = `emp-${Date.now().toString().slice(-4)}`;
    const empNum = `JFS-${(employees.length + 10).toString().padStart(4, '0')}`;
    const newEmp: Employee = {
      id: empId,
      employeeNumber: empNum,
      firstName: empData.firstName || 'New',
      lastName: empData.lastName || 'Staff',
      fullName: `${empData.firstName || 'New'} ${empData.lastName || 'Staff'}`,
      email: empData.email || `user.${empId}@jenaya-finance.co.zw`,
      department: empData.department || 'Banking Operations & Treasury',
      departmentId: empData.departmentId || 'dept-bnk',
      branch: empData.branch || 'Harare Main Branch (Headquarters)',
      branchId: empData.branchId || 'br-hre-main',
      jobTitle: empData.jobTitle || 'Associate Officer',
      employmentStatus: empData.employmentStatus || 'ACTIVE',
      managerId: empData.managerId || 'emp-mgr-02',
      managerName: empData.managerName || 'Tatenda Mutembedza',
      dateOfEmployment: empData.dateOfEmployment || new Date().toISOString().slice(0, 10),
      lastLoginDate: new Date().toISOString(),
      assignedApplications: empData.assignedApplications || ['app-collab'],
      permissions: empData.permissions || [],
      riskScore: 0,
      riskLevel: 'LOW',
      riskFactors: [],
      lastAccessReviewDate: new Date().toISOString().slice(0, 10),
      isPrivilegedUser: false
    };

    const evaluated = recalculateEmployeeRisk(newEmp);
    setEmployees(prev => [evaluated, ...prev]);

    logAudit(
      'EMPLOYEE_CREATED',
      'EMPLOYEE',
      `Provisioned new employee record ${evaluated.fullName} (${evaluated.employeeNumber}) in ${evaluated.department}.`,
      'INFO',
      { id: evaluated.id, name: evaluated.fullName }
    );
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id !== id) return emp;
        const updated = recalculateEmployeeRisk({ ...emp, ...updates });
        logAudit(
          'EMPLOYEE_UPDATED',
          'EMPLOYEE',
          `Updated employee details for ${updated.fullName}.`,
          'INFO',
          { id: updated.id, name: updated.fullName }
        );
        return updated;
      })
    );
  };

  const deactivateEmployee = (id: string, reason: string) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id !== id) return emp;
        const updatedEmp: Employee = {
          ...emp,
          employmentStatus: 'TERMINATED',
          terminationDate: new Date().toISOString().slice(0, 10)
        };
        const evaluated = recalculateEmployeeRisk(updatedEmp);
        logAudit(
          'EMPLOYEE_DEACTIVATED',
          'EMPLOYEE',
          `Deactivated employee ${emp.fullName}. Reason: ${reason}. System identified active access risks.`,
          'WARNING',
          { id: emp.id, name: emp.fullName },
          undefined,
          emp.employmentStatus,
          'TERMINATED'
        );

        // Add alert notification
        setNotifications(notifs => [
          {
            id: `notif-${Date.now()}`,
            title: `Employee Deactivated: ${emp.fullName}`,
            message: `Employee has been marked as TERMINATED. Verify de-provisioning on connected applications.`,
            timestamp: 'Just now',
            category: 'VIOLATION',
            severity: 'CRITICAL',
            isRead: false,
            linkTab: 'identities'
          },
          ...notifs
        ]);

        return evaluated;
      })
    );
  };

  const importEmployees = (newEmps: Employee[]) => {
    const evaluatedList = newEmps.map(e => recalculateEmployeeRisk(e));
    setEmployees(prev => [...evaluatedList, ...prev]);
    logAudit(
      'EMPLOYEE_CSV_IMPORTED',
      'EMPLOYEE',
      `Batch imported ${newEmps.length} employee identity records via CSV.`,
      'INFO'
    );
  };

  // Systems Management
  const createApplication = (appData: Partial<Application>) => {
    const newApp: Application = {
      id: `app-${Date.now().toString().slice(-4)}`,
      code: appData.code || `APP-${Date.now().toString().slice(-3)}`,
      name: appData.name || 'New Enterprise Application',
      description: appData.description || 'Enterprise software integration.',
      ownerId: appData.ownerId || currentUser.id,
      ownerName: appData.ownerName || currentUser.name,
      department: appData.department || 'IT & Information Security',
      securityClassification: appData.securityClassification || 'CONFIDENTIAL',
      status: 'ACTIVE',
      totalUsersCount: 0,
      integrationType: appData.integrationType || 'DIRECT_API',
      lastSyncTimestamp: new Date().toISOString(),
      availableRoles: appData.availableRoles || [
        { id: 'role-viewer', name: 'Standard Viewer', description: 'Read only access', riskWeight: 2, privilegeLevel: 'READ_ONLY' },
        { id: 'role-admin', name: 'Application Admin', description: 'Administrative configuration', riskWeight: 8, privilegeLevel: 'ADMIN' },
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    logAudit(
      'APPLICATION_REGISTERED',
      'SYSTEM_CONFIG',
      `Registered new application ${newApp.name} (${newApp.code}) with ${newApp.securityClassification} classification.`,
      'INFO',
      undefined,
      { id: newApp.id, name: newApp.name }
    );
  };

  // Permissions Management
  const grantPermission = (employeeId: string, permission: Omit<PermissionAssignment, 'id'>) => {
    const permId = `perm-${Date.now()}`;
    const newAssignment: PermissionAssignment = {
      ...permission,
      id: permId,
      grantedDate: new Date().toISOString().slice(0, 10),
      grantedBy: currentUser.name,
      lastReviewedDate: new Date().toISOString().slice(0, 10)
    };

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id !== employeeId) return emp;
        const updatedPerms = [...emp.permissions.filter(p => p.applicationId !== permission.applicationId), newAssignment];
        const updatedApps = Array.from(new Set([...emp.assignedApplications, permission.applicationId]));
        const evaluated = recalculateEmployeeRisk({
          ...emp,
          permissions: updatedPerms,
          assignedApplications: updatedApps
        });

        logAudit(
          'PERMISSION_GRANTED',
          'PERMISSION',
          `Granted ${permission.level} access on ${permission.applicationName} (${permission.roleName}) to ${emp.fullName}.`,
          'INFO',
          { id: emp.id, name: emp.fullName },
          { id: permission.applicationId, name: permission.applicationName },
          'NO_ACCESS',
          permission.level
        );

        return evaluated;
      })
    );
  };

  const revokePermission = (employeeId: string, permissionId: string, justification: string) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id !== employeeId) return emp;
        const targetPerm = emp.permissions.find(p => p.id === permissionId);
        if (!targetPerm) return emp;

        const updatedPerms = emp.permissions.filter(p => p.id !== permissionId);
        const remainingAppIds = updatedPerms.map(p => p.applicationId);
        const updatedApps = emp.assignedApplications.filter(appId => remainingAppIds.includes(appId));

        const evaluated = recalculateEmployeeRisk({
          ...emp,
          permissions: updatedPerms,
          assignedApplications: updatedApps
        });

        logAudit(
          'PERMISSION_REVOKED',
          'PERMISSION',
          `Revoked access for ${targetPerm.applicationName} (${targetPerm.roleName}) from ${emp.fullName}. Justification: ${justification}`,
          'WARNING',
          { id: emp.id, name: emp.fullName },
          { id: targetPerm.applicationId, name: targetPerm.applicationName },
          targetPerm.level,
          'REVOKED'
        );

        return evaluated;
      })
    );
  };

  const modifyPermission = (
    employeeId: string,
    permissionId: string,
    newLevel: PermissionLevel,
    newEntitlements: string[],
    justification: string
  ) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id !== employeeId) return emp;
        const updatedPerms = emp.permissions.map(p => {
          if (p.id !== permissionId) return p;
          return {
            ...p,
            level: newLevel,
            specificEntitlements: newEntitlements,
            justification
          };
        });

        const evaluated = recalculateEmployeeRisk({
          ...emp,
          permissions: updatedPerms
        });

        logAudit(
          'PERMISSION_MODIFIED',
          'PERMISSION',
          `Modified permissions for ${emp.fullName}. New level: ${newLevel}. Justification: ${justification}`,
          'INFO',
          { id: emp.id, name: emp.fullName }
        );

        return evaluated;
      })
    );
  };

  // Recertification Campaigns
  const createCampaign = (
    campaignData: Omit<RecertificationCampaign, 'id' | 'campaignCode' | 'totalReviewItems' | 'completedReviewItems' | 'revokedReviewItems' | 'modifiedReviewItems' | 'escalatedReviewItems' | 'createdDate'>
  ) => {
    const campaignId = `camp-${Date.now().toString().slice(-4)}`;
    const code = `RC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Filter employees in included departments that have permissions on included apps
    const candidateEmployees = employees.filter(e =>
      campaignData.includedDepartmentIds.includes(e.departmentId) ||
      campaignData.includedDepartmentIds.includes(e.department)
    );

    const generatedReviews: RecertificationReviewItem[] = [];

    candidateEmployees.forEach(emp => {
      emp.permissions.forEach(p => {
        if (campaignData.includedApplicationIds.includes(p.applicationId) && p.level !== 'NO_ACCESS') {
          generatedReviews.push({
            id: `rev-${campaignId}-${emp.id}-${p.applicationId}`,
            campaignId,
            employeeId: emp.id,
            employeeName: emp.fullName,
            employeeJobTitle: emp.jobTitle,
            employeeDepartment: emp.department,
            applicationId: p.applicationId,
            applicationName: p.applicationName,
            roleName: p.roleName,
            permissionLevel: p.level,
            entitlements: p.specificEntitlements || [],
            reviewerId: emp.managerId,
            reviewerName: emp.managerName,
            decision: 'PENDING',
            isOverdue: false,
            dueDate: campaignData.deadline
          });
        }
      });
    });

    const newCampaign: RecertificationCampaign = {
      ...campaignData,
      id: campaignId,
      campaignCode: code,
      totalReviewItems: generatedReviews.length,
      completedReviewItems: 0,
      revokedReviewItems: 0,
      modifiedReviewItems: 0,
      escalatedReviewItems: 0,
      createdDate: new Date().toISOString().slice(0, 10)
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setReviewItems(prev => [...generatedReviews, ...prev]);

    logAudit(
      'CAMPAIGN_INITIATED',
      'RECERTIFICATION',
      `Initiated recertification campaign '${newCampaign.name}' (${newCampaign.campaignCode}) generating ${generatedReviews.length} manager review tasks.`,
      'INFO'
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `New Recertification Campaign: ${newCampaign.name}`,
        message: `${generatedReviews.length} review tasks assigned to department managers. Deadline: ${newCampaign.deadline}.`,
        timestamp: 'Just now',
        category: 'CAMPAIGN',
        severity: 'INFO',
        isRead: false,
        linkTab: 'recertification'
      },
      ...prev
    ]);
  };

  const submitReviewDecision = (
    reviewId: string,
    decision: ReviewDecision,
    justification?: string,
    modifiedPrivileges?: string[],
    escalateTo?: string
  ) => {
    let affectedEmployeeId = '';
    let affectedAppId = '';
    let campaignId = '';

    setReviewItems(prev =>
      prev.map(item => {
        if (item.id !== reviewId) return item;
        affectedEmployeeId = item.employeeId;
        affectedAppId = item.applicationId;
        campaignId = item.campaignId;

        return {
          ...item,
          decision,
          decisionJustification: justification,
          decisionTimestamp: new Date().toISOString(),
          modifiedPrivileges,
          escalatedTo: escalateTo
        };
      })
    );

    // Update campaign metrics
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id !== campaignId) return c;
        return {
          ...c,
          completedReviewItems: c.completedReviewItems + 1,
          revokedReviewItems: decision === 'REVOKE' ? c.revokedReviewItems + 1 : c.revokedReviewItems,
          modifiedReviewItems: decision === 'MODIFY' ? c.modifiedReviewItems + 1 : c.modifiedReviewItems,
          escalatedReviewItems: decision === 'ESCALATE' ? c.escalatedReviewItems + 1 : c.escalatedReviewItems
        };
      })
    );

    // If decision was REVOKED, automatically simulate permission revocation and create corrective action
    if (decision === 'REVOKE' && affectedEmployeeId) {
      const emp = employees.find(e => e.id === affectedEmployeeId);
      const perm = emp?.permissions.find(p => p.applicationId === affectedAppId);

      if (emp && perm) {
        revokePermission(
          affectedEmployeeId,
          perm.id,
          `Recertification campaign revocation by reviewer ${currentUser.name}: ${justification || 'Access no longer required.'}`
        );
      }
    }

    logAudit(
      'RECERTIFICATION_DECISION',
      'RECERTIFICATION',
      `Submitted review decision [${decision}] for review #${reviewId}. Justification: ${justification || 'N/A'}.`,
      decision === 'REVOKE' || decision === 'ESCALATE' ? 'WARNING' : 'INFO'
    );
  };

  const bulkCertifyReviews = (reviewIds: string[], justification: string) => {
    setReviewItems(prev =>
      prev.map(item => {
        if (!reviewIds.includes(item.id) || item.decision !== 'PENDING') return item;
        return {
          ...item,
          decision: 'CERTIFIED',
          decisionJustification: justification,
          decisionTimestamp: new Date().toISOString()
        };
      })
    );

    logAudit(
      'BULK_CERTIFY_SUBMITTED',
      'RECERTIFICATION',
      `Bulk certified ${reviewIds.length} review tasks with justification: '${justification}'.`,
      'INFO'
    );
  };

  // Corrective Actions
  const createCorrectiveAction = (actionData: Omit<CorrectiveAction, 'id' | 'actionCode'>) => {
    const newAction: CorrectiveAction = {
      ...actionData,
      id: `ca-${Date.now().toString().slice(-4)}`,
      actionCode: `CA-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    };

    setCorrectiveActions(prev => [newAction, ...prev]);
    logAudit(
      'CORRECTIVE_ACTION_CREATED',
      'CORRECTIVE_ACTION',
      `Logged corrective action ${newAction.actionCode}: ${newAction.issueTitle}. Assigned to ${newAction.assignedToName}.`,
      newAction.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
      { id: newAction.affectedEmployeeId, name: newAction.affectedEmployeeName }
    );
  };

  const updateCorrectiveActionStatus = (id: string, status: ActionStatus, resolutionNotes?: string) => {
    setCorrectiveActions(prev =>
      prev.map(action => {
        if (action.id !== id) return action;
        return {
          ...action,
          status,
          resolutionNotes: resolutionNotes || action.resolutionNotes,
          resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date().toISOString() : action.resolvedAt,
          resolvedBy: status === 'RESOLVED' || status === 'CLOSED' ? currentUser.name : action.resolvedBy
        };
      })
    );

    logAudit(
      'CORRECTIVE_ACTION_UPDATED',
      'CORRECTIVE_ACTION',
      `Corrective action status changed to ${status}. Notes: ${resolutionNotes || 'None'}`,
      'INFO'
    );
  };

  const executeRemediation = (actionId: string) => {
    const action = correctiveActions.find(a => a.id === actionId);
    if (!action) return;

    // Simulate remediation on employee permissions
    if (action.affectedEmployeeId && action.affectedApplicationId) {
      const emp = employees.find(e => e.id === action.affectedEmployeeId);
      const perm = emp?.permissions.find(p => p.applicationId === action.affectedApplicationId);

      if (emp && perm) {
        revokePermission(
          action.affectedEmployeeId,
          perm.id,
          `Automated remediation of corrective action ${action.actionCode} by ${currentUser.name}`
        );
      }
    }

    updateCorrectiveActionStatus(
      actionId,
      'RESOLVED',
      `Remediation executed successfully by ${currentUser.name}. Privileges revoked/de-provisioned and verified against identity directory.`
    );
  };

  // Approval Workflows
  const approveWorkflowStep = (workflowId: string, stepNumber: number, comments?: string) => {
    setApprovalWorkflows(prev =>
      prev.map(wf => {
        if (wf.id !== workflowId) return wf;
        const nextSteps = wf.steps.map(s => {
          if (s.stepNumber !== stepNumber) return s;
          return {
            ...s,
            status: 'APPROVED' as const,
            decidedAt: new Date().toISOString(),
            comments
          };
        });

        const isFinal = stepNumber === wf.totalSteps;
        const nextCurrentStep = isFinal ? stepNumber : stepNumber + 1;
        const newStatus = isFinal ? ('APPROVED' as const) : ('PENDING' as const);

        return {
          ...wf,
          currentStep: nextCurrentStep,
          status: newStatus,
          steps: nextSteps
        };
      })
    );

    logAudit(
      'WORKFLOW_STEP_APPROVED',
      'PERMISSION',
      `Step ${stepNumber} approved for workflow ${workflowId} by ${currentUser.name}. Comments: ${comments || 'Approved.'}`,
      'INFO'
    );
  };

  const rejectWorkflowStep = (workflowId: string, stepNumber: number, comments?: string) => {
    setApprovalWorkflows(prev =>
      prev.map(wf => {
        if (wf.id !== workflowId) return wf;
        const nextSteps = wf.steps.map(s => {
          if (s.stepNumber !== stepNumber) return s;
          return {
            ...s,
            status: 'REJECTED' as const,
            decidedAt: new Date().toISOString(),
            comments
          };
        });

        return {
          ...wf,
          status: 'REJECTED' as const,
          steps: nextSteps
        };
      })
    );

    logAudit(
      'WORKFLOW_STEP_REJECTED',
      'PERMISSION',
      `Step ${stepNumber} rejected for workflow ${workflowId} by ${currentUser.name}. Comments: ${comments || 'Rejected.'}`,
      'WARNING'
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Reset Demo Data
  const resetToDemoData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setApplications(APPLICATIONS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setReviewItems(INITIAL_REVIEWS);
    setApprovalWorkflows(INITIAL_APPROVAL_WORKFLOWS);
    setCorrectiveActions(INITIAL_CORRECTIVE_ACTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS[0]);

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });

    logAudit(
      'DATABASE_RESET',
      'SYSTEM_CONFIG',
      'Reset all application identities, campaigns and audit stores to baseline demo state.',
      'WARNING'
    );
  };

  return (
    <AccessGuardContext.Provider
      value={{
        currentUser,
        switchUser,
        availableDemoUsers: DEMO_USERS,
        activeTab,
        setActiveTab,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isHelpOpen,
        setIsHelpOpen,
        selectedEmployeeId,
        setSelectedEmployeeId,
        selectedApplicationId,
        setSelectedApplicationId,
        selectedCampaignId,
        setSelectedCampaignId,
        employees,
        applications,
        campaigns,
        reviewItems,
        violations,
        approvalWorkflows,
        correctiveActions,
        auditLogs,
        notifications,
        metrics,
        createEmployee,
        updateEmployee,
        deactivateEmployee,
        importEmployees,
        createApplication,
        grantPermission,
        revokePermission,
        modifyPermission,
        createCampaign,
        submitReviewDecision,
        bulkCertifyReviews,
        createCorrectiveAction,
        updateCorrectiveActionStatus,
        executeRemediation,
        approveWorkflowStep,
        rejectWorkflowStep,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData
      }}
    >
      {children}
    </AccessGuardContext.Provider>
  );
};

export const useAccessGuard = () => {
  const context = useContext(AccessGuardContext);
  if (!context) {
    throw new Error('useAccessGuard must be used within an AccessGuardProvider');
  }
  return context;
};
