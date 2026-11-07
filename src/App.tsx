import React from 'react';
import { AccessGuardProvider, useAccessGuard } from './context/AccessGuardContext';
import { CentrixNavbar } from './components/layout/CentrixNavbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { ComplianceHelpModal } from './components/layout/ComplianceHelpModal';

// 12 Feature Modules
import { CentrixDashboard } from './components/overview/CentrixDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { IdentityManagement } from './components/identities/IdentityManagement';
import { SystemsManagement } from './components/systems/SystemsManagement';
import { AccessPermissions } from './components/permissions/AccessPermissions';
import { RecertificationCentre } from './components/recertification/RecertificationCentre';
import { RiskAndViolations } from './components/risks/RiskAndViolations';
import { ApprovalWorkflows } from './components/workflows/ApprovalWorkflows';
import { CorrectiveActions } from './components/actions/CorrectiveActions';
import { ReportsAndAnalytics } from './components/reports/ReportsAndAnalytics';
import { AuditTrail } from './components/audit/AuditTrail';
import { OrganisationSettings } from './components/settings/OrganisationSettings';

const MainContent: React.FC = () => {
  const { activeTab } = useAccessGuard();

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <CentrixDashboard />;
      case 'employees':
        return <EmployeeDirectory />;
      case 'identities':
        return <IdentityManagement />;
      case 'systems':
        return <SystemsManagement />;
      case 'permissions':
        return <AccessPermissions />;
      case 'recertification':
        return <RecertificationCentre />;
      case 'risks':
        return <RiskAndViolations />;
      case 'workflows':
        return <ApprovalWorkflows />;
      case 'actions':
        return <CorrectiveActions />;
      case 'reports':
        return <ReportsAndAnalytics />;
      case 'audit':
        return <AuditTrail />;
      case 'settings':
        return <OrganisationSettings />;
      default:
        return <CentrixDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Centrix Navigation Bar */}
      <CentrixNavbar />

      {/* Main Viewport */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
        {renderActiveModule()}
      </main>

      {/* Global Modals */}
      <GlobalSearchModal />
      <NotificationsDrawer />
      <ComplianceHelpModal />
    </div>
  );
};

export default function App() {
  return (
    <AccessGuardProvider>
      <MainContent />
    </AccessGuardProvider>
  );
}
