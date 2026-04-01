import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  Star,
  MapPin,
  TrendingDown,
  History,
  Users,
  Flame,
  ChevronRight,
  X
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockRecommendations } from "@/data/mockData";
import type { Recommendation, RecommendationReason } from "@/types/api";

const reasonIcons: Record<string, React.ElementType> = {
  PAST_BOOKING: History,
  SIMILAR_USERS: Users,
  TRENDING: Flame,
  PRICE_DROP: TrendingDown,
  LOCATION_PREFERENCE: MapPin,
  RATING: Star,
};

const reasonColors: Record<string, string> = {
  PAST_BOOKING: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  SIMILAR_USERS: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  TRENDING: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  PRICE_DROP: "text-green-600 bg-green-100 dark:bg-green-900/30",
  LOCATION_PREFERENCE: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
  RATING: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
};

interface AIRecommendationsProps {
  userId: string;
  onSelect: (recommendation: Recommendation) => void;
}

export function AIRecommendations({ userId, onSelect }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [selectedReason, setSelectedReason] = useState<{ rec: Recommendation; reason: RecommendationReason } | null>(null);

  const handleFeedback = (recId: string, feedback: "LIKE" | "DISLIKE") => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId ? { ...r, userFeedback: feedback } : r
      ).filter((r) => feedback === "LIKE" || r.id !== recId)
    );
    
    // In production, this would call the API
    console.log("Feedback submitted:", { recId, feedback });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI Powered</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient">
            Recommended for You
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalized suggestions based on your travel preferences
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecommendationCard
                recommendation={rec}
                onSelect={() => onSelect(rec)}
                onLike={() => handleFeedback(rec.id, "LIKE")}
                onDislike={() => handleFeedback(rec.id, "DISLIKE")}
                onReasonClick={(reason) => setSelectedReason({ rec, reason })}
              />
            </motion.div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recommendations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Book your first trip to get personalized suggestions
            </p>
          </div>
        )}

        {/* Why This Dialog */}
        <Dialog open={!!selectedReason} onOpenChange={() => setSelectedReason(null)}>
          <DialogContent className="sm:max-w-md">
            {selectedReason && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Why We Recommend This
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedReason.rec.item.image} 
                      alt={selectedReason.rec.item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{selectedReason.rec.item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedReason.rec.item.location}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = reasonIcons[selectedReason.reason.type];
                        return <Icon className="h-5 w-5 text-primary" />;
                      })()}
                      <span className="font-medium">{selectedReason.reason.description}</span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Confidence Level</p>
                      <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${selectedReason.reason.confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1">
                        {Math.round(selectedReason.reason.confidence * 100)}% match
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    This recommendation is generated using rule-based algorithms that analyze your 
                    booking history, preferences, and current travel trends. Your feedback helps 
                    improve future suggestions.
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect: () => void;
  onLike: () => void;
  onDislike: () => void;
  onReasonClick: (reason: RecommendationReason) => void;
}

function RecommendationCard({ 
  recommendation, 
  onSelect, 
  onLike, 
  onDislike,
  onReasonClick 
}: RecommendationCardProps) {
  const { item, reasons, score } = recommendation;
  const matchPercent = Math.round(score * 100);

  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-48 h-48 md:h-auto">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-primary-foreground">
              {matchPercent}% Match
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              {item.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{item.rating}</span>
            </div>
          </div>

          {/* Reasons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {reasons.map((reason, index) => {
              const Icon = reasonIcons[reason.type];
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer ${reasonColors[reason.type]}`}
                      onClick={() => onReasonClick(reason)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {reason.type.replace("_", " ")}
                      <HelpCircle className="h-3 w-3 ml-1 opacity-50" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{reason.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click for more details
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-primary">
                ₹{item.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Feedback Buttons */}
              <div className="flex gap-1 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike();
                  }}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDislike();
                  }}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={onSelect}>
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default AIRecommendations;
