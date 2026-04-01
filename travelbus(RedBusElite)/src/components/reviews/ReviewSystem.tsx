import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  ThumbsUp, 
  Flag, 
  MessageSquare, 
  Camera, 
  Send,
  CheckCircle,
  MoreVertical,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockReviews } from "@/data/mockData";
import type { Review } from "@/types/api";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, size = "md", interactive = false, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`
            ${sizes[size]}
            ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
            ${(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
          `}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onMarkHelpful: (id: string) => void;
  onFlag: (id: string) => void;
}

function ReviewCard({ review, onMarkHelpful, onFlag }: ReviewCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isLongContent = review.content.length > 200;
  const displayContent = showFullContent ? review.content : review.content.slice(0, 200);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.userAvatar} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.userName}</span>
                {review.isVerifiedBooking && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StarRating rating={review.rating} size="sm" />
                <span>•</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onFlag(review.id)}>
                <Flag className="h-4 w-4 mr-2" />
                Report Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">{review.title}</h4>
          <p className="text-muted-foreground">
            {displayContent}
            {isLongContent && !showFullContent && "..."}
          </p>
          {isLongContent && (
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? "Show less" : "Read more"}
            </Button>
          )}
        </div>

        {/* Images */}
        {review.images.length > 0 && (
          <div className="flex gap-2 mt-4">
            {review.images.map((img) => (
              <motion.div
                key={img.id}
                whileHover={{ scale: 1.05 }}
                className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(img.url)}
              >
                <img 
                  src={img.url} 
                  alt={img.caption || "Review image"} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Reply */}
        {review.reply && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Response from {review.reply.authorName}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{review.reply.content}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={() => onMarkHelpful(review.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful ({review.helpfulCount})
          </Button>
        </div>
      </CardContent>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0">
          <img 
            src={selectedImage || ""} 
            alt="Review" 
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface WriteReviewDialogProps {
  entityName: string;
  onSubmit: (data: { rating: number; title: string; content: string; images: File[] }) => void;
}

export function WriteReviewDialog({ entityName, onSubmit }: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    onSubmit({ rating, title, content, images });
    setOpen(false);
    setRating(0);
    setTitle("");
    setContent("");
    setImages([]);
    setPreviews([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Star className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review {entityName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Rating */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Rate your experience</p>
            <div className="flex justify-center">
              <StarRating rating={rating} size="lg" interactive onChange={setRating} />
            </div>
          </div>

          {/* Title */}
          <Input
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Content */}
          <Textarea
            placeholder="Share your experience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              <Camera className="h-4 w-4" />
              Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            
            {previews.length > 0 && (
              <div className="flex gap-2 mt-2">
                {previews.map((preview, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      className="absolute top-0.5 right-0.5 h-5 w-5 bg-foreground/80 text-background rounded-full text-xs"
                      onClick={() => {
                        setPreviews((prev) => prev.filter((_, j) => j !== i));
                        setImages((prev) => prev.filter((_, j) => j !== i));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!rating || !title || !content}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ReviewSystemProps {
  entityId: string;
  entityName: string;
}

export function ReviewSystem({ entityId, entityName }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [sortBy, setSortBy] = useState("helpful");

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  const handleMarkHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  const handleFlag = (id: string) => {
    // In production, this would call the API
    console.log("Flagging review:", id);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpfulCount - a.helpfulCount;
    if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-primary">{avgRating.toFixed(1)}</div>
              <StarRating rating={Math.round(avgRating)} />
              <p className="text-sm text-muted-foreground mt-1">
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating, i) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(ratingCounts[i] / reviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingCounts[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <WriteReviewDialog
          entityName={entityName}
          onSubmit={(data) => {
            const newReview: Review = {
              id: `rv${Date.now()}`,
              userId: "current-user",
              userName: "You",
              entityId,
              entityType: "HOTEL",
              rating: data.rating,
              title: data.title,
              content: data.content,
              images: [],
              createdAt: new Date().toISOString(),
              helpfulCount: 0,
              isVerifiedBooking: true,
              flagged: false,
            };
            setReviews((prev) => [newReview, ...prev]);
          }}
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ReviewCard
              review={review}
              onMarkHelpful={handleMarkHelpful}
              onFlag={handleFlag}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSystem;
