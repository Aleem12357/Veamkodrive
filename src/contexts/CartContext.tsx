import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  item_type: "part" | "car";
  item_id: string;
  name: string;
  image_url: string | null;
  unit_price: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
  addItem: (input: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => Promise<void>;
  updateQty: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  /** Full refresh — only used on mount or after hard failures */
  const refresh = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, item_type, item_id, name, image_url, unit_price, quantity")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as CartItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem: CartContextValue["addItem"] = async (input) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      return;
    }
    const qty = input.quantity ?? 1;

    // --- STOCK CHECK ---
    if (input.item_type === "part") {
      const { data: part } = await supabase
        .from("car_parts")
        .select("stock")
        .eq("id", input.item_id)
        .single();
      
      if (part && qty > part.stock) {
        toast.error(`Insufficient stock: only ${part.stock} available`);
        return;
      }
    }

    // If item already exists — optimistic quantity bump
    const existing = items.find(i => i.item_type === input.item_type && i.item_id === input.item_id);
    if (existing) {
      const newQty = existing.quantity + qty;
      
      // Re-check stock for combined quantity
      if (input.item_type === "part") {
        const { data: part } = await supabase.from("car_parts").select("stock").eq("id", input.item_id).single();
        if (part && newQty > part.stock) {
          toast.error(`Cannot add more: only ${part.stock} in stock (you already have ${existing.quantity})`);
          return;
        }
      }

      setItems(prev => prev.map(i => i.id === existing.id ? { ...i, quantity: newQty } : i));
      const { error } = await supabase.from("cart_items").update({ quantity: newQty }).eq("id", existing.id);
      if (error) { toast.error(error.message); await refresh(); return; } 
      toast.success("Cart updated");
      return;
    }

    // New item — insert then append to local state
    const { data, error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      item_type: input.item_type,
      item_id: input.item_id,
      name: input.name,
      image_url: input.image_url,
      unit_price: input.unit_price,
      quantity: qty,
    }).select("id, item_type, item_id, name, image_url, unit_price, quantity").single();
    if (error) { toast.error(error.message); return; }
    setItems(prev => [data as CartItem, ...prev]);
    toast.success("Added to cart");
  };

  const updateQty: CartContextValue["updateQty"] = async (id, quantity) => {
    if (quantity <= 0) return removeItem(id);
    
    const item = items.find(i => i.id === id);
    if (item?.item_type === "part") {
      const { data: part } = await supabase.from("car_parts").select("stock").eq("id", item.item_id).single();
      if (part && quantity > part.stock) {
        toast.error(`Only ${part.stock} available in stock`);
        return;
      }
    }

    // Optimistic update
    const previous = items;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
    if (error) { toast.error(error.message); setItems(previous); } 
  };

  const removeItem: CartContextValue["removeItem"] = async (id) => {
    // Optimistic remove
    const previous = items;
    setItems(prev => prev.filter(i => i.id !== id));
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) { toast.error(error.message); setItems(previous); } // rollback
  };

  const clear = async () => {
    if (!user) return;
    const previous = items;
    setItems([]);
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);
    if (error) { toast.error(error.message); setItems(previous); } // rollback
  };

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + Number(i.unit_price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, loading, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
