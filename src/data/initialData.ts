/**
 * AccessGuard Seed Data: Jenaya Financial Services
 * Realistic enterprise identity dataset containing 100 employees, 8 departments, 
 * 4 branches, 10 systems, seeded recertification campaigns, and specific security scenarios.
 */

import {
  Department,
  Branch,
  Application,
  Employee,
  RecertificationCampaign,
  RecertificationReviewItem,
  ApprovalWorkflow,
  CorrectiveAction,
  AuditRecord,
  AppNotification,
  CurrentUser,
  PermissionLevel
} from '../types';
import { analyzeEmployeeRisk, SOD_RULES } from '../utils/riskEngine';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-fin', name: 'Finance & Accounting', code: 'FIN', managerId: 'emp-mgr-01', managerName: 'Ruvimbo Dube' },
  { id: 'dept-bnk', name: 'Banking Operations & Treasury', code: 'BNK', managerId: 'emp-mgr-02', managerName: 'Tatenda Mutembedza' },
  { id: 'dept-it', name: 'IT & Information Security', code: 'ITS', managerId: 'emp-mgr-03', managerName: 'Tinashe Zimuto' },
  { id: 'dept-rc', name: 'Risk & Compliance', code: 'RNC', managerId: 'emp-mgr-04', managerName: 'Fungai Muchena' },
  { id: 'dept-hr', name: 'Human Resources & Talent', code: 'HRT', managerId: 'emp-mgr-05', managerName: 'Nyasha Makoni' },
  { id: 'dept-proc', name: 'Procurement & Logistics', code: 'PRC', managerId: 'emp-mgr-06', managerName: 'Simbarashe Zhou' },
  { id: 'dept-aud', name: 'Internal Audit', code: 'AUD', managerId: 'emp-mgr-07', managerName: 'Dr. Chengetai Hove' },
  { id: 'dept-exec', name: 'Executive & Strategy', code: 'EXC', managerId: 'emp-mgr-08', managerName: 'Alexander Jenaya' },
];

export const BRANCHES: Branch[] = [
  { id: 'br-hre-main', name: 'Harare Main Branch (Headquarters)', city: 'Harare', code: 'HRE-01' },
  { id: 'br-byo-comm', name: 'Bulawayo Commercial Hub', city: 'Bulawayo', code: 'BYO-01' },
  { id: 'br-mut-reg', name: 'Mutare Regional Centre', city: 'Mutare', code: 'MUT-01' },
  { id: 'br-vfa-corp', name: 'Victoria Falls Corporate Office', city: 'Victoria Falls', code: 'VFA-01' },
];

export const APPLICATIONS: Application[] = [
  {
    id: 'app-fms',
    code: 'APP-FMS-01',
    name: 'Financial Management System',
    description: 'General ledger, accounts payable/receivable, financial reconciliation and reporting.',
    ownerId: 'emp-mgr-01',
    ownerName: 'Ruvimbo Dube',
    department: 'Finance & Accounting',
    securityClassification: 'CRITICAL_FINANCIAL',
    status: 'ACTIVE',
    totalUsersCount: 28,
    integrationType: 'DIRECT_API',
    lastSyncTimestamp: '2026-11-06T02:45:00Z',
    availableRoles: [
      { id: 'fms-viewer', name: 'Financial Auditor (Read Only)', description: 'View ledger and reports', riskWeight: 2, privilegeLevel: 'READ_ONLY' },
      { id: 'fms-editor', name: 'General Accountant', description: 'Journal posting and reconciliation', riskWeight: 5, privilegeLevel: 'READ_WRITE' },
      { id: 'fms-approver', name: 'Finance Controller', description: 'Authorize payment vouchers', riskWeight: 8, privilegeLevel: 'ADMIN' },
    ]
  },
  {
    id: 'app-cbs',
    code: 'APP-CBS-01',
    name: 'Core Banking Operations System',
    description: 'Customer account management, deposits, overdrafts, credit facilities and tellering.',
    ownerId: 'emp-mgr-02',
    ownerName: 'Tatenda Mutembedza',
    department: 'Banking Operations & Treasury',
    securityClassification: 'CRITICAL_FINANCIAL',
    status: 'ACTIVE',
    totalUsersCount: 42,
    integrationType: 'AGENT_SYNC',
    lastSyncTimestamp: '2026-11-06T02:50:00Z',
    availableRoles: [
      { id: 'cbs-teller', name: 'Branch Teller', description: 'Cash deposits and withdrawals up to threshold', riskWeight: 4, privilegeLevel: 'READ_WRITE' },
      { id: 'cbs-officer', name: 'Credit Facilities Officer', description: 'Loan facility creation and customer limits', riskWeight: 7, privilegeLevel: 'READ_WRITE' },
      { id: 'cbs-mgr', name: 'Branch Operations Supervisor', description: 'Override authorisations and end of day', riskWeight: 9, privilegeLevel: 'ADMIN' },
    ]
  },
  {
    id: 'app-pay',
    code: 'APP-PAY-01',
    name: 'Enterprise Payroll System',
    description: 'Employee compensation, tax calculations, statutory pensions, and salary disbursal.',
    ownerId: 'emp-mgr-05',
    ownerName: 'Nyasha Makoni',
    department: 'Human Resources & Talent',
    securityClassification: 'RESTRICTED',
    status: 'ACTIVE',
    totalUsersCount: 14,
    integrationType: 'SAML_SSO',
    lastSyncTimestamp: '2026-11-06T01:30:00Z',
    availableRoles: [
      { id: 'pay-viewer', name: 'HR Benefits Officer', description: 'View payroll deductions', riskWeight: 3, privilegeLevel: 'READ_ONLY' },
      { id: 'pay-specialist', name: 'Payroll Specialist', description: 'Input timesheets and bonus modifiers', riskWeight: 6, privilegeLevel: 'READ_WRITE' },
      { id: 'pay-controller', name: 'Payroll Disbursement Director', description: 'Final batch approval and bank release', riskWeight: 9, privilegeLevel: 'ADMIN' },
    ]
  },
  {
    id: 'app-hrms',
    code: 'APP-HRM-01',
    name: 'Human Resources Information System',
    description: 'Employee lifecycle, onboarding, appraisals, leave records and organizational hierarchy.',
    ownerId: 'emp-mgr-05',
    ownerName: 'Nyasha Makoni',
    department: 'Human Resources & Talent',
    securityClassification: 'CONFIDENTIAL',
    status: 'ACTIVE',
    totalUsersCount: 100,
    integrationType: 'SCIM_PROVISIONING',
    lastSyncTimestamp: '2026-11-06T02:15:00Z',
    availableRoles: [
      { id: 'hrm-self', name: 'Employee Self Service', description: 'View payslips and request leave', riskWeight: 1, privilegeLevel: 'READ_WRITE' },
      { id: 'hrm-officer', name: 'HR Business Partner', description: 'Manage employee profiles and records', riskWeight: 4, privilegeLevel: 'READ_WRITE' },
      { id: 'hrm-admin', name: 'HR Systems Administrator', description: 'Org structure and role definitions', riskWeight: 7, privilegeLevel: 'ADMIN' },
    ]
  },
  {
    id: 'app-crm',
    code: 'APP-CRM-01',
    name: 'Customer Relationship Management',
    description: 'Retail and corporate client profiles, KYC onboarding, sales pipeline, and interactions.',
    ownerId: 'emp-mgr-02',
    ownerName: 'Tatenda Mutembedza',
    department: 'Banking Operations & Treasury',
    securityClassification: 'CONFIDENTIAL',
    status: 'ACTIVE',
    totalUsersCount: 56,
    integrationType: 'SAML_SSO',
    lastSyncTimestamp: '2026-11-06T02:30:00Z',
    availableRoles: [
      { id: 'crm-agent', name: 'Client Relationship Officer', description: 'Manage client accounts and leads', riskWeight: 3, privilegeLevel: 'READ_WRITE' },
      { id: 'crm-lead', name: 'Private Banking Manager', description: 'High-net-worth portfolio management', riskWeight: 5, privilegeLevel: 'READ_WRITE' },
    ]
  },
  {
    id: 'app-proc',
    code: 'APP-PRC-01',
    name: 'Procurement & Vendor Portal',
    description: 'Supplier tendering, purchase order issuance, vendor approvals, and contract management.',
    ownerId: 'emp-mgr-06',
    ownerName: 'Simbarashe Zhou',
    department: 'Procurement & Logistics',
    securityClassification: 'CONFIDENTIAL',
    status: 'ACTIVE',
    totalUsersCount: 19,
    integrationType: 'DIRECT_API',
    lastSyncTimestamp: '2026-11-06T02:20:00Z',
    availableRoles: [
      { id: 'proc-buyer', name: 'Procurement Officer', description: 'Create POs and vendor proposals', riskWeight: 4, privilegeLevel: 'READ_WRITE' },
      { id: 'proc-approver', name: 'Procurement Committee Chair', description: 'Tender sign-off and PO approval', riskWeight: 7, privilegeLevel: 'ADMIN' },
    ]
  },
  {
    id: 'app-dba',
    code: 'APP-DBA-01',
    name: 'Database Administration Console',
    description: 'PostgreSQL clusters, Oracle RAC backups, schema migrations, and elevated DB query engine.',
    ownerId: 'emp-mgr-03',
    ownerName: 'Tinashe Zimuto',
    department: 'IT & Information Security',
    securityClassification: 'RESTRICTED',
    status: 'ACTIVE',
    totalUsersCount: 6,
    integrationType: 'AGENT_SYNC',
    lastSyncTimestamp: '2026-11-06T03:00:00Z',
    availableRoles: [
      { id: 'dba-analyst', name: 'Read-Only DB Auditor', description: 'Schema inspection and query analysis', riskWeight: 5, privilegeLevel: 'READ_ONLY' },
      { id: 'dba-engineer', name: 'Database Administrator', description: 'DDL execution, indexing, performance tuning', riskWeight: 9, privilegeLevel: 'ADMIN' },
      { id: 'dba-root', name: 'Chief DBA (Super User)', description: 'Root credentials and cluster failover', riskWeight: 10, privilegeLevel: 'SUPER_ADMIN' },
    ]
  },
  {
    id: 'app-swift',
    code: 'APP-SWF-01',
    name: 'SWIFT & Payments Settlement Gateway',
    description: 'Cross-border wire transfers, RTGS national clearing, treasury liquidity settlements.',
    ownerId: 'emp-mgr-02',
    ownerName: 'Tatenda Mutembedza',
    department: 'Banking Operations & Treasury',
    securityClassification: 'CRITICAL_FINANCIAL',
    status: 'ACTIVE',
    totalUsersCount: 11,
    integrationType: 'DIRECT_API',
    lastSyncTimestamp: '2026-11-06T02:40:00Z',
    availableRoles: [
      { id: 'swf-operator', name: 'SWIFT Operator', description: 'Payment message drafting (MT103/MT202)', riskWeight: 6, privilegeLevel: 'READ_WRITE' },
      { id: 'swf-authorizer', name: 'Treasury Authorizer (4-Eyes)', description: 'Cryptographic token payment release', riskWeight: 10, privilegeLevel: 'SUPER_ADMIN' },
    ]
  },
  {
    id: 'app-aml',
    code: 'APP-AML-01',
    name: 'Anti-Money Laundering & Sanctions Monitor',
    description: 'Automated transaction monitoring, PEP screening, suspicious activity reporting (SAR).',
    ownerId: 'emp-mgr-04',
    ownerName: 'Fungai Muchena',
    department: 'Risk & Compliance',
    securityClassification: 'RESTRICTED',
    status: 'ACTIVE',
    totalUsersCount: 16,
    integrationType: 'DIRECT_API',
    lastSyncTimestamp: '2026-11-06T02:55:00Z',
    availableRoles: [
      { id: 'aml-analyst', name: 'AML Compliance Analyst', description: 'Alert review and case investigation', riskWeight: 4, privilegeLevel: 'READ_WRITE' },
      { id: 'aml-officer', name: 'MLRO (Money Laundering Officer)', description: 'File regulatory reports and account blocks', riskWeight: 8, privilegeLevel: 'ADMIN' },
    ]
  },
  {
    id: 'app-collab',
    code: 'APP-COL-01',
    name: 'Enterprise Directory & Email Suite',
    description: 'Identity Provider, Exchange email, encrypted document vaults, and collaboration.',
    ownerId: 'emp-mgr-03',
    ownerName: 'Tinashe Zimuto',
    department: 'IT & Information Security',
    securityClassification: 'INTERNAL',
    status: 'ACTIVE',
    totalUsersCount: 100,
    integrationType: 'SCIM_PROVISIONING',
    lastSyncTimestamp: '2026-11-06T03:05:00Z',
    availableRoles: [
      { id: 'col-user', name: 'Standard Domain User', description: 'Mailbox, calendar and team drive', riskWeight: 1, privilegeLevel: 'READ_WRITE' },
      { id: 'col-admin', name: 'Identity Domain Administrator', description: 'Directory schema and global policies', riskWeight: 9, privilegeLevel: 'ADMIN' },
    ]
  }
];

