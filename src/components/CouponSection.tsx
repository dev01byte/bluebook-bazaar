import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_percentage: number;
  valid_until: string | null;
  min_purchase_amount: number | null;
}

export const CouponSection = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Coupon copied!",
      description: `Code ${code} copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No expiration";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return null;
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            <Tag className="h-3 w-3 mr-1" />
            Active Coupons
          </Badge>
          <h2 className="text-3xl font-bold mb-3">Save More with Coupons</h2>
          <p className="text-muted-foreground text-lg">
            Use these special codes to get amazing discounts on your purchases
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {coupon.discount_percentage}% OFF
                  </Badge>
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {coupon.description || "Special Discount"}
                </CardTitle>
                <CardDescription>
                  Valid until {formatDate(coupon.valid_until)}
                  {coupon.min_purchase_amount && (
                    <span className="block mt-1">
                      Min. purchase: ${coupon.min_purchase_amount}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted px-3 py-2 rounded font-mono font-semibold text-sm">
                    {coupon.code}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCoupon(coupon.code)}
                    className="shrink-0"
                  >
                    {copiedCode === coupon.code ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
