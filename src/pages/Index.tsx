import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, TrendingUp, AlertCircle, Package, Plus, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/AlertBanner";
import { ProductTable, Product, calculateTotalImpact } from "@/components/ProductTable";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'scenarios' | 'alerts'>('products');
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Fetch user products
      await fetchProducts(session.user.id);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        fetchProducts(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProducts = async (userId: string) => {
    setLoading(true);
    try {
      const { data: userProducts, error } = await supabase
        .from("user_products")
        .select(`
          *,
          product_codes (*)
        `)
        .eq("user_id", userId);

      if (error) throw error;

      const formattedProducts: Product[] = (userProducts || []).map((up: any) => ({
        id: up.id,
        name: up.product_codes.name,
        category: up.product_codes.category,
        origin: up.country_of_import,
        currentCost: parseFloat(up.current_cost),
        directTariff: parseFloat(up.product_codes.base_tariff),
        materialCostIncrease: parseFloat(up.product_codes.material_tariff),
        note: `${up.product_codes.name} from ${up.country_of_import}. Direct tariff: ${up.product_codes.base_tariff}%, Material cost increase: ${up.product_codes.material_tariff}%`,
        riskLevel: (parseFloat(up.product_codes.base_tariff) + parseFloat(up.product_codes.material_tariff)) > 15 ? "high" : 
                   (parseFloat(up.product_codes.base_tariff) + parseFloat(up.product_codes.material_tariff)) > 8 ? "medium" : "low",
        strategies: [
          { title: "Diversify Suppliers", description: "Source from multiple countries to reduce risk" },
          { title: "Negotiate Pricing", description: "Work with suppliers on cost adjustments" },
        ],
      }));

      setProducts(formattedProducts);
    } catch (error: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const highRiskCount = products.filter((p) => p.riskLevel === "high").length;
  const avgImpact = products.length > 0
    ? products.reduce((acc, p) => acc + calculateTotalImpact(p), 0) / totalProducts
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">RiskSight</h1>
                <p className="text-sm text-muted-foreground">SME Tariff & Policy Risk Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/add-product")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <AlertBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Items tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highRiskCount}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgImpact.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per product</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "px-4 py-2 font-medium transition-colors border-b-2",
              activeTab === 'products'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={cn(
              "px-4 py-2 font-medium transition-colors border-b-2",
              activeTab === 'scenarios'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Scenarios
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={cn(
              "px-4 py-2 font-medium transition-colors border-b-2",
              activeTab === 'alerts'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Alerts
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div>
            {products.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding products to track their tariff impact
                </p>
                <Button onClick={() => navigate("/add-product")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Card>
            ) : (
              <ProductTable products={products} />
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What-If Scenarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Add products to see scenario analysis
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Compare how different tariff rates would affect your business
                    </p>
                    
                    {[10, 25, 50].map(rate => {
                      const scenarioImpact = products.reduce((acc, p) => {
                        const currentTotal = p.directTariff + p.materialCostIncrease;
                        const scenarioCost = p.currentCost * (1 + rate / 100);
                        const currentCost = p.currentCost * (1 + currentTotal / 100);
                        return acc + (scenarioCost - currentCost);
                      }, 0);
                      
                      return (
                        <Card key={rate} className="bg-muted/20">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold">At {rate}% Tariff Rate</h4>
                                <p className="text-sm text-muted-foreground">
                                  Across all products
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-destructive">
                                  {scenarioImpact >= 0 ? '+' : ''}${scenarioImpact.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Total business impact
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-destructive pl-4 py-2">
                  <h4 className="font-semibold text-destructive">High Priority</h4>
                  <p className="text-sm text-foreground mt-1">
                    New 12% tariff on Italian coffee equipment effective next month
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Direct import tariff on finished products from Italy
                  </p>
                </div>
                
                <div className="border-l-4 border-warning pl-4 py-2">
                  <h4 className="font-semibold text-warning">Medium Priority</h4>
                  <p className="text-sm text-foreground mt-1">
                    Upstream tariffs on electronics causing 8% material cost increase
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compound effect: affects products using electronic components
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-primary">Info</h4>
                  <p className="text-sm text-foreground mt-1">
                    Trade negotiations ongoing - potential changes in Q3 2024
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monitor for updates on direct vs. indirect tariff policies
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
