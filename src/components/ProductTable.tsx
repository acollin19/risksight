import { useState } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "./RiskBadge";
import { TariffSimulator } from "./TariffSimulator";
import { MitigationStrategies } from "./MitigationStrategies";

export interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  currentCost: number;
  tariffPercent: number;
  note: string;
  riskLevel: "low" | "medium" | "high";
  strategies: Array<{ title: string; description: string }>;
}

interface ProductTableProps {
  products: Product[];
}

export const ProductTable = ({ products }: ProductTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const isExpanded = expandedId === product.id;
        const newCost = product.currentCost * (1 + product.tariffPercent / 100);

        return (
          <Card key={product.id} className="overflow-hidden">
            <button
              onClick={() => toggleExpand(product.id)}
              className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-medium">{product.origin}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Current Cost</p>
                    <p className="font-medium">${product.currentCost.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">New Cost</p>
                    <p className="font-semibold text-destructive">${newCost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">+{product.tariffPercent}%</p>
                  </div>

                  <div className="flex justify-end">
                    <RiskBadge level={product.riskLevel} />
                  </div>
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t bg-muted/20 p-6 space-y-6">
                <div className="bg-card rounded-lg p-4 border">
                  <h4 className="font-semibold text-sm mb-2">Policy Change Details</h4>
                  <p className="text-sm text-muted-foreground">{product.note}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Origin Country</p>
                      <p className="font-medium text-sm">{product.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Original Cost</p>
                      <p className="font-medium text-sm">${product.currentCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tariff Applied</p>
                      <p className="font-medium text-sm text-destructive">+{product.tariffPercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <p className="font-medium text-sm text-destructive">
                        +${(newCost - product.currentCost).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <TariffSimulator
                    currentCost={product.currentCost}
                    currentTariff={product.tariffPercent}
                    productName={product.name}
                  />
                  <MitigationStrategies strategies={product.strategies} />
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
