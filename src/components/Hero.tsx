import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-books.jpg";
import buyBooksIcon from "@/assets/buy-books-icon.jpg";
import sellBooksIcon from "@/assets/sell-books-icon.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden py-12">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Buy and Sell Old Books Online for Actual Money!
          </h1>
          <p className="mb-12 text-xl text-muted-foreground max-w-3xl mx-auto">
            Buy second hand books and sell old books online at best prices. Selling used books online for cash made easy with our platform!
          </p>
          
          <div className="flex gap-2 mb-12 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search for books, authors, ISBN..." 
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-8" onClick={() => navigate("/browse")}>
              Search
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
            <div 
              onClick={() => navigate("/browse")}
              className="group cursor-pointer bg-card hover:bg-accent transition-all duration-300 rounded-2xl p-8 shadow-lg hover:shadow-xl flex-1 w-full sm:max-w-xs border-2 border-border hover:border-primary"
            >
              <div className="mb-4 flex justify-center">
                <img src={buyBooksIcon} alt="Buy Books" className="w-32 h-20 object-contain" />
              </div>
              <Button size="lg" variant="default" className="w-full">
                Buy Used Books
              </Button>
            </div>

            <div className="text-2xl font-semibold text-muted-foreground">Or</div>
            
            <div 
              onClick={() => navigate("/sell")}
              className="group cursor-pointer bg-card hover:bg-accent transition-all duration-300 rounded-2xl p-8 shadow-lg hover:shadow-xl flex-1 w-full sm:max-w-xs border-2 border-border hover:border-secondary"
            >
              <div className="mb-4 flex justify-center">
                <img src={sellBooksIcon} alt="Sell Books" className="w-32 h-20 object-contain" />
              </div>
              <Button size="lg" variant="secondary" className="w-full">
                Sell Old Books
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
