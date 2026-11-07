/**
 * AccessGuard Enterprise Identity Governance & Recertification Platform
 * Core TypeScript Type Definitions
 */

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'DEPARTMENT_MANAGER' 
  | 'BRANCH_MANAGER' 
  | 'IT_ADMIN' 
  | 'AUDITOR' 
  | 'EMPLOYEE';

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type PermissionLevel = 'NO_ACCESS' | 'READ_ONLY' | 'READ_WRITE' | 'ADMIN' | 'SUPER_ADMIN';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'OVERDUE';

export type ReviewDecision = 
  | 'PENDING' 
  | 'CERTIFIED' 
  | 'REVOKED' 
  | 'REVOKE'
  | 'MODIFIED' 
  | 'MODIFY'
  | 'ESCALATED'
  | 'ESCALATE';

export type ActionStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'RESOLVED' | 'CLOSED';

export type SecurityClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'CRITICAL_FINANCIAL';

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId: string;
  managerName: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  code: string;
}

export interface ApplicationRole {
  id: string;
  name: string;
  description: string;
  riskWeight: number; // 1 - 10
  privilegeLevel: PermissionLevel;
}

export interface Application {
  id: string;
  code: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  department: string;
  securityClassification: SecurityClassification;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED';
  totalUsersCount: number;
  availableRoles: ApplicationRole[];
  integrationType: 'DIRECT_API' | 'SAML_SSO' | 'SCIM_PROVISIONING' | 'AGENT_SYNC';
  lastSyncTimestamp: string;
}

export interface PermissionAssignment {
  id: string;
  employeeId: string;
  applicationId: string;
  applicationName: string;
  roleId: string;
  roleName: string;
  level: PermissionLevel;
  specificEntitlements: string[]; // e.g. ["Create_Supplier", "Approve_Invoice"]
  grantedDate: string;
  grantedBy: string;
  justification?: string;
  lastUsedDate?: string;
  isDormant?: boolean;
  lastReviewedDate?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string; // e.g. "JFS-0104"
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  department: string;
  departmentId: string;
  branch: string;
  branchId: string;
  jobTitle: string;
  employmentStatus: EmploymentStatus;
  managerId: string;
  managerName: string;
  dateOfEmployment: string;
  terminationDate?: string;
  lastLoginDate: string;
  assignedApplications: string[]; // Application IDs
  permissions: PermissionAssignment[];
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskFactors: string[];
  lastAccessReviewDate: string;
  isPrivilegedUser: boolean;
  departmentTransferDate?: string;
  previousDepartment?: string;
}

export interface SodRule {
  id: string;
  ruleCode: string; // e.g. "SOD-FIN-01"
  name: string;
  description: string;
  riskLevel: RiskLevel;
  applicationAId: string;
  entitlementA: string;
  applicationBId: string;
  entitlementB: string;
  conflictRationale: string;
  recommendedMitigation: string;
}

export interface SecurityViolation {
  id: string;
  violationCode: string;
  ruleType: 
    | 'TERMINATED_EMPLOYEE_ACTIVE_ACCESS'
    | 'EXCESSIVE_PRIVILEGES'
    | 'SEGREGATION_OF_DUTIES'
    | 'DEPARTMENT_TRANSFER_ORPHAN'
    | 'DORMANT_ACCOUNT'
    | 'UNREVIEWED_ACCESS'
    | 'UNAUTHORIZED_ADMIN_PRIVILEGE';
  title: string;
  severity: RiskLevel;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeDepartment: string;
  applicationId?: string;
  applicationName?: string;
  detectedAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'REMEDIATED' | 'ACCEPTED_EXCEPTION';
  description: string;
  whyDangerous: string;
  recommendedAction: string;
  correctiveActionId?: string;
}

export interface RecertificationReviewItem {
  id: string;
  campaignId: string;
  employeeId: string;
  employeeName: string;
  employeeJobTitle: string;
  employeeDepartment: string;
  applicationId: string;
  applicationName: string;
  roleName: string;
  permissionLevel: PermissionLevel;
  entitlements: string[];
  reviewerId: string;
  reviewerName: string;
  decision: ReviewDecision;
  decisionJustification?: string;
  decisionTimestamp?: string;
  modifiedPrivileges?: string[];
  escalationReason?: string;
  escalatedTo?: string;
  isOverdue: boolean;
  dueDate: string;
}

export interface RecertificationCampaign {
  id: string;
  campaignCode: string; // e.g. "RC-2026-Q4"
  name: string;
  description: string;
  reviewPeriod: string; // e.g. "Q4 2026 (Oct - Dec)"
  startDate: string;
  deadline: string;
  includedDepartmentIds: string[];
  includedApplicationIds: string[];
  assignedReviewerIds: string[];
  totalReviewItems: number;
  completedReviewItems: number;
  revokedReviewItems: number;
  modifiedReviewItems: number;
  escalatedReviewItems: number;
  status: CampaignStatus;
  createdBy: string;
  createdDate: string;
}

export interface ApprovalWorkflowStep {
  stepNumber: number;
  stepName: string;
  approverRole: string;
  approverName: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  decidedAt?: string;
  comments?: string;
}

export interface ApprovalWorkflow {
  id: string;
  workflowCode: string;
  requestType: 'ACCESS_REQUEST' | 'RECERTIFICATION_REVOCATION' | 'SOD_EXCEPTION' | 'EMERGENCY_ACCESS';
  employeeId: string;
  employeeName: string;
  applicationId: string;
  applicationName: string;
  requestedRole: string;
  requestedLevel: PermissionLevel;
  requesterId: string;
  requesterName: string;
  submittedDate: string;
  currentStep: number;
  totalSteps: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  justification: string;
  riskAssessment: {
    score: number;
    level: RiskLevel;
    detectedViolations: string[];
  };
  steps: ApprovalWorkflowStep[];
}

export interface CorrectiveAction {
  id: string;
  actionCode: string; // e.g. "CA-2026-0042"
  issueTitle: string;
  issueDescription: string;
  affectedEmployeeId: string;
  affectedEmployeeName: string;
  affectedApplicationId?: string;
  affectedApplicationName?: string;
  riskLevel: RiskLevel;
  recommendedAction: string;
  assignedToId: string;
  assignedToName: string;
  dueDate: string;
  status: ActionStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  violationId?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  category: 'AUTHENTICATION' | 'EMPLOYEE' | 'PERMISSION' | 'RECERTIFICATION' | 'RISK_DETECTION' | 'CORRECTIVE_ACTION' | 'SYSTEM_CONFIG';
  targetEmployeeId?: string;
  targetEmployeeName?: string;
  targetApplicationId?: string;
  targetApplicationName?: string;
  previousValue?: string;
  newValue?: string;
  description: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'CAMPAIGN' | 'VIOLATION' | 'APPROVAL' | 'CORRECTIVE_ACTION' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  isRead: boolean;
  linkTab?: string;
  relatedEntityId?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  branch: string;
  avatarInitials: string;
}
