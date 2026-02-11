"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Integration,
  IntegrationType,
  INTEGRATION_CONFIGS,
  INTEGRATION_TYPES,
} from "@lifeos/types";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { AddIntegrationDialog } from "@/components/integrations/add-integration-dialog";

// Mock data for demo - in a real app this would come from backend/state
const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "1",
    type: "google_calendar",
    name: "Personal Calendar",
    email: "ian@gmail.com",
    connected: true,
    connectedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "gmail",
    name: "Work Email",
    email: "ian@company.com",
    connected: true,
    connectedAt: "2024-01-10T14:20:00Z",
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] =
    useState<Integration[]>(MOCK_INTEGRATIONS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddIntegration = (type: IntegrationType, name: string, email?: string) => {
    const newIntegration: Integration = {
      id: crypto.randomUUID(),
      type,
      name,
      email,
      connected: true,
      connectedAt: new Date().toISOString(),
    };
    setIntegrations([...integrations, newIntegration]);
    setIsAddDialogOpen(false);
  };

  const handleRemoveIntegration = (id: string) => {
    setIntegrations(integrations.filter((i) => i.id !== id));
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((i) =>
        i.id === id ? { ...i, connected: !i.connected } : i
      )
    );
  };

  // Group integrations by type
  const integrationsByType = INTEGRATION_TYPES.reduce(
    (acc, type) => {
      acc[type] = integrations.filter((i) => i.type === type);
      return acc;
    },
    {} as Record<IntegrationType, Integration[]>
  );

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Integrations</h1>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-8">
          {INTEGRATION_TYPES.map((type) => {
            const config = INTEGRATION_CONFIGS[type];
            const typeIntegrations = integrationsByType[type];

            return (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: config.color + "20" }}
                  >
                    <IntegrationIcon type={type} color={config.color} />
                  </div>
                  <div>
                    <h2 className="font-medium">{config.label}</h2>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>

                {typeIntegrations.length > 0 ? (
                  <div className="grid gap-3 pl-11">
                    {typeIntegrations.map((integration) => (
                      <IntegrationCard
                        key={integration.id}
                        integration={integration}
                        onRemove={() => handleRemoveIntegration(integration.id)}
                        onToggle={() => handleToggleIntegration(integration.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="pl-11">
                    <p className="text-sm text-muted-foreground italic">
                      No {config.label} integrations connected
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <AddIntegrationDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddIntegration}
        />
      </div>
    </div>
  );
}

function IntegrationIcon({
  type,
  color,
}: {
  type: IntegrationType;
  color: string;
}) {
  const iconProps = { className: "h-4 w-4", style: { color } };

  switch (type) {
    case "google_calendar":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
        </svg>
      );
    case "gmail":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
    case "outlook":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case "messages":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      );
  }
}
