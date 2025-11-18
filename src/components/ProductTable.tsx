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
  directTariff: number; // Direct import tariff on finished product
  materialCostIncrease: number; // Percentage increase from upstream/material tariffs
  note: string;
  riskLevel: "low" | "medium" | "high";
  strategies: Array<{ title: string; description: string }>;
}

// Helper to calculate total tariff impact
export const calculateTotalImpact = (product: Product) => {
  const directImpact = product.currentCost * (product.directTariff / 100);
  const materialImpact = product.currentCost * (product.materialCostIncrease / 100);
  return directImpact + materialImpact;
};

export const calculateNewCost = (product: Product) => {
  return product.currentCost + calculateTotalImpact(product);
};

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
        const newCost = calculateNewCost(product);
        const totalImpact = calculateTotalImpact(product);
        const totalPercent = product.directTariff + product.materialCostIncrease;

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
                    <p className="text-xs text-muted-foreground">+{totalPercent}%</p>
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
                  <p className="text-sm text-muted-foreground mb-4">{product.note}</p>
                  
                  {/* Cost Breakdown */}
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h5 className="font-medium text-sm">Cost Impact Breakdown</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Original Cost:</span>
                        <span className="font-medium">${product.currentCost.toFixed(2)}</span>
                      </div>
                      
                      {product.directTariff > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Direct Import Tariff ({product.directTariff}%):
                          </span>
                          <span className="font-medium text-destructive">
                            +${(product.currentCost * product.directTariff / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      {product.materialCostIncrease > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Material/Component Cost Increase ({product.materialCostIncrease}%):
                          </span>
                          <span className="font-medium text-warning">
                            +${(product.currentCost * product.materialCostIncrease / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="font-semibold">Total New Cost:</span>
                        <span className="font-bold text-destructive text-base">
                          ${newCost.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Impact:</span>
                        <span className="font-medium text-destructive">
                          +${totalImpact.toFixed(2)} (+{totalPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Origin Country</p>
                      <p className="font-medium text-sm">{product.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact Type</p>
                      <p className="font-medium text-sm">
                        {product.directTariff > 0 && product.materialCostIncrease > 0
                          ? "Direct + Materials"
                          : product.directTariff > 0
                          ? "Direct Tariff"
                          : "Material Costs"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className="font-medium text-sm capitalize">{product.riskLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <TariffSimulator
                    currentCost={product.currentCost}
                    directTariff={product.directTariff}
                    materialCostIncrease={product.materialCostIncrease}
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
