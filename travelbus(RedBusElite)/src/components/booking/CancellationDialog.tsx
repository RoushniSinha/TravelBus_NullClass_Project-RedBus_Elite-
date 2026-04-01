import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Calendar,
  CreditCard,
  ArrowRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import type { Booking, CancellationReason, RefundStatus } from "@/types/api";

interface CancellationDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: CancellationReason, customReason?: string) => Promise<void>;
}

const cancellationReasons: { value: CancellationReason; label: string }[] = [
  { value: "CHANGE_OF_PLANS", label: "Change of plans" },
  { value: "MEDICAL_EMERGENCY", label: "Medical emergency" },
  { value: "WEATHER_CONDITIONS", label: "Weather conditions" },
  { value: "BETTER_PRICE_FOUND", label: "Found better price" },
  { value: "SCHEDULE_CONFLICT", label: "Schedule conflict" },
  { value: "OTHER", label: "Other reason" },
];

export function CancellationDialog({ 
  booking, 
  open, 
  onOpenChange, 
  onConfirm 
}: CancellationDialogProps) {
  const [step, setStep] = useState<"reason" | "confirm" | "processing" | "complete">("reason");
  const [reason, setReason] = useState<CancellationReason | "">("");
  const [customReason, setCustomReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) return null;

  // Calculate refund based on time until travel
  const travelDate = new Date(booking.travelDate);
  const now = new Date();
  const hoursUntilTravel = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const refundPercentage = hoursUntilTravel >= 24 ? 100 : 50;
  const refundAmount = (booking.totalAmount * refundPercentage) / 100;

  const handleConfirm = async () => {
    if (!reason) return;
    
    setStep("processing");
    setIsProcessing(true);
    
    try {
      await onConfirm(reason, reason === "OTHER" ? customReason : undefined);
      setStep("complete");
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep("reason");
    setReason("");
    setCustomReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === "reason" && (
            <motion.div
              key="reason"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Cancel Booking
                </DialogTitle>
                <DialogDescription>
                  Please select a reason for cancellation
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Select value={reason} onValueChange={(v) => setReason(v as CancellationReason)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationReasons.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {reason === "OTHER" && (
                  <Textarea
                    placeholder="Please specify your reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                )}

                <Button 
                  className="w-full" 
                  onClick={() => setStep("confirm")}
                  disabled={!reason || (reason === "OTHER" && !customReason)}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogDescription>
                  Review your refund details before confirming
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Refund Info Card */}
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Amount</span>
                    <span className="font-medium">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Refund Percentage</span>
                    <span className={`font-medium ${refundPercentage === 100 ? "text-green-600" : "text-amber-600"}`}>
                      {refundPercentage}%
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium">Refund Amount</span>
                    <span className="font-bold text-primary">₹{refundAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Time Notice */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <Info className="h-4 w-4 mt-0.5 text-amber-600" />
                  <p>
                    {hoursUntilTravel >= 24 
                      ? "Full refund available (more than 24 hours before travel)"
                      : "50% refund (less than 24 hours before travel)"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("reason")}>
                    Back
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleConfirm}>
                    Confirm Cancellation
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-medium">Processing Cancellation</p>
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cancellation Successful</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your refund of ₹{refundAmount.toLocaleString()} will be processed within 5-7 business days.
              </p>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Refund Status Tracker Component
interface RefundTrackerProps {
  status: RefundStatus;
  amount: number;
  initiatedAt: string;
  completedAt?: string;
}

export function RefundTracker({ status, amount, initiatedAt, completedAt }: RefundTrackerProps) {
  const steps = [
    { key: "INITIATED", label: "Initiated", icon: Clock },
    { key: "PROCESSING", label: "Processing", icon: Loader2 },
    { key: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  ];

  const currentIndex = steps.findIndex(s => s.key === status);
  const progress = status === "COMPLETED" ? 100 : status === "PROCESSING" ? 66 : 33;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Refund Status</h4>
        <span className="text-lg font-bold text-primary">₹{amount.toLocaleString()}</span>
      </div>

      <Progress value={progress} className="h-2 mb-4" />

      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center">
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center
                ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                ${isCurrent && status === "PROCESSING" ? "animate-pulse" : ""}
              `}>
                <Icon className={`h-5 w-5 ${isCurrent && status === "PROCESSING" ? "animate-spin" : ""}`} />
              </div>
              <span className={`text-xs mt-2 ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Initiated</span>
          <span>{new Date(initiatedAt).toLocaleDateString()}</span>
        </div>
        {completedAt && (
          <div className="flex justify-between mt-1">
            <span>Completed</span>
            <span>{new Date(completedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
