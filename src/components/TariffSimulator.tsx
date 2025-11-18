import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface TariffSimulatorProps {
  currentCost: number;
  directTariff: number;
  materialCostIncrease: number;
  productName: string;
}

export const TariffSimulator = ({
  currentCost,
  directTariff,
  materialCostIncrease,
  productName,
}: TariffSimulatorProps) => {
  const currentTotal = directTariff + materialCostIncrease;
  const [simulatedDirect, setSimulatedDirect] = useState(directTariff);
  const [simulatedMaterial, setSimulatedMaterial] = useState(materialCostIncrease);

  const currentCostWithTariff = currentCost * (1 + currentTotal / 100);
  const simulatedTotal = simulatedDirect + simulatedMaterial;
  const calculatedCost = currentCost * (1 + simulatedTotal / 100);
  const difference = calculatedCost - currentCostWithTariff;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Tariff Simulator</CardTitle>
        </div>
        <CardDescription>
          Adjust the slider to see potential cost impacts for {productName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Direct Tariff:</span>
            <span className="text-xl font-bold text-primary">{simulatedDirect}%</span>
          </div>
          <Slider
            value={[simulatedDirect]}
            onValueChange={(value) => setSimulatedDirect(value[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Material Cost Increase:</span>
            <span className="text-xl font-bold text-warning">{simulatedMaterial}%</span>
          </div>
          <Slider
            value={[simulatedMaterial]}
            onValueChange={(value) => setSimulatedMaterial(value[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Impact:</span>
            <span className="text-2xl font-bold text-destructive">{simulatedTotal}%</span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Original Cost:</span>
            <span className="text-sm font-medium">${currentCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Current Total Impact ({currentTotal}%):</span>
            <span className="text-sm font-medium">
              ${currentCostWithTariff.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-sm font-semibold">Simulated Cost:</span>
            <span className="text-lg font-bold text-primary">
              ${calculatedCost.toFixed(2)}
            </span>
          </div>
          {difference !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Difference from Current:</span>
              <span
                className={
                  difference > 0 ? "text-destructive font-medium" : "text-success font-medium"
                }
              >
                {difference > 0 ? "+" : ""}${difference.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
