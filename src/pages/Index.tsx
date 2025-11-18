import { useState } from "react";
import { Shield, TrendingUp, AlertCircle } from "lucide-react";
import { AlertBanner } from "@/components/AlertBanner";
import { ProductTable, Product } from "@/components/ProductTable";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Colombian Coffee Beans",
    category: "Beverages",
    origin: "Colombia",
    currentCost: 560,
    tariffPercent: 44,
    note: "44% tariff increase on coffee beans imported via the US",
    riskLevel: "high",
    strategies: [
      {
        title: "Review Contract Terms",
        description: "Examine existing supply contracts for force majeure clauses or price adjustment mechanisms that may help absorb costs.",
      },
      {
        title: "Adjust Order Timing",
        description: "Consider increasing order frequency with smaller quantities to better manage cash flow and reduce inventory risk.",
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
    tariffPercent: 12,
    note: "12% tariff increase on imported espresso machines",
    riskLevel: "medium",
    strategies: [
      {
        title: "Negotiate with Suppliers",
        description: "Reach out to Italian suppliers to discuss shared cost absorption or volume discounts to offset the tariff impact.",
      },
      {
        title: "Consider Alternative Sources",
        description: "Research equipment manufacturers in tariff-free regions while maintaining quality standards.",
      },
      {
        title: "Plan Capital Purchases",
        description: "Assess equipment replacement cycles and consider accelerating purchases if further tariff increases are anticipated.",
      },
    ],
  },
  {
    id: "3",
    name: "Vanilla Syrup",
    category: "Ingredients",
    origin: "USA",
    currentCost: 50,
    tariffPercent: 20,
    note: "20% tariff increase on syrups from the US",
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
    sampleProducts.reduce((acc, p) => acc + (p.currentCost * p.tariffPercent) / 100, 0) /
    totalProducts;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">TradeGuard</h1>
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
                    {sampleProducts.map((product) => (
                      <div key={product.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{product.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            Current: ${product.currentCost}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">At 10% tariff:</span>
                            <span className="font-medium">
                              ${(product.currentCost * 1.1).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">At 25% tariff:</span>
                            <span className="font-medium text-warning">
                              ${(product.currentCost * 1.25).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">At 50% tariff:</span>
                            <span className="font-medium text-destructive">
                              ${(product.currentCost * 1.5).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                        44% Tariff on Colombian Coffee Beans
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        New tariff increase on coffee beans imported via the US, effective
                        immediately. This affects all Colombian coffee imports routed through
                        American ports.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Effective: Jan 15, 2024</span>
                        <span>Category: Beverages</span>
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
                        20% Tariff Increase on US Syrups
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        New tariff policy on syrups and flavoring products imported from the
                        United States. Consider alternative suppliers or bulk ordering.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Effective: Jan 12, 2024</span>
                        <span>Category: Ingredients</span>
                        <span>Impact: Medium</span>
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
                        12% Tariff on Italian Equipment
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Tariff increase on imported espresso machines and commercial equipment
                        from Italy. May affect equipment replacement and expansion plans.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Effective: Jan 10, 2024</span>
                        <span>Category: Equipment</span>
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
