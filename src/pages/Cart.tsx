import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PaymentSection, emptyPayment, validatePayment } from "@/components/PaymentSection";
import { SEO } from "@/components/SEO";
import { sanitizeString, validatePhone } from "@/lib/validation";

const Cart = () => {
  const { items, total, count, updateQty, removeItem, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ shipping_address: "", phone: "", notes: "" });
  const [payment, setPayment] = useState(emptyPayment);

  const checkout = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!form.shipping_address.trim() || form.shipping_address.length < 10) {
      toast.error("Please provide a complete shipping address (min 10 chars)");
      return;
    }
    if (!validatePhone(form.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const payErr = validatePayment(payment);
    if (payErr) { toast.error(payErr); return; }

    setCheckingOut(true);

    // Step 0: Final stock check to prevent race conditions
    for (const item of items) {
      if (item.item_type === "part") {
        const { data: part } = await supabase.from("car_parts").select("stock").eq("id", item.item_id).single();
        if (part && item.quantity > part.stock) {
          toast.error(`Out of stock: ${item.name} only has ${part.stock} left.`);
          setCheckingOut(false);
          return;
        }
      }
    }

    // Step 1: Create the order
    const { data: order, error: orderErr } = await supabase.from("orders").insert({
      user_id: user.id,
      total_amount: total,
      shipping_address: sanitizeString(form.shipping_address),
      phone: form.phone,
      notes: sanitizeString(form.notes) || null,
      status: "pending",
      payment_method: payment.method,
      payment_status: "unpaid",
    }).select("id").single();

    if (orderErr || !order) {
      toast.error(orderErr?.message ?? "Failed to create order");
      setCheckingOut(false);
      return;
    }

    // Step 2: Insert order items
    const { error: itemsErr } = await supabase.from("order_items").insert(
      items.map(i => ({
        order_id: order.id, item_type: i.item_type, item_id: i.item_id,
        name: i.name, unit_price: i.unit_price, quantity: i.quantity,
      }))
    );

    // Step 3: If items failed — rollback the order to avoid orphaned records
    // Step 4: Decrement stock for parts
    for (const item of items) {
      if (item.item_type === "part") {
        const { data: p } = await supabase.from("car_parts").select("stock").eq("id", item.item_id).single();
        if (p) {
          await supabase.from("car_parts").update({ stock: p.stock - item.quantity }).eq("id", item.item_id);
        }
      }
    }

    // Step 5: Clear cart and redirect
    await clear();
    setCheckingOut(false);
    toast.success("Order placed — pay at pickup");
    navigate("/profile");
  };

  if (count === 0) {
    return (
      <div className="container py-32 text-center">
        <SEO title="Your Cart — Veamkodrive" description="Review your selected cars and parts before checkout." path="/cart" noindex />
        <ShoppingBag className="h-16 w-16 text-primary/40 mx-auto mb-6" />
        <h1 className="font-display text-4xl mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Discover our cars and parts to fill it up.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild variant="gold"><Link to="/parts">Shop Parts</Link></Button>
          <Button asChild variant="gold-outline"><Link to="/buy-sell">Browse Cars</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <SEO title="Your Cart — Veamkodrive" description="Review your selected cars and parts before checkout." path="/cart" noindex />
      <h1 className="font-display text-5xl mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(i => (
            <div key={i.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
              <div className="w-24 h-24 bg-secondary rounded overflow-hidden flex-shrink-0">
                {i.image_url && <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-primary">{i.item_type === "car" ? "Vehicle" : "Part"}</p>
                <h3 className="font-display text-lg leading-tight">{i.name}</h3>
                <p className="text-primary font-semibold mt-1">${Number(i.unit_price).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button variant="ghost" size="icon" onClick={() => removeItem(i.id)}><Trash2 className="h-4 w-4" /></Button>
                {i.item_type === "part" ? (
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(i.id, i.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center text-sm">{i.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(i.id, i.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                ) : <span className="text-xs text-muted-foreground">Reserved</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 h-fit lg:sticky lg:top-24 space-y-4">
          <h3 className="font-display text-2xl">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{count}</span></div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
              <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {!showForm ? (
            <Button variant="gold" className="w-full" onClick={() => user ? setShowForm(true) : navigate("/auth")}>
              {user ? "Proceed to Checkout" : "Sign in to checkout"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div><Label className="text-xs">Shipping address *</Label>
                <Textarea rows={2} value={form.shipping_address} onChange={e => setForm({ ...form, shipping_address: e.target.value })} /></div>
              <div><Label className="text-xs">Phone *</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label className="text-xs">Notes</Label>
                <Textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <PaymentSection value={payment} onChange={setPayment} />
              <Button variant="gold" className="w-full" onClick={checkout} disabled={checkingOut}>
                {checkingOut ? "Placing…" : `Place Order · $${total.toFixed(2)}`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
