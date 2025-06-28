
import { AdminHeaderTitle } from "./header/AdminHeaderTitle";
import { AdminHeaderNavigation } from "./header/AdminHeaderNavigation";
import { AdminHeaderUserMenu } from "./header/AdminHeaderUserMenu";

interface AdminHeaderProps {
  title: string;
  userEmail?: string;
}

const AdminHeader = ({ title, userEmail }: AdminHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Title */}
      <AdminHeaderTitle title={title} />

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Navigation */}
        <AdminHeaderNavigation />

        {/* User Profile Dropdown */}
        <AdminHeaderUserMenu userEmail={userEmail} />
      </div>
    </header>
  );
};

export default AdminHeader;
