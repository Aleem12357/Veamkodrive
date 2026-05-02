import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(8, "Min 8 characters").max(72);

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPwd, setSignInPwd] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPwd, setSignUpPwd] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(signInEmail);
      passwordSchema.parse(signInPwd);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: signInEmail, password: signInPwd });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back");
    navigate("/");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(signUpEmail);
      passwordSchema.parse(signUpPwd);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPwd,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: signUpName.trim() || undefined },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created — welcome to Veamkodrive");
    navigate("/");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }
    // Supabase will redirect the browser to Google — no further action needed
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display text-3xl mb-8">
          <span className="text-foreground">Veamko</span><span className="text-gradient-gold">drive</span>
        </Link>

        <div className="bg-card border border-border rounded-lg p-8 shadow-elevated">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" required value={signInEmail} onChange={e => setSignInEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="si-pwd">Password</Label>
                  <Input id="si-pwd" type="password" required value={signInPwd} onChange={e => setSignInPwd(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe} 
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me for 30 days</Label>
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" required maxLength={120} value={signUpName} onChange={e => setSignUpName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" required value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="su-pwd">Password (min 8)</Label>
                  <Input id="su-pwd" type="password" required value={signUpPwd} onChange={e => setSignUpPwd(e.target.value)} />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  {loading ? "Creating…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.93h6.51c-.33 3.81-3.5 5.44-6.5 5.44-3.83 0-7.06-3.02-7.06-7.27 0-4.13 3.13-7.34 7.07-7.34 3.05 0 4.84 1.94 4.84 1.94l2.09-2.16S16.7 2 12.04 2C6.42 2 2.03 6.74 2.03 12.18c0 5.27 4.13 10.07 10.13 10.07 5.28 0 9.13-3.62 9.13-8.97 0-1.13-.16-1.78-.16-1.78z"/></svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