// Helper to seed 100 employees
function generateSeededEmployees(): Employee[] {
  const employees: Employee[] = [];

  // 1. BENCHMARK SCENARIO 1: FORMER EMPLOYEE WITH ACTIVE FINANCIAL ACCESS
  employees.push({
    id: 'emp-001',
    employeeNumber: 'JFS-0012',
    firstName: 'Tendai',
    lastName: 'Chigumba',
    fullName: 'Tendai Chigumba',
    email: 'tendai.chigumba@jenaya-finance.co.zw',
    department: 'Finance & Accounting',
    departmentId: 'dept-fin',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Former Senior Treasury Officer',
    employmentStatus: 'RESIGNED',
    managerId: 'emp-mgr-01',
    managerName: 'Ruvimbo Dube',
    dateOfEmployment: '2021-03-15',
    terminationDate: '2026-09-30',
    lastLoginDate: '2026-11-04T19:22:10Z', // Logged in post resignation!
    assignedApplications: ['app-fms', 'app-cbs', 'app-collab'],
    permissions: [
      {
        id: 'perm-001-1',
        employeeId: 'emp-001',
        applicationId: 'app-fms',
        applicationName: 'Financial Management System',
        roleId: 'fms-editor',
        roleName: 'General Accountant',
        level: 'READ_WRITE',
        specificEntitlements: ['Journal_Post_Direct', 'GL_Account_Reconcile'],
        grantedDate: '2021-03-20',
        grantedBy: 'Tinashe Zimuto',
        lastUsedDate: '2026-11-04',
        lastReviewedDate: '2026-04-12'
      },
      {
        id: 'perm-001-2',
        employeeId: 'emp-001',
        applicationId: 'app-cbs',
        applicationName: 'Core Banking Operations System',
        roleId: 'cbs-officer',
        roleName: 'Credit Facilities Officer',
        level: 'READ_WRITE',
        specificEntitlements: ['Credit_Facility_Origination', 'Customer_Limit_Adjust'],
        grantedDate: '2022-01-10',
        grantedBy: 'Tatenda Mutembedza',
        lastUsedDate: '2026-10-28',
        lastReviewedDate: '2026-04-12'
      }
    ],
    riskScore: 0,
    riskLevel: 'CRITICAL',
    riskFactors: [],
    lastAccessReviewDate: '2026-04-12',
    isPrivilegedUser: false
  });

  // 2. BENCHMARK SCENARIO 2: ACCOUNTANT WITH UNNECESSARY ADMIN PRIVILEGES
  employees.push({
    id: 'emp-002',
    employeeNumber: 'JFS-0007',
    firstName: 'John',
    lastName: 'Moyo',
    fullName: 'John Moyo',
    email: 'john.moyo@jenaya-finance.co.zw',
    department: 'Finance & Accounting',
    departmentId: 'dept-fin',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Senior Financial Accountant',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-01',
    managerName: 'Ruvimbo Dube',
    dateOfEmployment: '2020-07-01',
    lastLoginDate: '2026-11-06T01:45:00Z',
    assignedApplications: ['app-fms', 'app-dba', 'app-collab'],
    permissions: [
      {
        id: 'perm-002-1',
        employeeId: 'emp-002',
        applicationId: 'app-fms',
        applicationName: 'Financial Management System',
        roleId: 'fms-editor',
        roleName: 'General Accountant',
        level: 'READ_WRITE',
        specificEntitlements: ['Journal_Post_Direct', 'GL_Account_Reconcile'],
        grantedDate: '2020-07-10',
        grantedBy: 'Ruvimbo Dube',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-07-15'
      },
      {
        id: 'perm-002-2',
        employeeId: 'emp-002',
        applicationId: 'app-dba',
        applicationName: 'Database Administration Console',
        roleId: 'dba-engineer',
        roleName: 'Database Administrator',
        level: 'ADMIN', // EXCESSIVE! Non-IT holds DBA root
        specificEntitlements: ['DBA_DDL_Execute', 'DB_Table_Drop_Alter', 'DBA_Super_User'],
        grantedDate: '2024-02-18',
        grantedBy: 'Former IT contractor',
        justification: 'Requested temporary access for year-end audit extraction in 2024; never revoked.',
        lastUsedDate: '2026-09-12',
        lastReviewedDate: '2025-12-10'
      }
    ],
    riskScore: 0,
    riskLevel: 'HIGH',
    riskFactors: [],
    lastAccessReviewDate: '2026-07-15',
    isPrivilegedUser: true
  });

  // 3. BENCHMARK SCENARIO 3: TRANSFERRED EMPLOYEE RETAINING PREVIOUS DEPARTMENT PRIVILEGES
  employees.push({
    id: 'emp-003',
    employeeNumber: 'JFS-0023',
    firstName: 'Farai',
    lastName: 'Sithole',
    fullName: 'Farai Sithole',
    email: 'farai.sithole@jenaya-finance.co.zw',
    department: 'Procurement & Logistics',
    departmentId: 'dept-proc',
    branch: 'Bulawayo Commercial Hub',
    branchId: 'br-byo-comm',
    jobTitle: 'Senior Procurement Specialist',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-06',
    managerName: 'Simbarashe Zhou',
    dateOfEmployment: '2019-11-12',
    departmentTransferDate: '2026-05-01',
    previousDepartment: 'Finance & Accounting',
    lastLoginDate: '2026-11-05T14:10:00Z',
    assignedApplications: ['app-proc', 'app-fms', 'app-collab'],
    permissions: [
      {
        id: 'perm-003-1',
        employeeId: 'emp-003',
        applicationId: 'app-proc',
        applicationName: 'Procurement & Vendor Portal',
        roleId: 'proc-buyer',
        roleName: 'Procurement Officer',
        level: 'READ_WRITE',
        specificEntitlements: ['PO_Creation_Approval', 'Vendor_Tender_Evaluate'],
        grantedDate: '2026-05-05',
        grantedBy: 'Simbarashe Zhou',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-06-20'
      },
      {
        id: 'perm-003-2',
        employeeId: 'emp-003',
        applicationId: 'app-fms',
        applicationName: 'Financial Management System',
        roleId: 'fms-approver',
        roleName: 'Finance Controller', // Legacy permission!
        level: 'ADMIN',
        specificEntitlements: ['Invoice_Matching_Post', 'Payment_Voucher_Approve'],
        grantedDate: '2022-04-10',
        grantedBy: 'Ruvimbo Dube',
        lastUsedDate: '2026-10-18',
        lastReviewedDate: '2026-03-15'
      }
    ],
    riskScore: 0,
    riskLevel: 'HIGH',
    riskFactors: [],
    lastAccessReviewDate: '2026-06-20',
    isPrivilegedUser: true
  });

  // 4. BENCHMARK SCENARIO 4: SEGREGATION OF DUTIES (SoD) CONFLICTING COMBINATIONS
  employees.push({
    id: 'emp-004',
    employeeNumber: 'JFS-0034',
    firstName: 'Blessing',
    lastName: 'Mutasa',
    fullName: 'Blessing Mutasa',
    email: 'blessing.mutasa@jenaya-finance.co.zw',
    department: 'Finance & Accounting',
    departmentId: 'dept-fin',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Accounts Payable Manager',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-01',
    managerName: 'Ruvimbo Dube',
    dateOfEmployment: '2022-05-18',
    lastLoginDate: '2026-11-06T00:30:00Z',
    assignedApplications: ['app-fms', 'app-collab'],
    permissions: [
      {
        id: 'perm-004-1',
        employeeId: 'emp-004',
        applicationId: 'app-fms',
        applicationName: 'Financial Management System',
        roleId: 'fms-editor',
        roleName: 'Vendor & Payments Lead',
        level: 'READ_WRITE',
        // CONFLICT: Can create vendors AND release payments!
        specificEntitlements: [
          'Vendor_Master_Create_Edit',
          'Payment_Release_Authorize',
          'Invoice_Matching_Post'
        ],
        grantedDate: '2023-01-15',
        grantedBy: 'Ruvimbo Dube',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-05-10'
      }
    ],
    riskScore: 0,
    riskLevel: 'CRITICAL',
    riskFactors: [],
    lastAccessReviewDate: '2026-05-10',
    isPrivilegedUser: false
  });

  // 5. BENCHMARK SCENARIO 5: UNREVIEWED ACCESS OVERDUE (>180 DAYS)
  employees.push({
    id: 'emp-005',
    employeeNumber: 'JFS-0041',
    firstName: 'Chipo',
    lastName: 'Ndlovu',
    fullName: 'Chipo Ndlovu',
    email: 'chipo.ndlovu@jenaya-finance.co.zw',
    department: 'Banking Operations & Treasury',
    departmentId: 'dept-bnk',
    branch: 'Bulawayo Commercial Hub',
    branchId: 'br-byo-comm',
    jobTitle: 'Operations Clearing Officer',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-02',
    managerName: 'Tatenda Mutembedza',
    dateOfEmployment: '2023-02-01',
    lastLoginDate: '2026-11-04T11:00:00Z',
    assignedApplications: ['app-cbs', 'app-swift', 'app-collab'],
    permissions: [
      {
        id: 'perm-005-1',
        employeeId: 'emp-005',
        applicationId: 'app-cbs',
        applicationName: 'Core Banking Operations System',
        roleId: 'cbs-officer',
        roleName: 'Credit Facilities Officer',
        level: 'READ_WRITE',
        specificEntitlements: ['Customer_Limit_Adjust', 'Account_Unfreeze'],
        grantedDate: '2023-02-15',
        grantedBy: 'Tatenda Mutembedza',
        lastUsedDate: '2026-11-03',
        lastReviewedDate: '2025-10-14' // Overdue by >380 days!
      }
    ],
    riskScore: 0,
    riskLevel: 'MODERATE',
    riskFactors: [],
    lastAccessReviewDate: '2025-10-14',
    isPrivilegedUser: false
  });

  // 6. BENCHMARK SCENARIO 6: DORMANT ACCOUNT (>90 DAYS INACTIVE)
  employees.push({
    id: 'emp-006',
    employeeNumber: 'JFS-0052',
    firstName: 'Tariro',
    lastName: 'Gumbo',
    fullName: 'Tariro Gumbo',
    email: 'tariro.gumbo@jenaya-finance.co.zw',
    department: 'Risk & Compliance',
    departmentId: 'dept-rc',
    branch: 'Mutare Regional Centre',
    branchId: 'br-mut-reg',
    jobTitle: 'Compliance Officer (On Sabbatical Study)',
    employmentStatus: 'ON_LEAVE',
    managerId: 'emp-mgr-04',
    managerName: 'Fungai Muchena',
    dateOfEmployment: '2022-09-01',
    lastLoginDate: '2026-06-12T08:20:00Z', // 147 days ago!
    assignedApplications: ['app-aml', 'app-collab'],
    permissions: [
      {
        id: 'perm-006-1',
        employeeId: 'emp-006',
        applicationId: 'app-aml',
        applicationName: 'Anti-Money Laundering & Sanctions Monitor',
        roleId: 'aml-analyst',
        roleName: 'AML Compliance Analyst',
        level: 'READ_WRITE',
        specificEntitlements: ['AML_Alert_Close', 'PEP_Sanction_Search'],
        grantedDate: '2022-09-10',
        grantedBy: 'Fungai Muchena',
        lastUsedDate: '2026-06-12',
        isDormant: true,
        lastReviewedDate: '2026-04-10'
      }
    ],
    riskScore: 0,
    riskLevel: 'MODERATE',
    riskFactors: [],
    lastAccessReviewDate: '2026-04-10',
    isPrivilegedUser: false
  });

  // 7. KEY MANAGERS & SYSTEM ADMINS
  // Tino Moyo (Super Admin / Executive Security Director)
  employees.push({
    id: 'emp-mgr-08',
    employeeNumber: 'CTX-0001',
    firstName: 'Tino',
    lastName: 'Moyo',
    fullName: 'Tino Moyo',
    email: 'tino.moyo@centrix-security.com',
    department: 'Executive Security Governance',
    departmentId: 'dept-exec',
    branch: 'Harare Corporate HQ',
    branchId: 'br-hre-main',
    jobTitle: 'Chief Information Security Officer & Super Admin',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-08',
    managerName: 'Board of Directors',
    dateOfEmployment: '2018-01-01',
    lastLoginDate: '2026-11-10T14:30:00Z',
    assignedApplications: ['app-collab', 'app-hrms', 'app-crm'],
    permissions: [
      {
        id: 'perm-mgr8-1',
        employeeId: 'emp-mgr-08',
        applicationId: 'app-collab',
        applicationName: 'Enterprise Directory & Email Suite',
        roleId: 'col-admin',
        roleName: 'Identity Domain Administrator',
        level: 'SUPER_ADMIN',
        specificEntitlements: ['Executive_Governance_Oversight'],
        grantedDate: '2018-01-05',
        grantedBy: 'Board Committee',
        lastUsedDate: '2026-11-10',
        lastReviewedDate: '2026-10-01'
      }
    ],
    riskScore: 5,
    riskLevel: 'LOW',
    riskFactors: ['Compliant governance executive.'],
    lastAccessReviewDate: '2026-10-01',
    isPrivilegedUser: true
  });

  // Tinashe Zimuto (IT Admin)
  employees.push({
    id: 'emp-mgr-03',
    employeeNumber: 'JFS-0003',
    firstName: 'Tinashe',
    lastName: 'Zimuto',
    fullName: 'Tinashe Zimuto',
    email: 'tinashe.zimuto@jenaya-finance.co.zw',
    department: 'IT & Information Security',
    departmentId: 'dept-it',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Chief Information Security Officer & IT Admin',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-08',
    managerName: 'Alexander Jenaya',
    dateOfEmployment: '2019-02-15',
    lastLoginDate: '2026-11-06T03:00:00Z',
    assignedApplications: ['app-dba', 'app-collab', 'app-hrms'],
    permissions: [
      {
        id: 'perm-mgr3-1',
        employeeId: 'emp-mgr-03',
        applicationId: 'app-dba',
        applicationName: 'Database Administration Console',
        roleId: 'dba-root',
        roleName: 'Chief DBA (Super User)',
        level: 'SUPER_ADMIN',
        specificEntitlements: ['DBA_Super_User', 'DB_Cluster_Failover'],
        grantedDate: '2019-03-01',
        grantedBy: 'Alexander Jenaya',
        justification: 'Documented CISO mandate for infrastructure management.',
        lastUsedDate: '2026-11-06',
        lastReviewedDate: '2026-09-15'
      }
    ],
    riskScore: 10,
    riskLevel: 'LOW',
    riskFactors: ['Documented IT security administrator permissions.'],
    lastAccessReviewDate: '2026-09-15',
    isPrivilegedUser: true
  });

  // Dr. Chengetai Hove (Auditor)
  employees.push({
    id: 'emp-mgr-07',
    employeeNumber: 'JFS-0004',
    firstName: 'Chengetai',
    lastName: 'Hove',
    fullName: 'Dr. Chengetai Hove',
    email: 'chengetai.hove@jenaya-finance.co.zw',
    department: 'Internal Audit',
    departmentId: 'dept-aud',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Chief Internal Auditor',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-08',
    managerName: 'Alexander Jenaya',
    dateOfEmployment: '2019-06-01',
    lastLoginDate: '2026-11-05T16:45:00Z',
    assignedApplications: ['app-fms', 'app-cbs', 'app-collab'],
    permissions: [
      {
        id: 'perm-mgr7-1',
        employeeId: 'emp-mgr-07',
        applicationId: 'app-fms',
        applicationName: 'Financial Management System',
        roleId: 'fms-viewer',
        roleName: 'Financial Auditor (Read Only)',
        level: 'READ_ONLY',
        specificEntitlements: ['Audit_Read_General_Ledger'],
        grantedDate: '2019-06-10',
        grantedBy: 'Alexander Jenaya',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-09-01'
      }
    ],
    riskScore: 0,
    riskLevel: 'LOW',
    riskFactors: ['Strict read-only auditor access profile.'],
    lastAccessReviewDate: '2026-09-01',
    isPrivilegedUser: false
  });

  // Ruvimbo Dube (Finance Manager)
  employees.push({
    id: 'emp-mgr-01',
    employeeNumber: 'JFS-0002',
    firstName: 'Ruvimbo',
    lastName: 'Dube',
    fullName: 'Ruvimbo Dube',
    email: 'ruvimbo.dube@jenaya-finance.co.zw',
    department: 'Finance & Accounting',
    departmentId: 'dept-fin',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Chief Financial Officer & Finance Director',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-08',
    managerName: 'Alexander Jenaya',
    dateOfEmployment: '2018-04-10',
    lastLoginDate: '2026-11-06T01:15:00Z',
    assignedApplications: ['app-fms', 'app-collab'],
    permissions: [
      {
        id: 'perm-mgr1-1',
        employeeId: 'emp-mgr-01',
        applicationId: 'app-fms',
        applicationName: 'Financial Management System',
        roleId: 'fms-approver',
        roleName: 'Finance Controller',
        level: 'ADMIN',
        specificEntitlements: ['Financial_Report_Signoff', 'Budget_Allocation_Approve'],
        grantedDate: '2018-04-15',
        grantedBy: 'Alexander Jenaya',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-08-20'
      }
    ],
    riskScore: 10,
    riskLevel: 'LOW',
    riskFactors: ['Departmental executive privileges.'],
    lastAccessReviewDate: '2026-08-20',
    isPrivilegedUser: true
  });

  // Kudzai Mpofu (Branch Manager)
  employees.push({
    id: 'emp-mgr-09',
    employeeNumber: 'JFS-0009',
    firstName: 'Kudzai',
    lastName: 'Mpofu',
    fullName: 'Kudzai Mpofu',
    email: 'kudzai.mpofu@jenaya-finance.co.zw',
    department: 'Banking Operations & Treasury',
    departmentId: 'dept-bnk',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Harare Main Branch General Manager',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-02',
    managerName: 'Tatenda Mutembedza',
    dateOfEmployment: '2019-09-01',
    lastLoginDate: '2026-11-05T08:00:00Z',
    assignedApplications: ['app-cbs', 'app-crm', 'app-collab'],
    permissions: [
      {
        id: 'perm-mgr9-1',
        employeeId: 'emp-mgr-09',
        applicationId: 'app-cbs',
        applicationName: 'Core Banking Operations System',
        roleId: 'cbs-mgr',
        roleName: 'Branch Operations Supervisor',
        level: 'ADMIN',
        specificEntitlements: ['Branch_Vault_Signoff', 'Transaction_Override_Approve'],
        grantedDate: '2019-09-10',
        grantedBy: 'Tatenda Mutembedza',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-08-15'
      }
    ],
    riskScore: 8,
    riskLevel: 'LOW',
    riskFactors: ['Standard branch executive privileges.'],
    lastAccessReviewDate: '2026-08-15',
    isPrivilegedUser: true
  });

  // Tatenda Mutembedza (Head of Banking Ops)
  employees.push({
    id: 'emp-mgr-02',
    employeeNumber: 'JFS-0005',
    firstName: 'Tatenda',
    lastName: 'Mutembedza',
    fullName: 'Tatenda Mutembedza',
    email: 'tatenda.mutembedza@jenaya-finance.co.zw',
    department: 'Banking Operations & Treasury',
    departmentId: 'dept-bnk',
    branch: 'Harare Main Branch (Headquarters)',
    branchId: 'br-hre-main',
    jobTitle: 'Head of Banking Operations & Treasury',
    employmentStatus: 'ACTIVE',
    managerId: 'emp-mgr-08',
    managerName: 'Alexander Jenaya',
    dateOfEmployment: '2019-01-15',
    lastLoginDate: '2026-11-06T00:45:00Z',
    assignedApplications: ['app-cbs', 'app-swift', 'app-collab'],
    permissions: [
      {
        id: 'perm-mgr2-1',
        employeeId: 'emp-mgr-02',
        applicationId: 'app-cbs',
        applicationName: 'Core Banking Operations System',
        roleId: 'cbs-mgr',
        roleName: 'Branch Operations Supervisor',
        level: 'ADMIN',
        specificEntitlements: ['Treasury_Liquidity_Transfer', 'Branch_Vault_Signoff'],
        grantedDate: '2019-02-01',
        grantedBy: 'Alexander Jenaya',
        lastUsedDate: '2026-11-05',
        lastReviewedDate: '2026-09-10'
      }
    ],
    riskScore: 12,
    riskLevel: 'LOW',
    riskFactors: ['Operational authority signoff permissions.'],
    lastAccessReviewDate: '2026-09-10',
    isPrivilegedUser: true
  });

  // Additional 89 employees systematically generated across departments & branches
  const firstNames = [
    'Tafadzwa', 'Kumbirai', 'Anesu', 'Chiedza', 'Tinashe', 'Munashe', 'Tanaka', 'Rutendo',
    'Panashe', 'Nyasha', 'Shamiso', 'Takudzwa', 'Ngonidzashe', 'Fadzai', 'Tawanda', 'Vimbai',
    'Tatenda', 'Danai', 'Chenai', 'Natsai', 'Simba', 'Rudo', 'Gamuchirai', 'Tinashe',
    'Tapiwa', 'Kundai', 'Paidamoyo', 'Tsitsi', 'Zvikomborero', 'Farirai', 'Bongani', 'Sibongile',
    'Sipho', 'Nkosana', 'Dumisani', 'Lindiwe', 'Mthokozisi', 'Senzokuhle', 'Thabani', 'Nomsa'
  ];

  const lastNames = [
    'Chikwanha', 'Marufu', 'Gatsi', 'Musarurwa', 'Muzenda', 'Bvute', 'Chiwara', 'Mukanya',
    'Gumbo', 'Mabika', 'Ndoro', 'Banda', 'Sibanda', 'Ncube', 'Tshuma', 'Nyathi', 'Dlodlo',
    'Khumalo', 'Mpofu', 'Nkiwane', 'Gore', 'Chirandu', 'Nyamuda', 'Munyoro', 'Zinyama',
    'Maphosa', 'Mathe', 'Mlambo', 'Moyo', 'Sithole', 'Hove', 'Shumba', 'Muringani', 'Rusike'
  ];

  const jobTemplates: Record<string, { titles: string[], apps: string[], roleId: string, roleName: string, level: PermissionLevel, entitlements: string[] }[]> = {
    'dept-fin': [
      { titles: ['Junior Accountant', 'Accounts Assistant'], apps: ['app-fms', 'app-collab'], roleId: 'fms-editor', roleName: 'General Accountant', level: 'READ_WRITE', entitlements: ['Journal_Post_Direct'] },
      { titles: ['Financial Analyst', 'Budget Officer'], apps: ['app-fms', 'app-collab'], roleId: 'fms-viewer', roleName: 'Financial Auditor', level: 'READ_ONLY', entitlements: ['Audit_Read_General_Ledger'] },
    ],
    'dept-bnk': [
      { titles: ['Retail Teller', 'Customer Service Representative'], apps: ['app-cbs', 'app-collab'], roleId: 'cbs-teller', roleName: 'Branch Teller', level: 'READ_WRITE', entitlements: ['Cash_Deposit_Process'] },
      { titles: ['Treasury Settlement Officer', 'FX Trader'], apps: ['app-cbs', 'app-swift', 'app-collab'], roleId: 'swf-operator', roleName: 'SWIFT Operator', level: 'READ_WRITE', entitlements: ['SWIFT_Message_Draft'] },
      { titles: ['Client Relationship Manager', 'Commercial Banker'], apps: ['app-crm', 'app-cbs', 'app-collab'], roleId: 'crm-agent', roleName: 'Client Relationship Officer', level: 'READ_WRITE', entitlements: ['Customer_KYC_Update'] },
    ],
    'dept-it': [
      { titles: ['Systems Administrator', 'Network Engineer'], apps: ['app-collab'], roleId: 'col-admin', roleName: 'Identity Domain Administrator', level: 'ADMIN', entitlements: ['User_Directory_Sync'] },
      { titles: ['Helpdesk Support Specialist'], apps: ['app-collab'], roleId: 'col-user', roleName: 'Standard Domain User', level: 'READ_WRITE', entitlements: ['Ticket_Resolve'] },
      { titles: ['Cybersecurity Incident Analyst'], apps: ['app-collab', 'app-aml'], roleId: 'aml-analyst', roleName: 'AML Compliance Analyst', level: 'READ_ONLY', entitlements: ['Security_Log_Monitor'] },
    ],
    'dept-rc': [
      { titles: ['Risk Officer', 'Regulatory Reporting Analyst'], apps: ['app-aml', 'app-collab'], roleId: 'aml-analyst', roleName: 'AML Compliance Analyst', level: 'READ_WRITE', entitlements: ['AML_Alert_Close'] },
      { titles: ['Sanctions Screener'], apps: ['app-aml', 'app-collab'], roleId: 'aml-analyst', roleName: 'AML Compliance Analyst', level: 'READ_ONLY', entitlements: ['PEP_Sanction_Search'] },
    ],
    'dept-hr': [
      { titles: ['HR Talent Specialist', 'Recruitment Officer'], apps: ['app-hrms', 'app-collab'], roleId: 'hrm-officer', roleName: 'HR Business Partner', level: 'READ_WRITE', entitlements: ['Employee_Onboard_File'] },
      { titles: ['Payroll Officer'], apps: ['app-pay', 'app-hrms', 'app-collab'], roleId: 'pay-specialist', roleName: 'Payroll Specialist', level: 'READ_WRITE', entitlements: ['Salary_Deduction_Enter'] },
    ],
    'dept-proc': [
      { titles: ['Procurement Officer', 'Sourcing Specialist'], apps: ['app-proc', 'app-collab'], roleId: 'proc-buyer', roleName: 'Procurement Officer', level: 'READ_WRITE', entitlements: ['PO_Creation_Approval'] },
      { titles: ['Logistics & Inventory Officer'], apps: ['app-proc', 'app-collab'], roleId: 'proc-buyer', roleName: 'Procurement Officer', level: 'READ_ONLY', entitlements: ['Goods_Receipt_Inspect'] },
    ],
    'dept-aud': [
      { titles: ['Internal Audit Associate', 'IT Audit Inspector'], apps: ['app-fms', 'app-cbs', 'app-collab'], roleId: 'fms-viewer', roleName: 'Financial Auditor', level: 'READ_ONLY', entitlements: ['Audit_Read_General_Ledger'] },
    ],
    'dept-exec': [
      { titles: ['Executive Assistant', 'Corporate Strategy Associate'], apps: ['app-collab', 'app-crm'], roleId: 'col-user', roleName: 'Standard Domain User', level: 'READ_WRITE', entitlements: ['Executive_Briefing_View'] },
    ]
  };

  const branchKeys = ['br-hre-main', 'br-byo-comm', 'br-mut-reg', 'br-vfa-corp'];
  const departmentKeys = Object.keys(jobTemplates);

  let currentCount = employees.length;
  let nameIndex = 0;

  while (currentCount < 100) {
    const deptId = departmentKeys[currentCount % departmentKeys.length];
    const deptObj = DEPARTMENTS.find(d => d.id === deptId)!;
    const branchId = branchKeys[currentCount % branchKeys.length];
    const branchObj = BRANCHES.find(b => b.id === branchId)!;
    
    const templates = jobTemplates[deptId];
    const tmpl = templates[currentCount % templates.length];
    const title = tmpl.titles[currentCount % tmpl.titles.length];

    const fName = firstNames[nameIndex % firstNames.length];
    const lName = lastNames[(nameIndex + Math.floor(currentCount / 7)) % lastNames.length];
    nameIndex++;

    const empNum = `JFS-${(currentCount + 10).toString().padStart(4, '0')}`;
    const empId = `emp-${(currentCount + 1).toString().padStart(3, '0')}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${currentCount > 50 ? currentCount : ''}@jenaya-finance.co.zw`;

    // Vary review dates and employment date
    const startYear = 2020 + (currentCount % 6);
    const startMonth = ((currentCount % 12) + 1).toString().padStart(2, '0');
    const hireDate = `${startYear}-${startMonth}-10`;

    // Last access review date
    const reviewMonth = ((currentCount % 4) + 6).toString().padStart(2, '0');
    const lastRevDate = `2026-${reviewMonth}-15`;

    const permissions = tmpl.apps.map((appId, idx) => {
      const app = APPLICATIONS.find(a => a.id === appId)!;
      return {
        id: `perm-${empId}-${idx}`,
        employeeId: empId,
        applicationId: appId,
        applicationName: app.name,
        roleId: tmpl.roleId,
        roleName: tmpl.roleName,
        level: tmpl.level,
        specificEntitlements: tmpl.entitlements,
        grantedDate: hireDate,
        grantedBy: deptObj.managerName,
        lastUsedDate: '2026-11-04',
        lastReviewedDate: lastRevDate,
        isDormant: false
      };
    });

    employees.push({
      id: empId,
      employeeNumber: empNum,
      firstName: fName,
      lastName: lName,
      fullName: `${fName} ${lName}`,
      email,
      department: deptObj.name,
      departmentId: deptObj.id,
      branch: branchObj.name,
      branchId: branchObj.id,
      jobTitle: title,
      employmentStatus: 'ACTIVE',
      managerId: deptObj.managerId,
      managerName: deptObj.managerName,
      dateOfEmployment: hireDate,
      lastLoginDate: '2026-11-05T09:30:00Z',
      assignedApplications: tmpl.apps,
      permissions,
      riskScore: 5 + (currentCount % 12),
      riskLevel: 'LOW',
      riskFactors: ['Compliant role-based access baseline.'],
      lastAccessReviewDate: lastRevDate,
      isPrivilegedUser: tmpl.level === 'ADMIN' || tmpl.level === 'SUPER_ADMIN'
    });

    currentCount++;
  }

  // Calculate explainable risk scores for all seeded employees
  return employees.map(emp => {
    const analysis = analyzeEmployeeRisk(emp, APPLICATIONS, SOD_RULES);
    return {
      ...emp,
      riskScore: analysis.score,
      riskLevel: analysis.level,
      riskFactors: analysis.factors
    };
  });
}

