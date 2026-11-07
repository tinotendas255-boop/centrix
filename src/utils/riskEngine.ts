/**
 * AccessGuard Explainable Rules-Based Risk Detection Engine
 * 
 * Analyzes employee records, employment statuses, job roles, assigned permissions,
 * and Segregation of Duties (SoD) rules to calculate transparent risk scores (0-100)
 * and generate actionable security violations.
 */

import { Employee, SecurityViolation, SodRule, RiskLevel, Application } from '../types';

export const SOD_RULES: SodRule[] = [
  {
    id: 'sod-01',
    ruleCode: 'SOD-FIN-01',
    name: 'Supplier Creation vs. Payment Release',
    description: 'Conflict between creating/modifying vendor records and releasing outgoing payments.',
    riskLevel: 'CRITICAL',
    applicationAId: 'app-fms',
    entitlementA: 'Vendor_Master_Create_Edit',
    applicationBId: 'app-fms',
    entitlementB: 'Payment_Release_Authorize',
    conflictRationale: 'Allows a single individual to create a fictitious vendor and disburse funds without independent review, presenting an acute risk of financial fraud.',
    recommendedMitigation: 'Revoke Payment_Release_Authorize and assign to independent Treasury Officer. Implement dual authorization.'
  },
  {
    id: 'sod-02',
    ruleCode: 'SOD-FIN-02',
    name: 'Purchase Order Approval vs. Invoice Processing',
    description: 'Conflict between raising/approving purchase orders and validating invoices for payment.',
    riskLevel: 'HIGH',
    applicationAId: 'app-proc',
    entitlementA: 'PO_Creation_Approval',
    applicationBId: 'app-fms',
    entitlementB: 'Invoice_Matching_Post',
    conflictRationale: 'Violates procure-to-pay segregation; enables circumventing procurement policy thresholds.',
    recommendedMitigation: 'Segregate procurement officer roles from accounting payable staff.'
  },
  {
    id: 'sod-03',
    ruleCode: 'SOD-BNK-01',
    name: 'Credit Facility Creation vs. Loan Disbursement',
    description: 'Conflict between originating customer loans and executing financial disbursement into accounts.',
    riskLevel: 'CRITICAL',
    applicationAId: 'app-cbs',
    entitlementA: 'Credit_Facility_Origination',
    applicationBId: 'app-cbs',
    entitlementB: 'Loan_Disbursement_Execution',
    conflictRationale: 'Creates direct exposure for unauthorized loans and credit fraud without credit committee sign-off.',
    recommendedMitigation: 'Enforce 4-eyes approval workflow; separate loan origination from central operations disbursement.'
  },
  {
    id: 'sod-04',
    ruleCode: 'SOD-PAY-01',
    name: 'Payroll Master Modification vs. Salary Execution',
    description: 'Conflict between changing employee salary records/bank details and releasing monthly payroll.',
    riskLevel: 'CRITICAL',
    applicationAId: 'app-pay',
    entitlementA: 'Salary_Scale_Bank_Update',
    applicationBId: 'app-pay',
    entitlementB: 'Payroll_Batch_Release',
    conflictRationale: 'Ghost employee creation or unauthorized salary modifications could be immediately disbursed undetected.',
    recommendedMitigation: 'Require Human Resources to initiate changes and Finance Treasury to disburse, with automated hash reconciliation.'
  },
  {
    id: 'sod-05',
    ruleCode: 'SOD-SEC-01',
    name: 'Privileged Security Admin vs. Audit Log Access',
    description: 'Conflict between possessing system admin rights and possessing capability to modify or purge audit logs.',
    riskLevel: 'CRITICAL',
    applicationAId: 'app-dba',
    entitlementA: 'DBA_Super_User',
    applicationBId: 'app-dba',
    entitlementB: 'Audit_Log_Truncate_Modify',
    conflictRationale: 'Allows an administrator to carry out unauthorized database alterations and conceal their digital tracks.',
    recommendedMitigation: 'Export audit logs write-once to immutable WORM storage inaccessible to system administrators.'
  }
];

export interface RiskAnalysisResult {
  score: number;
  level: RiskLevel;
  factors: string[];
  violations: SecurityViolation[];
}

