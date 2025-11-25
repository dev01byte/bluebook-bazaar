import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

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
}

export default function Browse() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory, selectedCondition]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBooks(data || []);
      setFilteredBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (selectedCondition !== "all") {
      filtered = filtered.filter(book => book.condition === selectedCondition);
    }

    setFilteredBooks(filtered);
  };

  const addToCart = async (bookId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .insert({ user_id: user.id, book_id: bookId, quantity: 1 });

      if (error) throw error;
      toast.success("Added to cart!");
    } catch (error: any) {
      if (error.code === "23505") {
        toast.info("Item already in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const categories = [...new Set(books.map(book => book.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading books...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Browse Books</h1>

        <div className="mb-8 grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger>
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="like_new">Like New</SelectItem>
              <SelectItem value="very_good">Very Good</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="acceptable">Acceptable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No books found matching your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-elegant transition-all duration-300 bg-card/50 backdrop-blur border-border">
                <CardContent className="p-0">
                  <div 
                    className="aspect-[3/4] overflow-hidden rounded-t-lg cursor-pointer"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {book.condition.replace("_", " ")}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-foreground">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">${book.price.toFixed(2)}</span>
                      {book.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${book.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {book.stock_quantity} in stock
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => addToCart(book.id)}
                    disabled={book.stock_quantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}