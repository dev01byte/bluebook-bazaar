import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book_id: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  shipping_address: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchOrders();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "paid":
        return <Package className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/50";
      case "paid":
        return "bg-blue-500/20 text-blue-700 border-blue-500/50";
      case "shipped":
        return "bg-purple-500/20 text-purple-700 border-purple-500/50";
      case "delivered":
        return "bg-green-500/20 text-green-700 border-green-500/50";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading orders...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card/80 backdrop-blur border-border shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-2`}>
                      {getStatusIcon(order.status)}
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Items</p>
                      <p className="text-lg font-semibold">{order.order_items.length} book(s)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-semibold text-primary">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    {order.discount_amount > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Discount</p>
                        <p className="text-lg font-semibold text-green-600">
                          -${order.discount_amount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                      <p className="text-sm">{order.shipping_address}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-2">Order Timeline</p>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 ${order.status === 'pending' || order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Placed</span>
                      </div>
                      <div className={`h-px flex-1 ${order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-primary' : 'bg-border'}`} />
                      <div className={`flex items-center gap-2 ${order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <Package className="h-4 w-4" />
                        <span className="text-xs">Paid</span>
                      </div>
                      <div className={`h-px flex-1 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-primary' : 'bg-border'}`} />
                      <div className={`flex items-center gap-2 ${order.status === 'shipped' || order.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <Truck className="h-4 w-4" />
                        <span className="text-xs">Shipped</span>
                      </div>
                      <div className={`h-px flex-1 ${order.status === 'delivered' ? 'bg-primary' : 'bg-border'}`} />
                      <div className={`flex items-center gap-2 ${order.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Delivered</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
