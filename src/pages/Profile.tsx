import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Shield } from "lucide-react";
import { formatSlot } from "@/lib/scheduling";
import { cleanPhone, validatePhone } from "@/lib/validation";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
}

interface OrderItem { name: string; quantity: number; unit_price: number; }
interface Order {
  id: string; total_amount: number; status: string; created_at: string;
  payment_method: string; payment_status: string; card_last4: string | null;
  shipping_address: string | null;
  order_items: OrderItem[];
}
interface Booking {
  id: string; start_date: string; end_date: string; total_amount: number; status: string;
  pickup_time: string | null; payment_method: string; payment_status: string; card_last4: string | null;
  rental_cars: { make: string; model: string } | null;
}
interface RepairReq {
  id: string; car_make: string; car_model: string; issue_description: string; status: string;
  preferred_date: string | null; preferred_time: string | null;
  payment_method: string; payment_status: string; created_at: string;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  completed: "bg-green-500/20 text-green-300 border-green-500/40",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/40",
  paid: "bg-green-500/20 text-green-300 border-green-500/40",
  unpaid: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [repairs, setRepairs] = useState<RepairReq[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);

    // All four queries fire in parallel — much faster than sequential .then() chains
    Promise.all([
      supabase.from("profiles").select("id,full_name,phone,address,city").eq("id", user.id).single(),
      supabase.from("orders").select("id,total_amount,status,created_at,payment_method,payment_status,card_last4,shipping_address,order_items(name,quantity,unit_price)").order("created_at", { ascending: false }),
      supabase.from("rental_bookings").select("id,start_date,end_date,total_amount,status,pickup_time,payment_method,payment_status,card_last4,rental_cars(make,model)").order("created_at", { ascending: false }),
      supabase.from("repair_requests").select("id,car_make,car_model,issue_description,status,preferred_date,preferred_time,payment_method,payment_status,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([{ data: p }, { data: o }, { data: b }, { data: r }]) => {
      if (p) setProfile(p as Profile);
      if (o) setOrders(o as any);
      if (b) setBookings(b as any);
      if (r) setRepairs(r as any);
      setDataLoading(false);
    });
  }, [user]);

  const save = async () => {
    if (!profile || !user) return;
    if (profile.phone && !validatePhone(profile.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone, address: profile.address, city: profile.city,
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  };

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setResetting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated successfully");
    setNewPassword("");
  };

  if (loading || dataLoading) return <div className="container py-32 text-center text-muted-foreground">Loading…</div>;

  const ACTIVE_STATUSES = new Set(["pending", "confirmed", "reviewing", "quoted", "accepted", "active"]);
  const PAST_STATUSES = new Set(["completed", "cancelled"]);
  const splitActive = <T extends { status: string }>(arr: T[]) => ({
    active: arr.filter(x => ACTIVE_STATUSES.has(x.status)),
    past: arr.filter(x => PAST_STATUSES.has(x.status)),
  });

  return (
    <div className="container py-16 max-w-6xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-5xl">My Account</h1>
        {isAdmin && (
          <Button asChild variant="gold">
            <Link to="/admin"><Shield className="h-4 w-4 mr-2" /> Admin Panel</Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="repairs">Repairs</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 max-w-3xl">
            <h2 className="font-display text-2xl mb-2">Personal info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full name</Label><Input value={profile?.full_name ?? ""} onChange={e => setProfile(p => p ? { ...p, full_name: e.target.value } : p)} /></div>
              <div><Label>Phone</Label><Input type="tel" value={profile?.phone ?? ""} onChange={e => setProfile(p => p ? { ...p, phone: cleanPhone(e.target.value) } : p)} placeholder="+968" /></div>
            </div>
            <div><Label>Address</Label><Input value={profile?.address ?? ""} onChange={e => setProfile(p => p ? { ...p, address: e.target.value } : p)} /></div>
            <div><Label>City</Label><Input value={profile?.city ?? ""} onChange={e => setProfile(p => p ? { ...p, city: e.target.value } : p)} /></div>
            <div className="flex gap-3">
              <Button variant="gold" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
              <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
            </div>

            <div className="pt-8 border-t border-border mt-8">
              <h2 className="font-display text-2xl mb-4">Security</h2>
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      placeholder="Enter new password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                    />
                    <Button variant="outline" onClick={updatePassword} disabled={resetting}>
                      {resetting ? "Updating..." : "Update"}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Minimum 8 characters required.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          {(() => {
            const { active, past } = splitActive(orders);
            return (
              <div className="space-y-8">
                <Section title="Current Orders" empty="No active orders.">
                  {active.map(o => <OrderCard key={o.id} o={o} />)}
                </Section>
                <Section title="Past Orders" empty="No past orders yet.">
                  {past.map(o => <OrderCard key={o.id} o={o} />)}
                </Section>
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="rentals">
          {(() => {
            const { active, past } = splitActive(bookings);
            return (
              <div className="space-y-8">
                <Section title="Current Bookings" empty="No active rentals.">
                  {active.map(b => <BookingCard key={b.id} b={b} />)}
                </Section>
                <Section title="Past Bookings" empty="No past rentals yet.">
                  {past.map(b => <BookingCard key={b.id} b={b} />)}
                </Section>
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="repairs">
          {(() => {
            const { active, past } = splitActive(repairs);
            return (
              <div className="space-y-8">
                <Section title="Current Repairs" empty="No active repair requests.">
                  {active.map(r => <RepairCard key={r.id} r={r} />)}
                </Section>
                <Section title="Past Repairs" empty="No past repairs yet.">
                  {past.map(r => <RepairCard key={r.id} r={r} />)}
                </Section>
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Section = ({ title, children, empty }: { title: string; children: React.ReactNode; empty: string }) => {
  const arr = Array.isArray(children) ? children : [children];
  const hasContent = arr.filter(Boolean).length > 0;
  return (
    <div>
      <h2 className="font-display text-2xl mb-4">{title}</h2>
      {hasContent ? <div className="space-y-3">{children}</div> : <p className="text-sm text-muted-foreground">{empty}</p>}
    </div>
  );
};

const OrderCard = ({ o }: { o: Order }) => (
  <div className="bg-card border border-border rounded-lg p-5">
    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
      <div>
        <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
        <p className="font-display text-xl text-primary">${Number(o.total_amount).toFixed(2)}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className={statusColor[o.status]}>{o.status}</Badge>
        <Badge variant="outline" className={statusColor[o.payment_status]}>
          {o.payment_method === "card" ? `Card ••${o.card_last4 ?? ""}` : "Cash"} · {o.payment_status}
        </Badge>
      </div>
    </div>
    {o.order_items?.length > 0 && (
      <ul className="text-sm text-muted-foreground space-y-0.5 mt-2">
        {o.order_items.map((i, idx) => <li key={idx}>{i.quantity}× {i.name} — ${Number(i.unit_price).toFixed(2)}</li>)}
      </ul>
    )}
  </div>
);

const BookingCard = ({ b }: { b: Booking }) => (
  <div className="bg-card border border-border rounded-lg p-5">
    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
      <div>
        <h3 className="font-display text-lg">{b.rental_cars?.make} {b.rental_cars?.model}</h3>
        <p className="text-xs text-muted-foreground">{b.start_date} → {b.end_date}{b.pickup_time && ` · pickup ${formatSlot(b.pickup_time)}`}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-lg text-primary">${Number(b.total_amount).toFixed(2)}</p>
        <div className="flex gap-2 flex-wrap justify-end mt-1">
          <Badge variant="outline" className={statusColor[b.status]}>{b.status}</Badge>
          <Badge variant="outline" className={statusColor[b.payment_status]}>
            {b.payment_method === "card" ? `Card ••${b.card_last4 ?? ""}` : "Cash"}
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

const RepairCard = ({ r }: { r: RepairReq }) => (
  <div className="bg-card border border-border rounded-lg p-5">
    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
      <div>
        <h3 className="font-display text-lg">{r.car_make} {r.car_model}</h3>
        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}{r.preferred_date && ` · scheduled ${r.preferred_date}${r.preferred_time ? ` ${formatSlot(r.preferred_time)}` : ""}`}</p>
        <p className="text-sm mt-1 line-clamp-2">{r.issue_description}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className={statusColor[r.status]}>{r.status}</Badge>
        <Badge variant="outline" className={statusColor[r.payment_status]}>
          {r.payment_method === "card" ? "Card" : "Cash"} · {r.payment_status}
        </Badge>
      </div>
    </div>
  </div>
);

export default Profile;
