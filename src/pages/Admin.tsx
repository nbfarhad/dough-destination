import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pizza, Tag, Percent, BarChart } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  order_type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  feedback: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState({ orders: true, feedback: true });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };

    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedback(data || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(prev => ({ ...prev, feedback: false }));
      }
    };

    fetchOrders();
    fetchFeedback();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">
            Manage orders, menu items, promotions, and view customer feedback
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Pizza className="mr-2 h-5 w-5 text-pizza-primary" />
                Menu Management
              </CardTitle>
              <CardDescription>Manage menu items and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin/menu')}
                className="w-full bg-pizza-primary hover:bg-pizza-primary/90"
              >
                Manage Menu
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5 text-pizza-secondary" />
                Promotions
              </CardTitle>
              <CardDescription>Manage promotional offers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin/promotions')}
                className="w-full bg-pizza-secondary hover:bg-pizza-secondary/90"
              >
                Manage Promotions
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                Analytics
              </CardTitle>
              <CardDescription>View sales and customer metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {}} 
                className="w-full"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="grid gap-6">
              {loading.orders ? (
                <p className="text-center py-8">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-center py-8">No orders found.</p>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Order #{order.order_number}</CardTitle>
                          <CardDescription>{formatDate(order.created_at)}</CardDescription>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Customer</p>
                          <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Order Type</p>
                          <p className="text-sm text-muted-foreground capitalize">{order.order_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Amount</p>
                          <p className="text-sm text-muted-foreground">${order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="grid gap-6">
              {loading.feedback ? (
                <p className="text-center py-8">Loading feedback...</p>
              ) : feedback.length === 0 ? (
                <p className="text-center py-8">No feedback found.</p>
              ) : (
                feedback.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{item.name}</CardTitle>
                          <CardDescription>{formatDate(item.created_at)}</CardDescription>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.feedback}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
