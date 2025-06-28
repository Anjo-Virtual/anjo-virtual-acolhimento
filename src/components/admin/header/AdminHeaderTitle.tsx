
import { Shield } from "lucide-react";

interface AdminHeaderTitleProps {
  title: string;
}

export const AdminHeaderTitle = ({ title }: AdminHeaderTitleProps) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        {title}
      </h1>
    </div>
  );
};