export const INITIAL_EMPLOYEES: Employee[] = generateSeededEmployees();

export const INITIAL_CAMPAIGNS: RecertificationCampaign[] = [
  {
    id: 'camp-q4-2026',
    campaignCode: 'RC-2026-Q4',
    name: 'Q4 2026 Enterprise User Access Recertification',
    description: 'Mandatory quarterly recertification across all core banking, financial and procurement systems for ISO 27001 & Reserve Bank of Zimbabwe compliance.',
    reviewPeriod: 'Q4 2026 (Oct - Dec)',
    startDate: '2026-10-01',
    deadline: '2026-11-20',
    includedDepartmentIds: ['dept-fin', 'dept-bnk', 'dept-proc', 'dept-it'],
    includedApplicationIds: ['app-fms', 'app-cbs', 'app-proc', 'app-dba', 'app-swift'],
    assignedReviewerIds: ['emp-mgr-01', 'emp-mgr-02', 'emp-mgr-03', 'emp-mgr-06'],
    totalReviewItems: 36,
    completedReviewItems: 24,
    revokedReviewItems: 3,
    modifiedReviewItems: 2,
    escalatedReviewItems: 1,
    status: 'ACTIVE',
    createdBy: 'Alexander Jenaya',
    createdDate: '2026-09-25'
  },
  {
    id: 'camp-q3-2026',
    campaignCode: 'RC-2026-Q3',
    name: 'Q3 2026 High-Privilege & Financial Systems Recertification',
    description: 'Quarterly review of all administrative accounts, root database privileges and treasury settlement credentials.',
    reviewPeriod: 'Q3 2026 (Jul - Sep)',
    startDate: '2026-07-01',
    deadline: '2026-08-15',
    includedDepartmentIds: ['dept-fin', 'dept-it', 'dept-bnk'],
    includedApplicationIds: ['app-fms', 'app-cbs', 'app-dba', 'app-swift'],
    assignedReviewerIds: ['emp-mgr-01', 'emp-mgr-02', 'emp-mgr-03'],
    totalReviewItems: 28,
    completedReviewItems: 28,
    revokedReviewItems: 4,
    modifiedReviewItems: 1,
    escalatedReviewItems: 0,
    status: 'COMPLETED',
    createdBy: 'Alexander Jenaya',
    createdDate: '2026-06-25'
  },
  {
    id: 'camp-sod-2026',
    campaignCode: 'RC-SOD-SPEC',
    name: 'Special Segregation of Duties (SoD) Remediation Review',
    description: 'Targeted compliance campaign addressing dual-entitlement conflicts in vendor creation and payment authorization.',
    reviewPeriod: 'Special Audit 2026',
    startDate: '2026-11-01',
    deadline: '2026-11-15',
    includedDepartmentIds: ['dept-fin', 'dept-proc'],
    includedApplicationIds: ['app-fms', 'app-proc'],
    assignedReviewerIds: ['emp-mgr-01', 'emp-mgr-06'],
    totalReviewItems: 12,
    completedReviewItems: 6,
    revokedReviewItems: 2,
    modifiedReviewItems: 1,
    escalatedReviewItems: 1,
    status: 'ACTIVE',
    createdBy: 'Dr. Chengetai Hove',
    createdDate: '2026-10-28'
  }
];

