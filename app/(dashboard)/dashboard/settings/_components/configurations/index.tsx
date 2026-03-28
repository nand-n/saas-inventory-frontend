import { useRef } from "react";
import { ConfigFormHandle, ConfigurationForm } from "../forms/ConfigurationForm";
import useAuthStore from "@/store/auth/auth.store";

export default function Configurations() {
      const formRef = useRef<ConfigFormHandle>(null);
      const { tenantId } = useAuthStore();

      return (
            <div>
                  <ConfigurationForm tenantId={tenantId} ref={formRef} />
            </div>
      );
}