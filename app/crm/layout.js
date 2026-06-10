import { CrmProvider } from "@/components/crm/CrmProvider";
import CrmChrome from "@/components/crm/CrmChrome";

export const metadata = {
  title: "Jetro Education CRM",
  description: "Admissions, centers, employees, students, payments and reporting.",
  robots: { index: false, follow: false },
};

export default function CrmLayout({ children }) {
  return (
    <CrmProvider>
      <CrmChrome>{children}</CrmChrome>
    </CrmProvider>
  );
}
