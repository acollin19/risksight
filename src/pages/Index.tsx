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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Add product form states
  const [productType, setProductType] = useState("");
  const [countryOfImport, setCountryOfImport] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [processingType, setProcessingType] = useState("");
  const [currentCost, setCurrentCost] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
  const [availableProcessingTypes, setAvailableProcessingTypes] = useState<string[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<any[]>([]);
  const [selectedProductCode, setSelectedProductCode] = useState("");
  
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
        productCode: up.product_code,
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

  // Fetch available categories based on product type and country
  useEffect(() => {
    if (productType && countryOfImport) {
      const fetchCategories = async () => {
        const { data } = await supabase
          .from("product_codes")
          .select("category")
          .ilike("product_type", `%${productType}%`);
        
        if (data) {
          const unique = Array.from(new Set(data.map(d => d.category)));
          setAvailableCategories(unique);
        }
      };
      fetchCategories();
    } else {
      setAvailableCategories([]);
      setCategory("");
    }
  }, [productType, countryOfImport]);

  // Fetch available sub-categories based on category
  useEffect(() => {
    if (category && productType) {
      const fetchSubCategories = async () => {
        const { data } = await supabase
          .from("product_codes")
          .select("sub_category")
          .ilike("product_type", `%${productType}%`)
          .eq("category", category)
          .not("sub_category", "is", null);
        
        if (data) {
          const unique = Array.from(new Set(data.map(d => d.sub_category)));
          setAvailableSubCategories(unique);
        }
      };
      fetchSubCategories();
    } else {
      setAvailableSubCategories([]);
      setSubCategory("");
    }
  }, [category, productType]);

  // Fetch available processing types based on sub-category
  useEffect(() => {
    if (subCategory && category && productType) {
      const fetchProcessingTypes = async () => {
        const { data } = await supabase
          .from("product_codes")
          .select("processing_type")
          .ilike("product_type", `%${productType}%`)
          .eq("category", category)
          .eq("sub_category", subCategory)
          .not("processing_type", "is", null);
        
        if (data) {
          const unique = Array.from(new Set(data.map(d => d.processing_type)));
          setAvailableProcessingTypes(unique);
        }
      };
      fetchProcessingTypes();
    } else {
      setAvailableProcessingTypes([]);
      setProcessingType("");
    }
  }, [subCategory, category, productType]);

  // Fetch matched product codes
  useEffect(() => {
    if (processingType && subCategory && category && productType) {
      const fetchMatchedProducts = async () => {
        const { data } = await supabase
          .from("product_codes")
          .select("*")
          .ilike("product_type", `%${productType}%`)
          .eq("category", category)
          .eq("sub_category", subCategory)
          .eq("processing_type", processingType);
        
        if (data) {
          setMatchedProducts(data);
        }
      };
      fetchMatchedProducts();
    } else {
      setMatchedProducts([]);
      setSelectedProductCode("");
    }
  }, [processingType, subCategory, category, productType]);

  const handleAddProduct = async () => {
    if (!selectedProductCode || !currentCost || !countryOfImport || !user) {
      toast.error("Please complete all fields");
      return;
    }

    try {
      const { error } = await supabase.from("user_products").insert({
        user_id: user.id,
        product_code: selectedProductCode,
        current_cost: parseFloat(currentCost),
        country_of_import: countryOfImport,
      });

      if (error) throw error;

      toast.success("Product added successfully!");
      setDialogOpen(false);
      
      // Reset form
      setProductType("");
      setCountryOfImport("");
      setCategory("");
      setSubCategory("");
      setProcessingType("");
      setCurrentCost("");
      setSelectedProductCode("");
      
      // Refresh products
      if (user) {
        await fetchProducts(user.id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    }
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
                <h1 className="text-2xl font-bold text-foreground">TradeGuard</h1>
                <p className="text-sm text-muted-foreground">SME Tariff Risk Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type</Label>
                      <Input
                        id="productType"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        placeholder="e.g., coffee, electronics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="countryOfImport">Country of Import</Label>
                      <Input
                        id="countryOfImport"
                        value={countryOfImport}
                        onChange={(e) => setCountryOfImport(e.target.value)}
                        placeholder="e.g., China, Italy"
                      />
                    </div>

                    {availableCategories.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {availableSubCategories.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="subCategory">Type</Label>
                        <Select value={subCategory} onValueChange={setSubCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubCategories.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {availableProcessingTypes.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="processingType">Processing</Label>
                        <Select value={processingType} onValueChange={setProcessingType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select processing type" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableProcessingTypes.map((proc) => (
                              <SelectItem key={proc} value={proc}>
                                {proc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {matchedProducts.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="productCode">Product Code</Label>
                        <Select value={selectedProductCode} onValueChange={setSelectedProductCode}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product code" />
                          </SelectTrigger>
                          <SelectContent>
                            {matchedProducts.map((prod) => (
                              <SelectItem key={prod.code} value={prod.code}>
                                {prod.code} - {prod.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {selectedProductCode && (
                          <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-2">
                            <h4 className="font-medium">Product Details</h4>
                            {matchedProducts
                              .filter((p) => p.code === selectedProductCode)
                              .map((prod) => (
                                <div key={prod.code} className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Base Tariff</p>
                                    <p className="font-medium">{prod.base_tariff}%</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Material Tariff</p>
                                    <p className="font-medium">{prod.material_tariff}%</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedProductCode && (
                      <div className="space-y-2">
                        <Label htmlFor="currentCost">Current Cost ($)</Label>
                        <Input
                          id="currentCost"
                          type="number"
                          step="0.01"
                          value={currentCost}
                          onChange={(e) => setCurrentCost(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    <Button 
                      onClick={handleAddProduct} 
                      className="w-full"
                      disabled={!selectedProductCode || !currentCost}
                    >
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
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

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          {products.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding products to track their tariff impact
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </Card>
          ) : (
            <ProductTable products={products} />
          )}
        </div>

        {/* Scenarios Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">What-If Scenarios</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
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

        {/* Alerts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Policy Alerts</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
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
      </main>
    </div>
  );
};

export default Index;
