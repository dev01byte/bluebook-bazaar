import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  condition: string;
  image: string;
  rating: number;
}

const featuredBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    originalPrice: 18.99,
    condition: "Very Good",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    rating: 4.5
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 10.99,
    originalPrice: 16.99,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    rating: 4.8
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    price: 11.99,
    originalPrice: 17.99,
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    rating: 4.7
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 9.99,
    originalPrice: 15.99,
    condition: "Very Good",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    rating: 4.6
  }
];

export const FeaturedBooks = () => {
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
          {featuredBooks.map((book) => (
            <Card key={book.id} className="group overflow-hidden hover:shadow-[var(--card-shadow-hover)] transition-all">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent">
                    {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
                  </Badge>
                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {book.condition}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">${book.price}</span>
                  <span className="text-sm text-muted-foreground line-through">${book.originalPrice}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
};