export function analyzeEmployeeRisk(
  employee: Employee,
  applications: Application[],
  sodRules: SodRule[] = SOD_RULES
): RiskAnalysisResult {
  let score = 0;
  const factors: string[] = [];
  const violations: SecurityViolation[] = [];
  const now = new Date('2026-11-06T00:00:00Z'); // Fixed reference date matching system context

  // ==========================================
  // RULE 1: TERMINATED / RESIGNED EMPLOYEE ACTIVE ACCESS (CRITICAL)
  // Weight: +50 to +60 points
  // ==========================================
  const isInactiveStatus = employee.employmentStatus === 'TERMINATED' || employee.employmentStatus === 'RESIGNED';
  const hasActivePermissions = employee.permissions.some(p => p.level !== 'NO_ACCESS');
  
  if (isInactiveStatus && hasActivePermissions) {
    score += 55;
    const factorMsg = `Employment status is ${employee.employmentStatus}, but retains active access to ${employee.permissions.filter(p => p.level !== 'NO_ACCESS').length} organizational systems.`;
    factors.push(factorMsg);

    violations.push({
      id: `viol-term-${employee.id}`,
      violationCode: `VIO-TRM-${employee.employeeNumber}`,
      ruleType: 'TERMINATED_EMPLOYEE_ACTIVE_ACCESS',
      title: `Orphaned Access: ${employee.employmentStatus} Employee Has Active Access`,
      severity: 'CRITICAL',
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeEmail: employee.email,
      employeeDepartment: employee.department,
      detectedAt: '2026-11-06T02:00:00Z',
      status: 'OPEN',
      description: `${employee.fullName} departed Jenaya Financial Services (Status: ${employee.employmentStatus}) on ${employee.terminationDate || 'recent date'}, but their accounts on organizational systems remain enabled.`,
      whyDangerous: 'Former employees or compromised credentials can be used to exfiltrate financial data, execute unauthorized transactions, or sabotage systems with zero legitimate business need.',
      recommendedAction: 'Execute emergency revocation on all connected identity endpoints and invalidate active session tokens immediately.'
    });
  }

  // ==========================================
  // RULE 3: SEGREGATION OF DUTIES (SoD) VIOLATIONS (CRITICAL / HIGH)
  // Weight: +25 per violation
  // ==========================================
  const allUserEntitlements = new Set<string>();
  employee.permissions.forEach(p => {
    (p.specificEntitlements || []).forEach(e => allUserEntitlements.add(e));
  });

  for (const rule of sodRules) {
    const hasA = allUserEntitlements.has(rule.entitlementA);
    const hasB = allUserEntitlements.has(rule.entitlementB);

    if (hasA && hasB) {
      const sodWeight = rule.riskLevel === 'CRITICAL' ? 30 : 20;
      score += sodWeight;
      factors.push(`Segregation of Duties Conflict: [${rule.ruleCode}] ${rule.name}`);

      violations.push({
        id: `viol-sod-${employee.id}-${rule.id}`,
        violationCode: `VIO-${rule.ruleCode}-${employee.employeeNumber}`,
        ruleType: 'SEGREGATION_OF_DUTIES',
        title: `Toxic Combination: ${rule.name}`,
        severity: rule.riskLevel,
        employeeId: employee.id,
        employeeName: employee.fullName,
        employeeEmail: employee.email,
        employeeDepartment: employee.department,
        detectedAt: '2026-11-06T02:15:00Z',
        status: 'OPEN',
        description: `${employee.fullName} possesses both conflicting entitlements: '${rule.entitlementA}' and '${rule.entitlementB}'.`,
        whyDangerous: rule.conflictRationale,
        recommendedAction: rule.recommendedMitigation
      });
    }
  }

  // ==========================================
  // RULE 2: EXCESSIVE PRIVILEGES & UNAUTHORIZED ADMIN ACCESS (HIGH)
  // Weight: +20 to +30 points
  // ==========================================
  const adminPermissions = employee.permissions.filter(p => p.level === 'ADMIN' || p.level === 'SUPER_ADMIN');
  const isItOrSecurity = employee.department === 'IT & Security' || employee.department === 'Information Technology';

  if (adminPermissions.length > 0 && !isItOrSecurity) {
    score += 25;
    const appNames = adminPermissions.map(p => p.applicationName).join(', ');
    factors.push(`Administrative access (${adminPermissions.map(p => p.level).join(', ')}) on [${appNames}] without IT/Security role.`);

    violations.push({
      id: `viol-admin-${employee.id}`,
      violationCode: `VIO-ADM-${employee.employeeNumber}`,
      ruleType: 'UNAUTHORIZED_ADMIN_PRIVILEGE',
      title: `Excessive Privileges: Elevated Admin Access Outside IT`,
      severity: 'HIGH',
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeEmail: employee.email,
      employeeDepartment: employee.department,
      detectedAt: '2026-11-06T02:30:00Z',
      status: 'OPEN',
      description: `${employee.fullName} holds administrative credentials on ${appNames}, which is incompatible with their job title of ${employee.jobTitle} in ${employee.department}.`,
      whyDangerous: 'Non-technical business personnel possessing system administrative or database root access bypass operational checks and expose systems to accidental misconfiguration or privilege abuse.',
      recommendedAction: 'Downgrade role to Standard Business User (Read/Write) and establish privileged identity management (PIM) request workflow.'
    });
  }

  // ==========================================
  // RULE 4: DEPARTMENT TRANSFER ORPHAN ACCESS (HIGH)
  // Weight: +20 points
  // ==========================================
  if (employee.previousDepartment && employee.departmentTransferDate) {
    const hasOldDeptPerms = employee.permissions.some(p => {
      // Find app
      const app = applications.find(a => a.id === p.applicationId);
      return app && app.department === employee.previousDepartment && p.level !== 'NO_ACCESS';
    });

    if (hasOldDeptPerms) {
      score += 20;
      factors.push(`Retains legacy permissions belonging to previous department (${employee.previousDepartment}) following transfer.`);

      violations.push({
        id: `viol-trans-${employee.id}`,
        violationCode: `VIO-TRF-${employee.employeeNumber}`,
        ruleType: 'DEPARTMENT_TRANSFER_ORPHAN',
        title: `Privilege Creep: Retained Previous Department Access`,
        severity: 'HIGH',
        employeeId: employee.id,
        employeeName: employee.fullName,
        employeeEmail: employee.email,
        employeeDepartment: employee.department,
        detectedAt: '2026-11-06T02:45:00Z',
        status: 'OPEN',
        description: `${employee.fullName} transferred from ${employee.previousDepartment} to ${employee.department} on ${employee.departmentTransferDate}, but permissions from the former department were never decommissioned.`,
        whyDangerous: 'Privilege accumulation (privilege creep) allows cross-functional access that violates least privilege and undermines departmental accountability.',
        recommendedAction: 'De-provision all entitlements tagged with the prior department and align with new department role profile.'
      });
    }
  }

  // ==========================================
  // RULE 5: DORMANT ACCOUNTS (>90 DAYS INACTIVE) (MODERATE)
  // Weight: +15 points
  // ==========================================
  const dormantPerms = employee.permissions.filter(p => p.isDormant);
  if (dormantPerms.length > 0) {
    score += 15;
    factors.push(`Has ${dormantPerms.length} dormant application account(s) inactive for >90 days.`);

    violations.push({
      id: `viol-dorm-${employee.id}`,
      violationCode: `VIO-DRM-${employee.employeeNumber}`,
      ruleType: 'DORMANT_ACCOUNT',
      title: `Dormant Credentials: Inactive Account (>90 Days)`,
      severity: 'MODERATE',
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeEmail: employee.email,
      employeeDepartment: employee.department,
      detectedAt: '2026-11-06T03:00:00Z',
      status: 'OPEN',
      description: `Accounts for ${dormantPerms.map(p => p.applicationName).join(', ')} have recorded zero authentication activity for over 90 days.`,
      whyDangerous: 'Unused accounts are prime targets for credential harvesting, password spraying, and persistence without alerting legitimate users.',
      recommendedAction: 'Disable inactive application accounts or prompt user to affirm ongoing operational necessity.'
    });
  }

  // ==========================================
  // RULE 6: UNREVIEWED ACCESS (>180 DAYS) (MODERATE)
  // Weight: +10 points
  // ==========================================
  if (employee.lastAccessReviewDate) {
    const reviewDate = new Date(employee.lastAccessReviewDate);
    const diffDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays > 180 && !isInactiveStatus) {
      score += 10;
      factors.push(`Access review is overdue by ${diffDays - 180} days (last reviewed ${employee.lastAccessReviewDate}).`);

      violations.push({
        id: `viol-unrev-${employee.id}`,
        violationCode: `VIO-REV-${employee.employeeNumber}`,
        ruleType: 'UNREVIEWED_ACCESS',
        title: `Governance Lapse: Overdue Recertification Review`,
        severity: 'MODERATE',
        employeeId: employee.id,
        employeeName: employee.fullName,
        employeeEmail: employee.email,
        employeeDepartment: employee.department,
        detectedAt: '2026-11-06T03:10:00Z',
        status: 'OPEN',
        description: `Permissions for ${employee.fullName} have not undergone managerial recertification in ${diffDays} days, exceeding the policy limit of 180 days.`,
        whyDangerous: 'Failure to conduct periodic access recertification violates ISO 27001, COBIT, and SOX Section 404 access control mandates.',
        recommendedAction: 'Enroll employee into the ongoing quarterly recertification campaign for manager sign-off.'
      });
    }
  }

  // Cap score at 100
  score = Math.min(100, score);

  // Map to explainable risk level
  let level: RiskLevel = 'LOW';
  if (score >= 70) {
    level = 'CRITICAL';
  } else if (score >= 40) {
    level = 'HIGH';
  } else if (score >= 20) {
    level = 'MODERATE';
  } else {
    level = 'LOW';
  }

  if (factors.length === 0) {
    factors.push('Identity compliant with role-based baseline and least-privilege policies.');
  }

  return {
    score,
    level,
    factors,
    violations
  };
}
