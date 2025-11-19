import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  currentCost: z.number().positive("Cost must be positive"),
  countryOfImport: z.string().min(2, "Country of import is required"),
});

interface ProductCode {
  code: string;
  name: string;
  category: string;
  base_tariff: number;
  material_tariff: number;
}

export default function AddProduct() {
  const [productCode, setProductCode] = useState("");
  const [currentCost, setCurrentCost] = useState("");
  const [countryOfImport, setCountryOfImport] = useState("");
  const [loading, setLoading] = useState(false);
  const [productCodes, setProductCodes] = useState<ProductCode[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductCode | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();

    // Fetch product codes
    const fetchProductCodes = async () => {
      const { data, error } = await supabase
        .from("product_codes")
        .select("*")
        .order("name");
      
      if (error) {
        toast.error("Failed to load product codes");
        return;
      }
      
      setProductCodes(data || []);
    };
    
    fetchProductCodes();
  }, [navigate]);

  const handleProductCodeChange = (code: string) => {
    setProductCode(code);
    const product = productCodes.find(p => p.code === code);
    setSelectedProduct(product || null);
  };

  const handleProductNameChange = (name: string) => {
    setProductCode(name);
    const product = productCodes.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    setSelectedProduct(product || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      productSchema.parse({
        productCode,
        currentCost: parseFloat(currentCost),
        countryOfImport,
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("user_products").insert({
        user_id: user.id,
        // use matched product code if found, otherwise fallback to typed value
        product_code: selectedProduct ? selectedProduct.code : productCode,
        current_cost: parseFloat(currentCost),
        country_of_import: countryOfImport,
      });

      if (error) throw error;

      toast.success("Product added successfully!");
      navigate("/");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
              <p className="text-sm text-muted-foreground">Add products to track tariff impact</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={productCode}
                  onChange={(e) => handleProductNameChange(e.target.value)}
                  placeholder="Type product name (e.g., Widget X)"
                  required
                  list="product-options"
                />
                <datalist id="product-options">
                  {productCodes.map((p) => (
                    <option key={p.code} value={p.name} />
                  ))}
                </datalist>
              </div>

              {selectedProduct && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">Product Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Base Tariff</p>
                      <p className="font-medium">{selectedProduct.base_tariff}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Material Tariff</p>
                      <p className="font-medium">{selectedProduct.material_tariff}%</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentCost">Current Cost ($)</Label>
                <Input
                  id="currentCost"
                  type="number"
                  step="0.01"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryOfImport">Country of Import</Label>
                <Input
                  id="countryOfImport"
                  type="text"
                  value={countryOfImport}
                  onChange={(e) => setCountryOfImport(e.target.value)}
                  placeholder="e.g., China, Italy, etc."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Product
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
