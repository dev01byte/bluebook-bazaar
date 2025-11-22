import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  code: string;
  description: string;
  discount: string;
  validUntil: string;
}

const activeCoupons: Coupon[] = [
  {
    code: "WELCOME20",
    description: "First purchase discount",
    discount: "20% OFF",
    validUntil: "Dec 31, 2024"
  },
  {
    code: "BOOKWORM15",
    description: "For book lovers",
    discount: "15% OFF",
    validUntil: "Dec 25, 2024"
  },
  {
    code: "SAVE10",
    description: "Orders above $50",
    discount: "$10 OFF",
    validUntil: "Dec 20, 2024"
  }
];

export const CouponSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Coupon copied!",
      description: `Code ${code} copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
          {activeCoupons.map((coupon) => (
            <Card key={coupon.code} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {coupon.discount}
                  </Badge>
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{coupon.description}</CardTitle>
                <CardDescription>Valid until {coupon.validUntil}</CardDescription>
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
