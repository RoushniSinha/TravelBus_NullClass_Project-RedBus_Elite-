import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Shield,
  Lock,
  Check,
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useBooking, type PassengerDetail, type PaymentInfo } from "@/context/BookingContext";

const paymentMethods = [
  { value: "CARD", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { value: "UPI", label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm" },
  { value: "NETBANKING", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { value: "WALLET", label: "Wallet", icon: Wallet, desc: "Paytm, Amazon Pay" },
] as const;

const Payment = () => {
  const navigate = useNavigate();
  const { booking, setPassengerDetails, setPaymentInfo, setBookingId } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState<PaymentInfo["method"]>("CARD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const isHotel = booking.selectedResult?.type === "HOTEL";
  const selectedSeats = booking.selectedSeats;
  const selectedRoom = booking.selectedRoom;
  const result = booking.selectedResult;

  // Calculate total
  let total = 0;
  if (isHotel && selectedRoom) {
    const sp = booking.searchParams;
    const nights = sp?.checkIn && sp?.checkOut
      ? Math.ceil((new Date(sp.checkOut).getTime() - new Date(sp.checkIn).getTime()) / 86400000)
      : 1;
    total = selectedRoom.currentPrice * nights;
  } else {
    total = selectedSeats.reduce((s, seat) => s + seat.price, 0);
    if (result) total += result.price * (booking.searchParams?.passengers || 1);
  }

  const taxes = Math.round(total * 0.05);
  const convenienceFee = 99;
  const grandTotal = total + taxes + convenienceFee;

  const handlePay = async () => {
    if (!name || !email || !phone) return;
    setIsProcessing(true);

    const passenger: PassengerDetail = {
      name,
      age: 25,
      gender: "MALE",
      email,
      phone,
    };
    setPassengerDetails([passenger]);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));

    const payInfo: PaymentInfo = {
      method: paymentMethod,
      status: "SUCCESS",
      transactionId: `TXN${Date.now()}`,
      amount: grandTotal,
    };
    setPaymentInfo(payInfo);
    setBookingId(`BK${Date.now().toString(36).toUpperCase()}`);
    setIsProcessing(false);
    navigate("/booking/confirmation");
  };

  if (!result) {
    navigate("/search");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {["Search", "Select", "Payment", "Confirm"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i < 2 ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:inline ${i <= 2 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
                  {i < 3 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Traveler Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Traveler Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentInfo["method"])}>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {paymentMethods.map((m) => (
                          <Label
                            key={m.value}
                            htmlFor={m.value}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              paymentMethod === m.value ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={m.value} id={m.value} />
                            <m.icon className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{m.label}</p>
                              <p className="text-xs text-muted-foreground">{m.desc}</p>
                            </div>
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>

                    {/* Card Details */}
                    {paymentMethod === "CARD" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-4">
                        <div>
                          <Label>Card Number</Label>
                          <Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={19} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Expiry</Label>
                            <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} maxLength={5} />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input type="password" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {paymentMethod === "UPI" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                        <Label>UPI ID</Label>
                        <Input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right - Booking Summary */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold">{result.operator}</p>
                      <p className="text-sm text-muted-foreground">
                        {isHotel ? result.name : `${result.from} → ${result.to}`}
                      </p>
                      {!isHotel && <p className="text-sm text-muted-foreground">{result.departureTime} - {result.arrivalTime}</p>}
                    </div>

                    {selectedSeats.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Selected Seats</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedSeats.map((s) => (
                            <Badge key={s.id} variant="secondary">{s.seatNumber}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedRoom && (
                      <div>
                        <p className="text-sm font-medium">Room {selectedRoom.roomNumber} - {selectedRoom.type}</p>
                        <p className="text-xs text-muted-foreground">{selectedRoom.bedType} bed • {selectedRoom.size} m²</p>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base fare</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes & fees (5%)</span>
                        <span>₹{taxes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Convenience fee</span>
                        <span>₹{convenienceFee}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  disabled={!name || !email || !phone || isProcessing}
                  onClick={handlePay}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Pay ₹{grandTotal.toLocaleString()}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Secure payment powered by 256-bit encryption</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
