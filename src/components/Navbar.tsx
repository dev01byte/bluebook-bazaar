import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingCart, User } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BookOpen className="h-6 w-6" />
            BookMarket
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost">Browse Books</Button>
            </Link>
            <Link to="/sell">
              <Button variant="ghost">Sell Books</Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="default">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
