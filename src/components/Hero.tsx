import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-books.jpg";

export const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Give Books a Second Life
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Buy and sell used books. Discover great reads at amazing prices while helping others find new homes for their beloved books.
          </p>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search for books, authors, ISBN..." 
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Search
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Button size="lg" variant="secondary">
              Start Buying
            </Button>
            <Button size="lg" variant="outline">
              Start Selling
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
