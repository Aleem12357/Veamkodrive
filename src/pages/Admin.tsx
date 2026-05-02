import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Shield, UserPlus, Handshake, Compass, Car, ShoppingBag, Calendar, Wrench, ClipboardList, Key, Settings } from "lucide-react";
import { formatSlot } from "@/lib/scheduling";

type Row = Record<string, any>;

const Admin = () => {
  const { user, loading, isAdmin, isSuperAdmin, adminChecking: checking } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading || checking) return <div className="container py-32 text-center text-muted-foreground">Loading…</div>;

  if (!isAdmin) {
    return <PromoteScreen />;
  }

  return (
    <div className="container py-12 max-w-7xl">

      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-7 w-7 text-primary" />
        <h1 className="font-display text-4xl">Admin Panel</h1>
      </div>

      <Tabs defaultValue="cars">
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/30 p-2 mb-4">
          {/* ── Inventory ── */}
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold px-1 self-center">Inventory</span>
          <TabsTrigger value="cars" className="gap-1.5"><Car className="h-3.5 w-3.5" /> Cars</TabsTrigger>
          <TabsTrigger value="rentals" className="gap-1.5"><Key className="h-3.5 w-3.5" /> Rental Fleet</TabsTrigger>
          <TabsTrigger value="parts" className="gap-1.5"><Wrench className="h-3.5 w-3.5" /> Parts Catalog</TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5"><ClipboardList className="h-3.5 w-3.5" /> Services</TabsTrigger>
          {/* ── separator ── */}
          <span className="h-6 w-px bg-border mx-1" />
          {/* ── Orders ── */}
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold px-1 self-center">Orders</span>
          <TabsTrigger value="orders" className="gap-1.5"><ShoppingBag className="h-3.5 w-3.5" /> Parts Orders</TabsTrigger>
          <TabsTrigger value="bookings" className="gap-1.5"><Calendar className="h-3.5 w-3.5" /> Rental Bookings</TabsTrigger>
          <TabsTrigger value="repairs" className="gap-1.5"><Wrench className="h-3.5 w-3.5" /> Repair Requests</TabsTrigger>
          <TabsTrigger value="buy-sell" className="gap-1.5"><Handshake className="h-3.5 w-3.5" /> Buy / Sell</TabsTrigger>
          <TabsTrigger value="consulting" className="gap-1.5"><Compass className="h-3.5 w-3.5" /> Consulting</TabsTrigger>
          {/* ── separator ── */}
          <span className="h-6 w-px bg-border mx-1" />
          {/* ── Mgmt ── */}
          <TabsTrigger value="admins" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="mt-6"><CarsAdmin /></TabsContent>
        <TabsContent value="rentals" className="mt-6"><RentalsAdmin /></TabsContent>
        <TabsContent value="parts" className="mt-6"><PartsAdmin /></TabsContent>
        <TabsContent value="services" className="mt-6"><ServicesAdmin /></TabsContent>
        <TabsContent value="orders" className="mt-6"><OrdersAdmin /></TabsContent>
        <TabsContent value="bookings" className="mt-6"><BookingsAdmin /></TabsContent>
        <TabsContent value="repairs" className="mt-6"><RepairsAdmin /></TabsContent>
        <TabsContent value="buy-sell" className="mt-6"><BrokerageAdmin /></TabsContent>
        <TabsContent value="consulting" className="mt-6"><ConsultingAdmin /></TabsContent>
        <TabsContent value="admins" className="mt-6"><AdminsAdmin /></TabsContent>
      </Tabs>
    </div>
  );
};

