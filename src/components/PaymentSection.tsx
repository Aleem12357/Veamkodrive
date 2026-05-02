import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Banknote, CreditCard } from "lucide-react";

export interface PaymentDetails {
  method: "cash";
}

export const emptyPayment: PaymentDetails = {
  method: "cash"
};

export const validatePayment = (p: PaymentDetails): string | null => {
  return null;
};

export const cardLast4 = (p: PaymentDetails) => null;

interface Props {
  value: PaymentDetails;
  onChange: (p: PaymentDetails) => void;
}

export const PaymentSection = ({ value, onChange }: Props) => {
  const set = (patch: Partial<PaymentDetails>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Label className="text-xs uppercase tracking-wider text-primary">Payment</Label>
      <div className="flex items-center gap-2 border border-primary bg-primary/5 rounded-md p-3">
        <Banknote className="h-4 w-4 text-primary" />
        <span className="text-sm">Pay at pickup</span>
      </div>
    </div>
  );
};
