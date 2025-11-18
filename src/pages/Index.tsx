import { useState } from "react";
import { Shield, TrendingUp, AlertCircle } from "lucide-react";
import { AlertBanner } from "@/components/AlertBanner";
import { ProductTable, Product, calculateTotalImpact } from "@/components/ProductTable";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Colombian Coffee Beans",
    category: "Beverages",
    origin: "Colombia",
    currentCost: 560,
    directTariff: 44,
    materialCostIncrease: 0,
    note: "44% direct import tariff on coffee beans routed through the US. This is a straightforward tariff on the finished agricultural product at the border.",
    riskLevel: "high",
    strategies: [
      {
        title: "Review Contract Terms",
        description: "Examine existing supply contracts for force majeure clauses or price adjustment mechanisms that may help absorb costs.",
      },
      {
        title: "Direct Sourcing Routes",
        description: "Explore direct shipping routes from Colombia that avoid US ports to potentially bypass this tariff.",
      },
      {
        title: "Explore Duty Drawback",
        description: "Check if you qualify for duty drawback programs that provide refunds on tariffs for re-exported goods.",
      },
    ],
  },
  {
    id: "2",
    name: "Espresso Machines",
    category: "Equipment",
    origin: "Italy",
    currentCost: 1200,
    directTariff: 12,
    materialCostIncrease: 8,
    note: "Combined impact: 12% direct tariff on finished machines PLUS 8% cost increase from upstream tariffs on steel, aluminum, and electronic components used in manufacturing.",
    riskLevel: "high",
    strategies: [
      {
        title: "Negotiate with Suppliers",
        description: "Italian manufacturers are also facing higher material costs. Discuss shared cost absorption or volume commitments to lock in better pricing.",
      },
      {
        title: "Consider Alternative Sources",
        description: "Research equipment manufacturers in tariff-free regions, though quality and service differences must be carefully evaluated.",
      },
      {
        title: "Plan Capital Purchases",
        description: "The compound effect of both tariff types makes timing critical. Consider accelerating purchases if further increases are expected.",
      },
      {
        title: "Extended Warranty/Service Plans",
        description: "Negotiate service agreements to maximize equipment lifespan and defer replacement costs.",
      },
    ],
  },
  {
    id: "3",
    name: "Vanilla Syrup",
    category: "Ingredients",
    origin: "USA",
    currentCost: 50,
    directTariff: 20,
    materialCostIncrease: 0,
    note: "20% direct tariff on finished syrup products from the US. As a processed food product, this is applied at the border on the complete item.",
    riskLevel: "medium",
    strategies: [
      {
        title: "Evaluate Local Suppliers",
        description: "Identify Canadian syrup manufacturers that could provide comparable products without import tariffs.",
      },
      {
        title: "Bulk Purchasing",
        description: "Consider increasing order sizes before further tariff changes, while balancing storage costs and shelf life.",
      },
      {
        title: "Product Mix Adjustment",
        description: "Review menu offerings to optimize the use of syrup products and potentially reduce overall volume needed.",
      },
    ],
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<"products" | "scenarios" | "alerts">("products");
  
  const totalProducts = sampleProducts.length;
  const highRiskCount = sampleProducts.filter((p) => p.riskLevel === "high").length;
  const avgImpact =
    sampleProducts.reduce((acc, p) => acc + calculateTotalImpact(p), 0) / totalProducts;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">RiskSight</h1>
                <p className="text-sm text-muted-foreground">SME Tariff & Policy Risk Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => setActiveTab("products")}
                className={cn(
                  "text-sm font-medium transition-colors pb-1",
                  activeTab === "products"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("scenarios")}
                className={cn(
                  "text-sm font-medium transition-colors pb-1",
                  activeTab === "scenarios"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Scenarios
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={cn(
                  "text-sm font-medium transition-colors pb-1",
                  activeTab === "alerts"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Alerts
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <AlertBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{totalProducts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Items</p>
                  <p className="text-3xl font-bold text-destructive mt-2">{highRiskCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Cost Impact</p>
                  <p className="text-3xl font-bold text-warning mt-2">${avgImpact.toFixed(0)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Products</h2>
              <p className="text-muted-foreground">
                Click on any product to see detailed tariff impacts and mitigation strategies
              </p>
            </div>

            <ProductTable products={sampleProducts} />
          </div>
        )}

        {activeTab === "scenarios" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What-If Scenarios</h2>
              <p className="text-muted-foreground">
                Test different tariff scenarios and see how they impact your business costs
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {sampleProducts.map((product) => {
                      const currentTotal = product.directTariff + product.materialCostIncrease;
                      const currentCost = product.currentCost * (1 + currentTotal / 100);
                      
                      return (
                        <div key={product.id} className="space-y-4 p-4 rounded-lg border">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <span className="text-sm text-muted-foreground">
                              Base: ${product.currentCost}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Current ({currentTotal}%):
                              </span>
                              <span className="font-semibold">
                                ${currentCost.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">At 10% total:</span>
                              <span className="font-medium">
                                ${(product.currentCost * 1.1).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">At 25% total:</span>
                              <span className="font-medium text-warning">
                                ${(product.currentCost * 1.25).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">At 50% total:</span>
                              <span className="font-medium text-destructive">
                                ${(product.currentCost * 1.5).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {product.materialCostIncrease > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground italic">
                                Note: Combined direct + material impact
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-semibold mb-4">Total Business Impact</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-success/10">
                        <p className="text-sm text-muted-foreground mb-1">10% Scenario</p>
                        <p className="text-2xl font-bold text-success">
                          +$
                          {sampleProducts
                            .reduce((acc, p) => acc + p.currentCost * 0.1, 0)
                            .toFixed(0)}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-warning/10">
                        <p className="text-sm text-muted-foreground mb-1">25% Scenario</p>
                        <p className="text-2xl font-bold text-warning">
                          +$
                          {sampleProducts
                            .reduce((acc, p) => acc + p.currentCost * 0.25, 0)
                            .toFixed(0)}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-destructive/10">
                        <p className="text-sm text-muted-foreground mb-1">50% Scenario</p>
                        <p className="text-2xl font-bold text-destructive">
                          +$
                          {sampleProducts
                            .reduce((acc, p) => acc + p.currentCost * 0.5, 0)
                            .toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Policy Alerts</h2>
              <p className="text-muted-foreground">
                Recent tariff and policy changes that may affect your business
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        44% Direct Tariff on Colombian Coffee Beans
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Direct import tariff:</strong> 44% applied to finished coffee beans at the border when routed through US ports. This is a straightforward tariff on the agricultural product itself, not affected by component or material costs.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Effective: Jan 15, 2024</span>
                        <span>Type: Direct Tariff</span>
                        <span>Impact: High</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        Combined 20% Impact on Italian Espresso Machines
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Compound impact:</strong> 12% direct tariff on finished machines PLUS 8% cost increase from upstream tariffs on steel, aluminum, and electronic components. Italian manufacturers are passing along their increased material costs in addition to the border tariff.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Effective: Jan 10, 2024</span>
                        <span>Type: Direct + Materials</span>
                        <span>Impact: High</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        20% Direct Tariff on US Syrups
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Direct import tariff:</strong> 20% on finished syrup products from the US. As a processed food item, this tariff applies to the complete product at the border.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Effective: Jan 12, 2024</span>
                        <span>Type: Direct Tariff</span>
                        <span>Impact: Medium</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
