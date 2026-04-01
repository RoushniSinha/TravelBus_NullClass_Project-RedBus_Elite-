import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Clock, 
  Calendar,
  Flame,
  Snowflake,
  Sun,
  Zap,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { mockPricing, mockPriceHistory } from "@/data/mockData";
import type { PricingInfo, PriceHistory, PriceFactor } from "@/types/api";

const demandColors = {
  LOW: "text-green-600 bg-green-100 dark:bg-green-900/30",
  MEDIUM: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  HIGH: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  VERY_HIGH: "text-red-600 bg-red-100 dark:bg-red-900/30",
};

const factorIcons: Record<string, React.ElementType> = {
  DEMAND: Flame,
  HOLIDAY: Calendar,
  WEEKEND: Sun,
  SEASONAL: Snowflake,
  EARLY_BIRD: Clock,
  LAST_MINUTE: Zap,
};

interface DynamicPricingDisplayProps {
  itemId: string;
  itemType: "FLIGHT" | "HOTEL" | "BUS";
  onFreeze?: () => void;
}

export function DynamicPricingDisplay({ itemId, itemType, onFreeze }: DynamicPricingDisplayProps) {
  const [pricing] = useState<PricingInfo>(mockPricing);
  const [priceHistory] = useState<PriceHistory>(mockPriceHistory);
  const [showHistory, setShowHistory] = useState(false);

  const priceChange = pricing.currentPrice - pricing.basePrice;
  const priceChangePercent = Math.round((priceChange / pricing.basePrice) * 100);
  const isPriceUp = priceChange > 0;

  return (
    <div className="space-y-4">
      {/* Price Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold">₹{pricing.currentPrice.toLocaleString()}</span>
                <div className={`flex items-center gap-1 text-sm ${isPriceUp ? "text-red-600" : "text-green-600"}`}>
                  {isPriceUp ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{isPriceUp ? "+" : ""}{priceChangePercent}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Base price: ₹{pricing.basePrice.toLocaleString()}
              </p>
            </div>

            <Badge className={demandColors[pricing.demandLevel]}>
              <Flame className="h-3 w-3 mr-1" />
              {pricing.demandLevel.replace("_", " ")} Demand
            </Badge>
          </div>

          {/* Price Factors */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              Price Factors
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Factors affecting the current price</p>
                </TooltipContent>
              </Tooltip>
            </h4>
            <div className="space-y-2">
              {pricing.priceFactors.map((factor, index) => (
                <PriceFactorRow key={index} factor={factor} />
              ))}
            </div>
          </div>

          {/* Price Freeze Option */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Price Freeze</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Lock this price for 48 hours for just ₹199
                </p>
              </div>
              <Button size="sm" onClick={onFreeze}>
                Freeze Price
              </Button>
            </div>
          </div>

          {/* Toggle History */}
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide" : "Show"} Price History
            {showHistory ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Price History Chart */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <PriceHistoryChart history={priceHistory} />
        </motion.div>
      )}
    </div>
  );
}

interface PriceFactorRowProps {
  factor: PriceFactor;
}

function PriceFactorRow({ factor }: PriceFactorRowProps) {
  const Icon = factorIcons[factor.type] || TrendingUp;
  const isPositive = factor.impact > 0;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{factor.description}</span>
      </div>
      <span className={`text-sm font-medium ${isPositive ? "text-red-600" : "text-green-600"}`}>
        {isPositive ? "+" : ""}{factor.impact}%
      </span>
    </div>
  );
}

interface PriceHistoryChartProps {
  history: PriceHistory;
}

function PriceHistoryChart({ history }: PriceHistoryChartProps) {
  const data = history.dataPoints.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: Math.round(point.price),
  }));

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const avgPrice = Math.round(data.reduce((acc, d) => acc + d.price, 0) / data.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          30-Day Price History
          <div className="flex gap-4 text-sm font-normal">
            <span className="text-green-600">Low: ₹{minPrice}</span>
            <span className="text-muted-foreground">Avg: ₹{avgPrice}</span>
            <span className="text-red-600">High: ₹{maxPrice}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                domain={["dataMin - 200", "dataMax + 200"]}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border rounded-lg p-2 shadow-lg">
                        <p className="text-sm font-medium">₹{payload[0].value}</p>
                        <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-center">
          <span className="text-muted-foreground">💡 Tip: </span>
          <span>Best time to book is usually 2-3 weeks before travel</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default DynamicPricingDisplay;
