import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight, ShoppingCart, Star, Package, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  original_price: number;
  category: string;
  condition: string;
  image_url: string;
  stock_quantity: number;
  description: string;
  isbn: string;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    checkAuth();
    fetchBook();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast.error("Failed to load book details");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    if (!book) return;

    try {
      const { error } = await supabase
        .from("cart")
        .upsert({ 
          user_id: user.id, 
          book_id: book.id, 
          quantity: quantity 
        }, {
          onConflict: "user_id,book_id"
        });

      if (error) throw error;
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error("Failed to add to cart");
    }
  };

  const getConditionLabel = (condition: string) => {
    return condition.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const getDiscountPercentage = () => {
    if (!book || !book.original_price) return 0;
    return Math.round(((book.original_price - book.price) / book.original_price) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading book details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  // Create multiple image slots (using the same image for demonstration)
  const bookImages = [book.image_url, book.image_url, book.image_url];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Navbar />
      
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-primary-foreground">
            <Badge className="bg-accent text-accent-foreground">SPECIAL OFFER</Badge>
            <p className="text-sm md:text-base">
              Use code <span className="font-mono font-bold bg-primary-foreground/20 px-2 py-1 rounded">BOOK20</span> for 20% off your first purchase!
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/browse" className="hover:text-foreground transition-colors">Books</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">{book.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {bookImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-card border border-border shadow-card">
                      <img
                        src={image}
                        alt={`${book.title} - View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Thumbnail Preview */}
            <div className="grid grid-cols-3 gap-4">
              {bookImages.slice(0, 3).map((image, index) => (
                <div 
                  key={index}
                  className="aspect-[3/4] rounded-md overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{book.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-medium">4.5</span>
                  <span className="text-muted-foreground">(128 reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </div>

            <Separator />

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">${book.price.toFixed(2)}</span>
                {book.original_price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${book.original_price.toFixed(2)}
                    </span>
                    <Badge className="bg-accent text-accent-foreground">
                      {getDiscountPercentage()}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                inclusive of all taxes
              </p>
            </div>

            <Separator />

            {/* Condition */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Condition</h3>
              <div className="flex gap-2">
                <Badge className="bg-secondary text-secondary-foreground text-base px-4 py-2">
                  {getConditionLabel(book.condition)}
                </Badge>
              </div>
            </div>

            {/* Stock & Quantity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Quantity</h3>
                <p className="text-sm text-muted-foreground">
                  {book.stock_quantity} available
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(book.stock_quantity, quantity + 1))}
                  disabled={quantity >= book.stock_quantity}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full text-lg bg-gradient-primary hover:opacity-90"
                onClick={addToCart}
                disabled={book.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg"
                onClick={() => {
                  addToCart();
                  setTimeout(() => navigate("/cart"), 500);
                }}
                disabled={book.stock_quantity === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-secondary">
                    <Package className="h-6 w-6 text-secondary-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium">Quality Checked</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-secondary">
                    <Shield className="h-6 w-6 text-secondary-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-secondary">
                    <Truck className="h-6 w-6 text-secondary-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* ISBN */}
            {book.isbn && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">ISBN</h3>
                <p className="text-muted-foreground font-mono">{book.isbn}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
