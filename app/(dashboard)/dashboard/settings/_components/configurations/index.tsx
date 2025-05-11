import { useRef } from "react";
import { ConfigFormHandle, ConfigurationForm } from "../forms/ConfigurationForm";

export default function Configurations() {
          const formRef = useRef<ConfigFormHandle>(null)
    
    return <div>
          <ConfigurationForm tenantId="f99d3371-7406-4fa6-bd88-2ae24da29e5a" ref={formRef} />
    </div>
}