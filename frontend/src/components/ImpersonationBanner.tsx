import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, LogOut } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { user, endImpersonation, isLoading } = useAuth();

  if (!user?.isImpersonating) return null;

  const employeeName = user.employee
    ? `${user.employee.first_name} ${user.employee.last_name}`
    : user.email;

  const roleName = user.role?.name || user.role?.id || 'Employee';

  const handleEnd = async () => {
    const success = await endImpersonation();
    if (success) {
      window.location.href = '/employees';
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-neutral-950 px-4 py-2 text-xs sm:text-sm font-medium shadow-md sticky top-0 z-50 flex items-center justify-between border-b border-amber-600">
      <div className="flex items-center gap-2 max-w-[75%] truncate">
        <span className="flex items-center gap-1.5 bg-black/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider text-black">
          <UserCheck className="w-3.5 h-3.5" />
          Impersonation Session
        </span>
        <span className="truncate">
          Viewing portal as <strong>{employeeName}</strong> ({roleName})
        </span>
      </div>

      <button
        onClick={handleEnd}
        disabled={isLoading}
        className="bg-neutral-900 hover:bg-black text-white px-3 py-1 rounded-md text-xs font-semibold transition-all shadow hover:shadow-md flex items-center gap-1.5 shrink-0"
      >
        <LogOut className="w-3 h-3" />
        <span>End Session</span>
      </button>
    </div>
  );
};
