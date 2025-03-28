import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";

interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  orderType: "delivery" | "takeaway";
  address?: string;
  paymentMethod: "cash" | "card";
  notes?: string;
}

const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    phone: "",
    email: "",
    orderType: "takeaway",
    address: "",
    paymentMethod: "cash",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const deliveryFee = formData.orderType === "delivery" ? 3.99 : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOrderTypeChange = (value: "delivery" | "takeaway") => {
    setFormData((prevData) => ({
      ...prevData,
      orderType: value,
    }));
  };

  const handlePaymentMethodChange = (value: "cash" | "card") => {
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    if (formData.orderType === "delivery" && (!formData.address || formData.address.trim() === "")) {
      toast({
        title: "Address required",
        description: "Please provide a delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique order number
      const orderNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      
      let orderData;
      let orderId;
      
      // First, save the order header
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([
            {
              order_number: orderNumber,
              customer_name: formData.name,
              customer_email: formData.email,
              customer_phone: formData.phone,
              order_type: formData.orderType,
              delivery_address: formData.address || null,
              payment_method: formData.paymentMethod,
              notes: formData.notes || null,
              subtotal: subtotal,
              delivery_fee: deliveryFee,
              total_amount: total,
              status: 'pending',
              created_at: new Date()
            }
          ])
          .select('id');
          
        if (error) throw error;
        orderData = data;
        orderId = data?.[0]?.id;
      } catch (error) {
        console.warn('Using mock Supabase operation for orders', error);
        const { data } = await mockSupabaseOperation('insert_order', {
          order_number: orderNumber,
          customer_name: formData.name,
          customer_email: formData.email
        });
        orderData = data;
        orderId = data?.[0]?.id;
      }

      // Then save each order item
      const orderItems = items.map(item => ({
        order_id: orderId,
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      try {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      } catch (error) {
        console.warn('Using mock Supabase operation for order items', error);
        await mockSupabaseOperation('insert_order_items', { items: orderItems });
      }

      toast({
        title: "Order placed successfully!",
        description: `Your ${formData.orderType} order will be ready shortly.`,
      });
      clearCart();
      navigate("/order-success", { state: { orderNumber } });
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error placing order",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Type</h3>
        <RadioGroup
          value={formData.orderType}
          onValueChange={handleOrderTypeChange as (value: string) => void}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="takeaway" id="takeaway" />
            <Label htmlFor="takeaway" className="cursor-pointer">Takeaway (Pick up at restaurant)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery" className="cursor-pointer">Delivery (+${deliveryFee.toFixed(2)})</Label>
          </div>
        </RadioGroup>

        {formData.orderType === "delivery" && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, apartment/unit, city, state, zip code"
              rows={3}
              required
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Payment will be collected at the time of {formData.orderType === "delivery" ? "delivery" : "pickup"}.
        </p>
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={handlePaymentMethodChange as (value: string) => void}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="cursor-pointer">Card (in person)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Special Instructions (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any special requests for your order..."
          rows={2}
        />
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {formData.orderType === "delivery" && (
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-pizza-primary hover:bg-pizza-primary/90 text-lg py-6"
        disabled={isSubmitting || items.length === 0}
      >
        {isSubmitting ? "Processing..." : `Place ${formData.orderType} Order`}
      </Button>
    </form>
  );
};

export default OrderForm;