export const INITIAL_REVIEWS: RecertificationReviewItem[] = [
  {
    id: 'rev-001',
    campaignId: 'camp-q4-2026',
    employeeId: 'emp-001',
    employeeName: 'Tendai Chigumba',
    employeeJobTitle: 'Former Senior Treasury Officer',
    employeeDepartment: 'Finance & Accounting',
    applicationId: 'app-fms',
    applicationName: 'Financial Management System',
    roleName: 'General Accountant',
    permissionLevel: 'READ_WRITE',
    entitlements: ['Journal_Post_Direct', 'GL_Account_Reconcile'],
    reviewerId: 'emp-mgr-01',
    reviewerName: 'Ruvimbo Dube',
    decision: 'PENDING',
    isOverdue: true,
    dueDate: '2026-10-31'
  },
  {
    id: 'rev-002',
    campaignId: 'camp-q4-2026',
    employeeId: 'emp-002',
    employeeName: 'John Moyo',
    employeeJobTitle: 'Senior Financial Accountant',
    employeeDepartment: 'Finance & Accounting',
    applicationId: 'app-dba',
    applicationName: 'Database Administration Console',
    roleName: 'Database Administrator',
    permissionLevel: 'ADMIN',
    entitlements: ['DBA_DDL_Execute', 'DB_Table_Drop_Alter', 'DBA_Super_User'],
    reviewerId: 'emp-mgr-01',
    reviewerName: 'Ruvimbo Dube',
    decision: 'PENDING',
    isOverdue: false,
    dueDate: '2026-11-20'
  },
  {
    id: 'rev-003',
    campaignId: 'camp-q4-2026',
    employeeId: 'emp-003',
    employeeName: 'Farai Sithole',
    employeeJobTitle: 'Senior Procurement Specialist',
    employeeDepartment: 'Procurement & Logistics',
    applicationId: 'app-fms',
    applicationName: 'Financial Management System',
    roleName: 'Finance Controller',
    permissionLevel: 'ADMIN',
    entitlements: ['Invoice_Matching_Post', 'Payment_Voucher_Approve'],
    reviewerId: 'emp-mgr-06',
    reviewerName: 'Simbarashe Zhou',
    decision: 'PENDING',
    isOverdue: false,
    dueDate: '2026-11-20'
  },
  {
    id: 'rev-004',
    campaignId: 'camp-q4-2026',
    employeeId: 'emp-004',
    employeeName: 'Blessing Mutasa',
    employeeJobTitle: 'Accounts Payable Manager',
    employeeDepartment: 'Finance & Accounting',
    applicationId: 'app-fms',
    applicationName: 'Financial Management System',
    roleName: 'Vendor & Payments Lead',
    permissionLevel: 'READ_WRITE',
    entitlements: ['Vendor_Master_Create_Edit', 'Payment_Release_Authorize'],
    reviewerId: 'emp-mgr-01',
    reviewerName: 'Ruvimbo Dube',
    decision: 'PENDING',
    isOverdue: false,
    dueDate: '2026-11-20'
  },
  {
    id: 'rev-005',
    campaignId: 'camp-q4-2026',
    employeeId: 'emp-005',
    employeeName: 'Chipo Ndlovu',
    employeeJobTitle: 'Operations Clearing Officer',
    employeeDepartment: 'Banking Operations & Treasury',
    applicationId: 'app-cbs',
    applicationName: 'Core Banking Operations System',
    roleName: 'Credit Facilities Officer',
    permissionLevel: 'READ_WRITE',
    entitlements: ['Customer_Limit_Adjust', 'Account_Unfreeze'],
    reviewerId: 'emp-mgr-02',
    reviewerName: 'Tatenda Mutembedza',
    decision: 'PENDING',
    isOverdue: true,
    dueDate: '2026-10-31'
  },
  {
    id: 'rev-006',
    campaignId: 'camp-q4-2026',
    employeeId: 'emp-mgr-09',
    employeeName: 'Kudzai Mpofu',
    employeeJobTitle: 'Harare Main Branch General Manager',
    employeeDepartment: 'Banking Operations & Treasury',
    applicationId: 'app-cbs',
    applicationName: 'Core Banking Operations System',
    roleName: 'Branch Operations Supervisor',
    permissionLevel: 'ADMIN',
    entitlements: ['Branch_Vault_Signoff', 'Transaction_Override_Approve'],
    reviewerId: 'emp-mgr-02',
    reviewerName: 'Tatenda Mutembedza',
    decision: 'CERTIFIED',
    decisionJustification: 'Required for ongoing branch leadership and cash vault oversight duties.',
    decisionTimestamp: '2026-10-18T10:30:00Z',
    isOverdue: false,
    dueDate: '2026-11-20'
  }
];