/* ---------------- Promote screen (when no admin yet) ---------------- */
const PromoteScreen = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [busy, setBusy] = useState(false);

  const promote = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("promote_to_admin", { _email: email });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(String(data));
    window.location.reload();
  };

  return (
    <div className="container py-32 max-w-md">
      <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
        <Shield className="h-10 w-10 text-primary mx-auto" />
        <h1 className="font-display text-3xl">Admin Setup</h1>
        <p className="text-sm text-muted-foreground">
          No admin exists yet. The first signed-in user can claim admin access. After this, only existing admins can promote others.
        </p>
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
        <Button variant="gold" className="w-full" onClick={promote} disabled={busy || !email}>
          {busy ? "…" : "Become Admin"}
        </Button>
      </div>
    </div>
  );
};

/* ---------------- Generic helpers ---------------- */
const Toolbar = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">{children}</div>
);

const DataTable = ({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) => (
  <div className="bg-card border border-border rounded-lg overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-secondary/50">
        <tr>{headers.map(h => <th key={h} className="text-left p-3 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={headers.length} className="text-center text-muted-foreground p-8">No records</td></tr>
        ) : rows.map((r, i) => (
          <tr key={i} className="border-t border-border hover:bg-secondary/30">
            {r.map((c, j) => <td key={j} className="p-3">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Accessible delete button with AlertDialog confirmation — replaces window.confirm */
const DeleteButton = ({ label, onConfirm }: { label: string; onConfirm: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/* ---------------- CARS ---------------- */
const emptyCar = { make: "", model: "", year: new Date().getFullYear(), price: 0, mileage: 0, fuel: "Petrol", transmission: "Automatic", body_type: "Sedan", color: "", image_url: "", description: "", status: "available", featured: false };

const CarsAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row>(emptyCar);

  const load = async () => {
    const { data } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = { ...editing };
    delete payload.created_at; delete payload.updated_at;
    const res = editing.id
      ? await supabase.from("cars").update(payload as any).eq("id", editing.id)
      : await supabase.from("cars").insert(payload as any);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setOpen(false); load();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <>
      <Toolbar>
        <h2 className="font-display text-2xl">Cars for Sale ({rows.length})</h2>
        <Button variant="gold" onClick={() => { setEditing(emptyCar); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Car
        </Button>
      </Toolbar>
      <DataTable
        headers={["Make/Model", "Year", "Price", "Status", "Featured", "Actions"]}
        rows={rows.map(r => [
          `${r.make} ${r.model}`, r.year, `$${Number(r.price).toFixed(0)}`,
          <Badge variant="outline">{r.status}</Badge>,
          r.featured ? "★" : "—",
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <DeleteButton label="this car" onConfirm={() => del(r.id)} />
          </div>
        ])}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing.id ? "Edit" : "Add"} Car</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Make"><Input value={editing.make} onChange={e => setEditing({ ...editing, make: e.target.value })} /></Field>
            <Field label="Model"><Input value={editing.model} onChange={e => setEditing({ ...editing, model: e.target.value })} /></Field>
            <Field label="Year"><Input type="number" value={editing.year} onChange={e => setEditing({ ...editing, year: +e.target.value })} /></Field>
            <Field label="Price ($)"><Input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: +e.target.value })} /></Field>
            <Field label="Mileage"><Input type="number" value={editing.mileage ?? 0} onChange={e => setEditing({ ...editing, mileage: +e.target.value })} /></Field>
            <Field label="Color"><Input value={editing.color ?? ""} onChange={e => setEditing({ ...editing, color: e.target.value })} /></Field>
            <Field label="Fuel"><Input value={editing.fuel ?? ""} onChange={e => setEditing({ ...editing, fuel: e.target.value })} /></Field>
            <Field label="Transmission"><Input value={editing.transmission ?? ""} onChange={e => setEditing({ ...editing, transmission: e.target.value })} /></Field>
            <Field label="Body type"><Input value={editing.body_type ?? ""} onChange={e => setEditing({ ...editing, body_type: e.target.value })} /></Field>
            <Field label="Status">
              <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Image URL" full><Input value={editing.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            <Field label="Description" full><Textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Featured">
              <Switch checked={editing.featured} onCheckedChange={v => setEditing({ ...editing, featured: v })} />
            </Field>
          </div>
          <DialogFooter><Button variant="gold" onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Field = ({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) => (
  <div className={full ? "col-span-2" : ""}><Label className="text-xs">{label}</Label>{children}</div>
);

/* ---------------- RENTALS ---------------- */
const emptyRental = { make: "", model: "", year: new Date().getFullYear(), daily_rate: 0, deposit: 0, seats: 4, transmission: "Automatic", fuel: "Petrol", description: "", image_url: "", available: true };

const RentalsAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row>(emptyRental);

  const load = async () => {
    const { data } = await supabase.from("rental_cars").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = { ...editing };
    delete payload.created_at; delete payload.updated_at;
    const res = editing.id
      ? await supabase.from("rental_cars").update(payload as any).eq("id", editing.id)
      : await supabase.from("rental_cars").insert(payload as any);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setOpen(false); load();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("rental_cars").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  const toggleAvail = async (r: Row) => {
    await supabase.from("rental_cars").update({ available: !r.available }).eq("id", r.id);
    load();
  };

  return (
    <>
      <Toolbar>
        <h2 className="font-display text-2xl">Rental Fleet ({rows.length})</h2>
        <Button variant="gold" onClick={() => { setEditing(emptyRental); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Rental
        </Button>
      </Toolbar>
      <DataTable
        headers={["Vehicle", "Year", "Daily", "Deposit", "Available", "Actions"]}
        rows={rows.map(r => [
          `${r.make} ${r.model}`, r.year, `$${r.daily_rate}`, `$${r.deposit}`,
          <Switch checked={r.available} onCheckedChange={() => toggleAvail(r)} />,
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <DeleteButton label="this rental" onConfirm={() => del(r.id)} />
          </div>
        ])}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing.id ? "Edit" : "Add"} Rental</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Make"><Input value={editing.make} onChange={e => setEditing({ ...editing, make: e.target.value })} /></Field>
            <Field label="Model"><Input value={editing.model} onChange={e => setEditing({ ...editing, model: e.target.value })} /></Field>
            <Field label="Year"><Input type="number" value={editing.year} onChange={e => setEditing({ ...editing, year: +e.target.value })} /></Field>
            <Field label="Daily rate"><Input type="number" value={editing.daily_rate} onChange={e => setEditing({ ...editing, daily_rate: +e.target.value })} /></Field>
            <Field label="Deposit"><Input type="number" value={editing.deposit} onChange={e => setEditing({ ...editing, deposit: +e.target.value })} /></Field>
            <Field label="Seats"><Input type="number" value={editing.seats ?? 0} onChange={e => setEditing({ ...editing, seats: +e.target.value })} /></Field>
            <Field label="Transmission"><Input value={editing.transmission ?? ""} onChange={e => setEditing({ ...editing, transmission: e.target.value })} /></Field>
            <Field label="Fuel"><Input value={editing.fuel ?? ""} onChange={e => setEditing({ ...editing, fuel: e.target.value })} /></Field>
            <Field label="Image URL" full><Input value={editing.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            <Field label="Description" full><Textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Available"><Switch checked={editing.available} onCheckedChange={v => setEditing({ ...editing, available: v })} /></Field>
          </div>
          <DialogFooter><Button variant="gold" onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ---------------- PARTS ---------------- */
const emptyPart = { name: "", brand: "", category: "", price: 0, stock: 0, description: "", image_url: "", compatible_cars: [] as string[] };

const PartsAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row>(emptyPart);
  const [compat, setCompat] = useState("");

  const load = async () => {
    const { data } = await supabase.from("car_parts").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const openEdit = (r: Row) => {
    setEditing(r); setCompat((r.compatible_cars ?? []).join(", ")); setOpen(true);
  };
  const openNew = () => { setEditing(emptyPart); setCompat(""); setOpen(true); };

  const save = async () => {
    const payload: any = { ...editing, compatible_cars: compat.split(",").map(s => s.trim()).filter(Boolean) };
    delete payload.created_at; delete payload.updated_at;
    const res = editing.id
      ? await supabase.from("car_parts").update(payload as any).eq("id", editing.id)
      : await supabase.from("car_parts").insert(payload as any);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setOpen(false); load();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("car_parts").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <>
      <Toolbar>
        <h2 className="font-display text-2xl">Parts Inventory ({rows.length})</h2>
        <Button variant="gold" onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Part</Button>
      </Toolbar>
      <DataTable
        headers={["Name", "Brand", "Category", "Price", "Stock", "Actions"]}
        rows={rows.map(r => [
          r.name, r.brand ?? "—", r.category, `$${r.price}`,
          <Badge variant="outline" className={r.stock > 0 ? "border-green-500/40 text-green-300" : "border-red-500/40 text-red-300"}>{r.stock}</Badge>,
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
            <DeleteButton label="this part" onConfirm={() => del(r.id)} />
          </div>
        ])}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing.id ? "Edit" : "Add"} Part</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" full><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Brand"><Input value={editing.brand ?? ""} onChange={e => setEditing({ ...editing, brand: e.target.value })} /></Field>
            <Field label="Category"><Input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} /></Field>
            <Field label="Price"><Input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: +e.target.value })} /></Field>
            <Field label="Stock"><Input type="number" value={editing.stock} onChange={e => setEditing({ ...editing, stock: +e.target.value })} /></Field>
            <Field label="Image URL" full><Input value={editing.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            <Field label="Compatible cars (comma separated)" full>
              <Input value={compat} onChange={e => setCompat(e.target.value)} placeholder="Toyota Corolla, Honda Civic" />
            </Field>
            <Field label="Description" full><Textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
          </div>
          <DialogFooter><Button variant="gold" onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ---------------- REPAIR SERVICES ---------------- */
const emptyService = { car_make: "", car_model: "", service_name: "", category: "", base_price: 0, duration_hours: 1, description: "" };

const ServicesAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row>(emptyService);

  const load = async () => {
    const { data } = await supabase.from("repair_services").select("*").order("car_make");
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = { ...editing };
    delete payload.created_at;
    const res = editing.id
      ? await supabase.from("repair_services").update(payload as any).eq("id", editing.id)
      : await supabase.from("repair_services").insert(payload as any);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setOpen(false); load();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("repair_services").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <>
      <Toolbar>
        <h2 className="font-display text-2xl">Repair Services ({rows.length})</h2>
        <Button variant="gold" onClick={() => { setEditing(emptyService); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Service
        </Button>
      </Toolbar>
      <DataTable
        headers={["Vehicle", "Service", "Category", "Price", "Duration", "Actions"]}
        rows={rows.map(r => [
          `${r.car_make} ${r.car_model}`, r.service_name, r.category, `$${r.base_price}`, `${r.duration_hours ?? "—"}h`,
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <DeleteButton label="this service" onConfirm={() => del(r.id)} />
          </div>
        ])}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing.id ? "Edit" : "Add"} Service</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Car make"><Input value={editing.car_make} onChange={e => setEditing({ ...editing, car_make: e.target.value })} /></Field>
            <Field label="Car model"><Input value={editing.car_model} onChange={e => setEditing({ ...editing, car_model: e.target.value })} /></Field>
            <Field label="Service name" full><Input value={editing.service_name} onChange={e => setEditing({ ...editing, service_name: e.target.value })} /></Field>
            <Field label="Category"><Input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} /></Field>
            <Field label="Base price"><Input type="number" value={editing.base_price} onChange={e => setEditing({ ...editing, base_price: +e.target.value })} /></Field>
            <Field label="Duration (hours)"><Input type="number" step="0.5" value={editing.duration_hours ?? 0} onChange={e => setEditing({ ...editing, duration_hours: +e.target.value })} /></Field>
            <Field label="Description" full><Textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
          </div>
          <DialogFooter><Button variant="gold" onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ---------------- ORDERS / BOOKINGS / REPAIRS (status management) ---------------- */
const StatusSelect = ({ table, id, value, options, onUpdated }: { table: string; id: string; value: string; options: string[]; onUpdated: () => void }) => (
  <Select value={value} onValueChange={async v => {
    const { error } = await supabase.from(table as any).update({ status: v }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); onUpdated(); }
  }}>
    <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
    <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
  </Select>
);

const PaymentBadge = ({ method, status, last4 }: { method: string; status: string; last4: string | null }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs">{method === "card" ? `Card ••${last4 ?? "----"}` : "Cash"}</span>
    <Badge variant="outline" className={status === "paid" ? "border-green-500/40 text-green-300 w-fit" : "border-orange-500/40 text-orange-300 w-fit"}>{status}</Badge>
  </div>
);

const OrdersAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, total_amount, status, payment_method, payment_status, card_last4, profiles(full_name), order_items(name, quantity)")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Orders error: " + error.message); return; }
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    await supabase.from("order_items").delete().eq("order_id", id);
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  return (
    <>
      <Toolbar><h2 className="font-display text-2xl flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /> Parts Orders ({rows.length})</h2></Toolbar>
      <DataTable
        headers={["Date", "Customer", "Items", "Total", "Status", "Payment", "Actions"]}
        rows={rows.map(r => [
          new Date(r.created_at).toLocaleDateString(),
          r.profiles?.full_name ?? "—",
          (r.order_items ?? []).map((i: any) => `${i.quantity}× ${i.name}`).join(", ") || "—",
          `$${Number(r.total_amount).toFixed(2)}`,
          <StatusSelect table="orders" id={r.id} value={r.status} options={["pending", "paid", "shipped", "completed", "cancelled"]} onUpdated={load} />,
          <PaymentBadge method={r.payment_method} status={r.payment_status} last4={r.card_last4} />,
          <DeleteButton label="this order" onConfirm={() => del(r.id)} />,
        ])}
      />
    </>
  );
};


const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<Row[]>([]);
  const [rentalReqs, setRentalReqs] = useState<Row[]>([]);

  const load = async () => {
    const { data: b, error: be } = await supabase
      .from("rental_bookings")
      .select("*, rental_cars(make,model), profiles(full_name)")
      .order("created_at", { ascending: false });
    if (be) toast.error("Bookings error: " + be.message);
    setBookings(b ?? []);

    const { data: r, error: re } = await supabase
      .from("brokerage_requests")
      .select("*")
      .eq("intent", "rent")
      .order("created_at", { ascending: false });
    if (re) toast.error("Rental requests error: " + re.message);
    setRentalReqs(r ?? []);
  };
  useEffect(() => { load(); }, []);

  const delBooking = async (id: string) => {
    const { error } = await supabase.from("rental_bookings").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  const delReq = async (id: string) => {
    const { error } = await supabase.from("brokerage_requests").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="space-y-10">
      <div>
        <Toolbar><h2 className="font-display text-2xl flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Fleet Bookings ({bookings.length})</h2></Toolbar>
        <DataTable
          headers={["Customer", "Vehicle", "Dates", "Pickup", "Total", "Status", "Payment", "Actions"]}
          rows={bookings.map(r => [
            r.profiles?.full_name ?? "—",
            `${r.rental_cars?.make ?? ""} ${r.rental_cars?.model ?? ""}`,
            `${r.start_date} → ${r.end_date}`,
            r.pickup_time ? formatSlot(r.pickup_time) : "—",
            `$${Number(r.total_amount).toFixed(2)}`,
            <StatusSelect table="rental_bookings" id={r.id} value={r.status} options={["pending", "confirmed", "active", "completed", "cancelled"]} onUpdated={load} />,
            <PaymentBadge method={r.payment_method} status={r.payment_status} last4={r.card_last4} />,
            <DeleteButton label="this booking" onConfirm={() => delBooking(r.id)} />,
          ])}
        />
      </div>

      <div>
        <Toolbar><h2 className="font-display text-2xl flex items-center gap-2"><Key className="h-5 w-5 text-primary" /> Custom Rental Requests ({rentalReqs.length})</h2></Toolbar>
        <p className="text-xs text-muted-foreground -mt-2 mb-3">Submitted via "Request a specific vehicle" form on the Rent page.</p>
        <DataTable
          headers={["Date", "Customer", "Phone", "Duration", "Details", "Status", "Actions"]}
          rows={rentalReqs.map(r => [
            new Date(r.created_at).toLocaleDateString(),
            r.name,
            r.phone,
            r.price_range || "—",
            <div className="max-w-[220px] truncate" title={r.details}>{r.details || "—"}</div>,
            <StatusSelect table="brokerage_requests" id={r.id} value={r.status} options={["pending", "reviewing", "quoted", "accepted", "completed", "cancelled"]} onUpdated={load} />,
            <DeleteButton label="this request" onConfirm={() => delReq(r.id)} />,
          ])}
        />
      </div>
    </div>
  );
};


const RepairsAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => {
    const { data } = await supabase.from("repair_requests").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    const { error } = await supabase.from("repair_requests").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  return (
    <>
      <Toolbar><h2 className="font-display text-2xl">Repair Requests ({rows.length})</h2></Toolbar>
      <DataTable
        headers={["Customer", "Vehicle", "Issue", "Scheduled", "Status", "Payment", "Actions"]}
        rows={rows.map(r => [
          <div><div>{r.full_name}</div><div className="text-xs text-muted-foreground">{r.phone}</div></div>,
          `${r.car_make} ${r.car_model}${r.car_year ? ` (${r.car_year})` : ""}`,
          <span className="line-clamp-2 max-w-xs block">{r.issue_description}</span>,
          r.preferred_date ? `${r.preferred_date}${r.preferred_time ? ` ${formatSlot(r.preferred_time)}` : ""}` : "—",
          <StatusSelect table="repair_requests" id={r.id} value={r.status} options={["pending", "reviewing", "quoted", "accepted", "completed", "cancelled"]} onUpdated={load} />,
          <PaymentBadge method={r.payment_method} status={r.payment_status} last4={r.card_last4} />,
          <DeleteButton label="this request" onConfirm={() => del(r.id)} />,
        ])}
      />
    </>
  );
};

/* ---------------- ADMINS ---------------- */
const AdminsAdmin = () => {
  const { isSuperAdmin, isAdmin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [admins, setAdmins] = useState<Row[]>([]);

  const load = async () => {
    // 1. Fetch roles (including both admin and super_admin)
    const { data: roles, error: rolesErr } = await supabase
      .from("user_roles")
      .select("*")
      .in("role", ["admin", "super_admin"]);
    
    if (rolesErr) {
      console.error("Admin list load error:", rolesErr);
      toast.error("Could not load admin list: " + rolesErr.message);
      return;
    }

    // 2. Fetch profiles separately to avoid join errors
    const uids = roles?.map(r => r.user_id) || [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", uids);

    let list = (roles || []).map(r => ({
      ...r,
      profiles: profiles?.find(p => p.id === r.user_id)
    }));
    
    setAdmins(list);
  };
  useEffect(() => { load(); }, [isAdmin, user, isSuperAdmin]);

  const promote = async () => {
    if (!isSuperAdmin) { toast.error("Only Super Admins can promote others."); return; }
    setBusy(true);
    const { data, error } = await supabase.rpc("promote_to_admin", { _email: email });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(String(data)); setEmail(""); load();
  };

  const remove = async (uid: string) => {
    if (!isSuperAdmin) return;
    if (uid === user?.id) { toast.error("You cannot remove your own access."); return; }
    
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", uid)
      .eq("role", "admin");
      
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Admin access revoked");
      load();
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {isSuperAdmin ? (
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h2 className="font-display text-2xl flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /> Promote a user to admin</h2>
          <p className="text-sm text-muted-foreground">Super Admin privilege: Grant administrative access to any registered user by email.</p>
          <div className="flex gap-2">
            <Input placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            <Button variant="gold" onClick={promote} disabled={busy || !email}>
              {busy ? "Promoting..." : "Promote to Admin"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 border border-border rounded-lg p-6 flex items-center gap-3 text-muted-foreground">
          <Shield className="h-5 w-5" />
          <p className="text-sm">You are logged in as an Admin. Only Super Admins can manage administrative permissions.</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-xl mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Current Administrators ({admins.length})</h3>
        <div className="space-y-3">
          {admins.map(a => (
            <div key={a.id} className="flex justify-between items-center border-b border-border/50 py-3 last:border-0 group">
              <div className="flex flex-col">
                <span className="font-medium">{a.profiles?.full_name || "Administrator"}</span>
                <span className="text-[10px] text-muted-foreground tracking-tight">{a.profiles?.email || a.email || a.user_id}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Admin</Badge>
                {isSuperAdmin && a.user_id !== user?.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Admin Access?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove admin privileges for {a.profiles?.full_name ?? "this user"}? They will lose access to the Admin Panel immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(a.user_id)} className="bg-destructive hover:bg-destructive/90 text-white">Revoke Access</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const BrokerageAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => {
    // Only show buy/sell/trade — rental requests are shown in the Rental Bookings tab
    const { data, error } = await supabase
      .from("brokerage_requests")
      .select("*")
      .neq("intent", "rent")
      .order("created_at", { ascending: false });
    if (error) toast.error("Buy/Sell error: " + error.message);
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    const { error } = await supabase.from("brokerage_requests").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  return (
    <>
      <Toolbar><h2 className="font-display text-2xl flex items-center gap-2"><Handshake className="h-5 w-5 text-primary" /> Buy & Sell Requests ({rows.length})</h2></Toolbar>
      <DataTable
        headers={["Date", "Customer", "Type", "Phone", "Range", "Details", "Status", "Actions"]}
        rows={rows.map(r => [
          new Date(r.created_at).toLocaleDateString(),
          r.name,
          <span className="capitalize">{r.intent}</span>,
          r.phone,
          r.price_range || "—",
          <div className="max-w-[200px] truncate" title={r.details}>{r.details || "—"}</div>,
          <StatusSelect table="brokerage_requests" id={r.id} value={r.status} options={["pending", "reviewing", "quoted", "accepted", "completed", "cancelled"]} onUpdated={load} />,
          <DeleteButton label="this request" onConfirm={() => del(r.id)} />,
        ])}
      />
    </>
  );
};


const ConsultingAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => {
    const { data } = await supabase.from("consulting_requests").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    const { error } = await supabase.from("consulting_requests").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  return (
    <>
      <Toolbar><h2 className="font-display text-2xl flex items-center gap-2"><Compass className="h-5 w-5 text-primary" /> Consulting Requests ({rows.length})</h2></Toolbar>
      <DataTable
        headers={["Date", "Customer", "Phone", "Budget", "Preferences", "Status", "Actions"]}
        rows={rows.map(r => [
          new Date(r.created_at).toLocaleDateString(),
          r.name,
          r.phone,
          r.budget || "—",
          <div className="max-w-[200px] truncate" title={r.preferences}>{r.preferences || "—"}</div>,
          <StatusSelect table="consulting_requests" id={r.id} value={r.status} options={["pending", "reviewing", "quoted", "accepted", "completed", "cancelled"]} onUpdated={load} />,
          <DeleteButton label="this request" onConfirm={() => del(r.id)} />,
        ])}
      />
    </>
  );
};

export default Admin;
