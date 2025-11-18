import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  message: string;
  date: string;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    message: "New 44% tariff on Colombian coffee beans effective immediately",
    date: "2024-01-15",
  },
  {
    id: "2",
    message: "12% tariff increase on imported espresso machines from Italy",
    date: "2024-01-10",
  },
];

export const AlertBanner = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="bg-warning/10 border-l-4 border-warning">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start justify-between gap-4 p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Updated: {new Date(alert.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => dismissAlert(alert.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