export const INITIAL_APPROVAL_WORKFLOWS: ApprovalWorkflow[] = [
  {
    id: 'wf-001',
    workflowCode: 'REQ-2026-0891',
    requestType: 'RECERTIFICATION_REVOCATION',
    employeeId: 'emp-001',
    employeeName: 'Tendai Chigumba',
    applicationId: 'app-fms',
    applicationName: 'Financial Management System',
    requestedRole: 'General Accountant (Revoke)',
    requestedLevel: 'NO_ACCESS',
    requesterId: 'emp-mgr-01',
    requesterName: 'Ruvimbo Dube',
    submittedDate: '2026-11-04',
    currentStep: 2,
    totalSteps: 3,
    status: 'PENDING',
    justification: 'Employee resigned on 2026-09-30; complete deprovisioning required across all financial modules.',
    riskAssessment: {
      score: 75,
      level: 'CRITICAL',
      detectedViolations: ['VIO-TRM-JFS-0012: Terminated Employee Active Access']
    },
    steps: [
      { stepNumber: 1, stepName: 'Department Manager Review', approverRole: 'Finance Director', approverName: 'Ruvimbo Dube', approverId: 'emp-mgr-01', status: 'APPROVED', decidedAt: '2026-11-04T14:30:00Z', comments: 'Confirmed employee resignation. Approved for de-provisioning.' },
      { stepNumber: 2, stepName: 'Application Owner Validation', approverRole: 'FMS Application Owner', approverName: 'Ruvimbo Dube', approverId: 'emp-mgr-01', status: 'PENDING', comments: 'Pending confirmation of zero open reconciling batches.' },
      { stepNumber: 3, stepName: 'IT Security Execution', approverRole: 'IT Administrator', approverName: 'Tinashe Zimuto', approverId: 'emp-mgr-03', status: 'PENDING' }
    ]
  },
  {
    id: 'wf-002',
    workflowCode: 'REQ-2026-0884',
    requestType: 'SOD_EXCEPTION',
    employeeId: 'emp-004',
    employeeName: 'Blessing Mutasa',
    applicationId: 'app-fms',
    applicationName: 'Financial Management System',
    requestedRole: 'Payment Release Removal',
    requestedLevel: 'READ_WRITE',
    requesterId: 'emp-mgr-07',
    requesterName: 'Dr. Chengetai Hove',
    submittedDate: '2026-11-02',
    currentStep: 1,
    totalSteps: 3,
    status: 'PENDING',
    justification: 'Remediate toxic SoD combination: remove Payment_Release_Authorize entitlement.',
    riskAssessment: {
      score: 70,
      level: 'CRITICAL',
      detectedViolations: ['VIO-SOD-FIN-01-JFS-0034: Vendor Master vs Payment Release']
    },
    steps: [
      { stepNumber: 1, stepName: 'Department Manager Review', approverRole: 'Finance Director', approverName: 'Ruvimbo Dube', approverId: 'emp-mgr-01', status: 'PENDING' },
      { stepNumber: 2, stepName: 'Application Owner Validation', approverRole: 'FMS Application Owner', approverName: 'Ruvimbo Dube', approverId: 'emp-mgr-01', status: 'PENDING' },
      { stepNumber: 3, stepName: 'IT Security Execution', approverRole: 'IT Administrator', approverName: 'Tinashe Zimuto', approverId: 'emp-mgr-03', status: 'PENDING' }
    ]
  }
];

