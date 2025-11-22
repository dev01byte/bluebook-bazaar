import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  original_price: number | null;
  condition: string;
  image_url: string | null;
  category: string;
}

export const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_available', true)
        .limit(8)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error loading books",
        description: "Could not load featured books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (bookId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to add items to cart.",
        });
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('cart')
        .upsert({
          user_id: session.user.id,
          book_id: bookId,
          quantity: 1,
        });

      if (error) throw error;

      toast({
        title: "Added to cart!",
        description: "Book has been added to your cart.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      'like_new': 'Like New',
      'very_good': 'Very Good',
      'good': 'Good',
      'acceptable': 'Acceptable',
    };
    return labels[condition] || condition;
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">Featured Books</h2>
            <p className="text-muted-foreground">No books available yet. Be the first to sell!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Featured Books</h2>
          <p className="text-muted-foreground text-lg">
            Discover our handpicked selection of quality used books
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <Card key={book.id} className="group overflow-hidden hover:shadow-[var(--card-shadow-hover)] transition-all">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                  {book.image_url ? (
                    <img 
                      src={book.image_url} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  {book.original_price && (
                    <Badge className="absolute top-3 left-3 bg-accent">
                      {Math.round(((book.original_price - book.price) / book.original_price) * 100)}% OFF
                    </Badge>
                  )}
                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {getConditionLabel(book.condition)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">${book.price}</span>
                  {book.original_price && (
                    <span className="text-sm text-muted-foreground line-through">${book.original_price}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" size="sm" onClick={() => addToCart(book.id)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" onClick={() => navigate('/browse')}>
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
};
