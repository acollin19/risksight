import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface Strategy {
  title: string;
  description: string;
}

interface MitigationStrategiesProps {
  strategies: Strategy[];
}

export const MitigationStrategies = ({ strategies }: MitigationStrategiesProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          <CardTitle className="text-lg">Mitigation Strategies</CardTitle>
        </div>
        <CardDescription>
          Explore options to manage tariff impacts on your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {strategies.map((strategy, index) => (
            <li key={index} className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">{strategy.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
