import { Shield, TrendingUp, AlertCircle } from "lucide-react";
import { AlertBanner } from "@/components/AlertBanner";
import { ProductTable, Product } from "@/components/ProductTable";
import { Card, CardContent } from "@/components/ui/card";

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
              <a href="#" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">
                Products
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Scenarios
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Alerts
              </a>
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

        {/* Products Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your Products</h2>
            <p className="text-muted-foreground">
              Click on any product to see detailed tariff impacts and mitigation strategies
            </p>
          </div>

          <ProductTable products={sampleProducts} />
        </div>
      </main>
    </div>
  );
};

export default Index;