export const INITIAL_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    id: 'ca-001',
    actionCode: 'CA-2026-0042',
    issueTitle: 'De-provision Resigned Employee Tendai Chigumba',
    issueDescription: 'Former employee holds active credentials on Financial Management System and Core Banking after resigning on 2026-09-30.',
    affectedEmployeeId: 'emp-001',
    affectedEmployeeName: 'Tendai Chigumba',
    affectedApplicationId: 'app-fms',
    affectedApplicationName: 'Financial Management System',
    riskLevel: 'CRITICAL',
    recommendedAction: 'Immediately terminate account and revoke all entitlements in active directory and database.',
    assignedToId: 'emp-mgr-03',
    assignedToName: 'Tinashe Zimuto',
    dueDate: '2026-11-07',
    status: 'IN_PROGRESS',
    resolutionNotes: 'Active directory account flagged; executing final API de-provisioning on CBS and FMS.'
  },
  {
    id: 'ca-002',
    actionCode: 'CA-2026-0043',
    issueTitle: 'Revoke Database Root Access from Accountant John Moyo',
    issueDescription: 'John Moyo (Senior Financial Accountant) holds unauthorized DBA Administrator privilege on Database Administration Console.',
    affectedEmployeeId: 'emp-002',
    affectedEmployeeName: 'John Moyo',
    affectedApplicationId: 'app-dba',
    affectedApplicationName: 'Database Administration Console',
    riskLevel: 'HIGH',
    recommendedAction: 'De-assign dba-engineer role from user profile and audit past 90 days of DDL logs.',
    assignedToId: 'emp-mgr-03',
    assignedToName: 'Tinashe Zimuto',
    dueDate: '2026-11-09',
    status: 'ASSIGNED'
  },
  {
    id: 'ca-003',
    actionCode: 'CA-2026-0044',
    issueTitle: 'Segregate Vendor Creation and Payment Release (Blessing Mutasa)',
    issueDescription: 'SoD conflict detected where Blessing Mutasa can create new vendors and release payments in FMS.',
    affectedEmployeeId: 'emp-004',
    affectedEmployeeName: 'Blessing Mutasa',
    affectedApplicationId: 'app-fms',
    affectedApplicationName: 'Financial Management System',
    riskLevel: 'CRITICAL',
    recommendedAction: 'Remove Payment_Release_Authorize entitlement; transfer payment release duty to Treasury Head.',
    assignedToId: 'emp-mgr-01',
    assignedToName: 'Ruvimbo Dube',
    dueDate: '2026-11-08',
    status: 'OPEN'
  },
  {
    id: 'ca-004',
    actionCode: 'CA-2026-0045',
    issueTitle: 'Reclaim Legacy Finance Privileges from Farai Sithole',
    issueDescription: 'Employee transferred to Procurement on 2026-05-01 but retains administrative payment approval access in Finance.',
    affectedEmployeeId: 'emp-003',
    affectedEmployeeName: 'Farai Sithole',
    affectedApplicationId: 'app-fms',
    affectedApplicationName: 'Financial Management System',
    riskLevel: 'HIGH',
    recommendedAction: 'Revoke FMS Finance Controller role and update procurement role baseline.',
    assignedToId: 'emp-mgr-06',
    assignedToName: 'Simbarashe Zhou',
    dueDate: '2026-11-12',
    status: 'OPEN'
  }
];

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'aud-001',
    timestamp: '2026-11-06T03:02:14Z',
    actorId: 'emp-mgr-08',
    actorName: 'Alexander Jenaya',
    actorRole: 'SUPER_ADMIN',
    action: 'RISK_ENGINE_EVALUATION',
    category: 'RISK_DETECTION',
    description: 'Executed scheduled rules-based risk assessment across 100 enterprise identities. Flagged 4 critical and 2 high risk identities.',
    ipAddress: '192.168.10.24',
    severity: 'WARNING'
  },
  {
    id: 'aud-002',
    timestamp: '2026-11-06T02:45:30Z',
    actorId: 'emp-mgr-03',
    actorName: 'Tinashe Zimuto',
    actorRole: 'IT_ADMIN',
    action: 'APPLICATION_SYNC',
    category: 'SYSTEM_CONFIG',
    targetApplicationId: 'app-fms',
    targetApplicationName: 'Financial Management System',
    description: 'Completed automated SCIM synchronization with Financial Management System (28 active accounts matched).',
    ipAddress: '192.168.10.88',
    severity: 'INFO'
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-05T14:12:05Z',
    actorId: 'emp-mgr-01',
    actorName: 'Ruvimbo Dube',
    actorRole: 'DEPARTMENT_MANAGER',
    action: 'RECERTIFICATION_REVIEW_SUBMITTED',
    category: 'RECERTIFICATION',
    targetEmployeeId: 'emp-mgr-09',
    targetEmployeeName: 'Kudzai Mpofu',
    targetApplicationId: 'app-cbs',
    targetApplicationName: 'Core Banking Operations System',
    previousValue: 'PENDING',
    newValue: 'CERTIFIED',
    description: 'Certified branch supervisory privileges for Kudzai Mpofu in Q4 2026 Campaign.',
    ipAddress: '192.168.12.105',
    severity: 'INFO'
  },
  {
    id: 'aud-004',
    timestamp: '2026-11-04T16:20:11Z',
    actorId: 'emp-mgr-07',
    actorName: 'Dr. Chengetai Hove',
    actorRole: 'AUDITOR',
    action: 'SOD_CONFLICT_FLAGGED',
    category: 'RISK_DETECTION',
    targetEmployeeId: 'emp-004',
    targetEmployeeName: 'Blessing Mutasa',
    targetApplicationId: 'app-fms',
    targetApplicationName: 'Financial Management System',
    description: 'Identified toxic combination SOD-FIN-01 (Vendor Creation + Payment Release) and initiated remediation ticket CA-2026-0044.',
    ipAddress: '192.168.10.15',
    severity: 'CRITICAL'
  },
  {
    id: 'aud-005',
    timestamp: '2026-11-04T11:05:22Z',
    actorId: 'emp-mgr-03',
    actorName: 'Tinashe Zimuto',
    actorRole: 'IT_ADMIN',
    action: 'CORRECTIVE_ACTION_INITIATED',
    category: 'CORRECTIVE_ACTION',
    targetEmployeeId: 'emp-001',
    targetEmployeeName: 'Tendai Chigumba',
    targetApplicationId: 'app-fms',
    targetApplicationName: 'Financial Management System',
    description: 'Created corrective action CA-2026-0042 to deprovision resigned employee Tendai Chigumba.',
    ipAddress: '192.168.10.88',
    severity: 'CRITICAL'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    title: 'Critical Security Alert: Terminated Employee Active Access',
    message: 'Tendai Chigumba (Status: RESIGNED) still retains active read/write permissions on Financial Management System & CBS.',
    timestamp: '15 mins ago',
    category: 'VIOLATION',
    severity: 'CRITICAL',
    isRead: false,
    linkTab: 'risks'
  },
  {
    id: 'notif-002',
    title: 'Recertification Campaign Deadline Approaching',
    message: 'Q4 2026 Enterprise User Access Recertification has 12 reviews pending. Deadline is 2026-11-20.',
    timestamp: '1 hour ago',
    category: 'CAMPAIGN',
    severity: 'WARNING',
    isRead: false,
    linkTab: 'recertification'
  },
  {
    id: 'notif-003',
    title: 'Segregation of Duties Violation Detected',
    message: 'Blessing Mutasa holds conflicting permissions (Vendor Creation & Payment Release) on FMS.',
    timestamp: '3 hours ago',
    category: 'VIOLATION',
    severity: 'CRITICAL',
    isRead: false,
    linkTab: 'risks'
  },
  {
    id: 'notif-004',
    title: 'Corrective Action Assigned to You',
    message: 'Corrective Action CA-2026-0042: De-provision Resigned Employee Tendai Chigumba requires execution.',
    timestamp: '5 hours ago',
    category: 'CORRECTIVE_ACTION',
    severity: 'INFO',
    isRead: true,
    linkTab: 'actions'
  }
];

