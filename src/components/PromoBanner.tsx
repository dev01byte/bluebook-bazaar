import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Badge className="mb-3 bg-accent text-accent-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Limited Time Offer
            </Badge>
            <h2 className="text-3xl font-bold text-primary-foreground mb-2">
              Get 20% Off Your First Purchase!
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              Use code <span className="font-mono font-bold bg-primary-foreground/20 px-2 py-1 rounded">WELCOME20</span> at checkout
            </p>
          </div>
          <Button size="lg" variant="secondary" className="whitespace-nowrap">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};
