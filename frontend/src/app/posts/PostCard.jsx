import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Delete,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostComments from "./PostComments";
import { formateDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePostStore } from "@/store/usePostStore";
import userStore from "@/store/userStore";
import toast from "react-hot-toast";
const PostCard = ({ post, isLiked, onShare, onComment, onLike }) => {
  const [loading, setLoading] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef(null);
  const router = useRouter();
  const { user } = userStore();
  const { handleDeletePost } = usePostStore();
  const handleUserProfile = () => {
    router.push(`/user-profile/${post?.user?._id}`);
  };
  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };
  const userPostPlaceholder = post?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const generateSharedLink = () => {
    return `http://localhost:3000/${post?.id}`;
  };
  const handleDelete = async () => {
    setLoading(true); // Set loading to true when delete is initiated

    // Simulate a delay of 1 second
    setTimeout(async () => {
      try {
        await handleDeletePost(post._id); // Call your delete function
        toast.success("Post deleted successfully");
        // Optionally, you can refresh the posts here or trigger a fetch to update the UI
      } catch (error) {
        toast.error("Failed to delete post");
      } finally {
        setLoading(false); // Reset loading state after the operation
      }
    }, 1000); // Delay of 1 second
  };

  const handleShare = (platform) => {
    const url = generateSharedLink();
    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    setIsShareDialogOpen(false);
  };
  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[100vw] min-w-full">
      <Card className="max-sm:rounded-none my-1 ">
        <CardContent className="p-2 sm:p-6 dark:text-white">
          <div className="flex items-center justify-between sm:mb-4">
            <div
              className="flex items-center space-x-3 cursor-pointer "
              onClick={handleUserProfile}>
              <Avatar>
                {post?.user?.profilePicture ? (
                  <AvatarImage
                    src={post?.user?.profilePicture}
                    alt={post?.user?.username}
                  />
                ) : (
                  <AvatarFallback className="dark:bg-gray-400">
                    {userPostPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold dark:text-white">
                  {post?.user?.username}
                </p>
                <p className="font-sm text-gray-500">
                  {formateDate(post?.createdAt)}
                </p>
              </div>
            </div>
            {post?.user?._id === user?._id ? (
              loading ? (
                <Button variant="ghost" disabled>
                  Loading...
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleDelete}>
                  <Delete className="h-4 w-4" /> Delete
                </Button>
              )
            ) : (
              <Button variant="ghost" className="dark:hover:bg-gray-500">
                <MoreHorizontal className="dark:text-white h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="sm:mb-4 mb-1">{post?.content}</p>
          {post?.mediaUrl && post.mediaType === "image" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          {post?.mediaUrl && post.mediaType === "video" && (
            <video controls className="w-full h-auto rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}
          <div className="flex justify-between items-center mb-1 sm:mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
              {post?.likeCount} likes
            </span>
            <div className="flex gap-3">
              <span
                className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer "
                onClick={() => setShowComments(!showComments)}>
                {post?.commentCount} comments
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
                {post?.shareCount} share
              </span>
            </div>
          </div>
          <Separator className="mb-2 dark:bg-gray-400" />
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 ${
                isLiked ? "text-blue-600" : ""
              }`}
              onClick={onLike}>
              <ThumbsUp className=" h-4 w-4" /> Like
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 `}
              onClick={() => {
                handleCommentClick;
                setShowComments(!showComments);
              }}>
              <MessageCircle className=" h-4 w-4" /> Comment
            </Button>
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 dark:hover:bg-gray-500"
                  onClick={onShare}>
                  <Share2 className=" h-4 w-4" />
                  share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share This Post</DialogTitle>
                  <DialogDescription>
                    Choose how you want to share this post
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 ">
                  <Button onClick={() => handleShare("facebook")}>
                    Share on Facebook
                  </Button>
                  <Button onClick={() => handleShare("twitter")}>
                    Share on Twitter
                  </Button>
                  <Button onClick={() => handleShare("linkedin")}>
                    Share on Linkedin
                  </Button>
                  <Button onClick={() => handleShare("copy")}>Copy Link</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="mb-2 dark:bg-gray-400" />
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}>
                <PostComments
                  post={post}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