export const DEMO_USERS: CurrentUser[] = [
  {
    id: 'emp-mgr-08',
    name: 'Tino Moyo',
    email: 'tino.moyo@centrix-security.com',
    role: 'SUPER_ADMIN',
    roleLabel: 'Super Admin',
    department: 'Executive Security Governance',
    branch: 'Harare Corporate HQ',
    avatarInitials: 'TM'
  },
  {
    id: 'emp-mgr-01',
    name: 'Ruvimbo Dube',
    email: 'ruvimbo.dube@jenaya-finance.co.zw',
    role: 'DEPARTMENT_MANAGER',
    roleLabel: 'Department Manager (Finance)',
    department: 'Finance & Accounting',
    branch: 'Harare Main HQ',
    avatarInitials: 'RD'
  },
  {
    id: 'emp-mgr-09',
    name: 'Kudzai Mpofu',
    email: 'kudzai.mpofu@jenaya-finance.co.zw',
    role: 'BRANCH_MANAGER',
    roleLabel: 'Branch Manager (Harare)',
    department: 'Banking Operations & Treasury',
    branch: 'Harare Main HQ',
    avatarInitials: 'KM'
  },
  {
    id: 'emp-mgr-03',
    name: 'Tinashe Zimuto',
    email: 'tinashe.zimuto@jenaya-finance.co.zw',
    role: 'IT_ADMIN',
    roleLabel: 'IT Administrator (SecOps)',
    department: 'IT & Information Security',
    branch: 'Harare Main HQ',
    avatarInitials: 'TZ'
  },
  {
    id: 'emp-mgr-07',
    name: 'Dr. Chengetai Hove',
    email: 'chengetai.hove@jenaya-finance.co.zw',
    role: 'AUDITOR',
    roleLabel: 'Internal Auditor (Read-Only)',
    department: 'Internal Audit',
    branch: 'Harare Main HQ',
    avatarInitials: 'CH'
  },
  {
    id: 'emp-002',
    name: 'John Moyo',
    email: 'john.moyo@jenaya-finance.co.zw',
    role: 'EMPLOYEE',
    roleLabel: 'Standard Employee (Accountant)',
    department: 'Finance & Accounting',
    branch: 'Harare Main HQ',
    avatarInitials: 'JM'
  }
];
