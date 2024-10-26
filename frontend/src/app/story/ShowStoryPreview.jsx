import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";

const ShowStoryPreview = ({
  file,
  fileType,
  onClose,
  onPost,
  isNewStory,
  username,
  avatar,
  isLoading,
}) => {
  const userPlaceholder = username
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const storyContentRef = useRef(null); // Create a ref for the story content

  // Close the story preview when clicking outside the content area
  const handleClickOutside = (event) => {
    if (
      storyContentRef.current &&
      !storyContentRef.current.contains(event.target)
    ) {
      onClose(); // Close if click is outside the story content
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        className="relative w-full max-w-md h-[70vh] max-sm:max-w-[95%] flex flex-col bg-white dark:text-white dark:bg-gray-800 rounded-sm sm:rounded-lg overflow-hidden"
        ref={storyContentRef} // Attach ref to this div
      >
        <Button
          className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          variant="ghost"
          onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <div className="absolute sm:top-4 sm:left-4 z-10 flex items-center p-1">
          <Avatar className=" w-8 h-8 sm:w-10 sm:h-10 mr-2">
            {avatar ? (
              <AvatarImage src={avatar} alt={username} />
            ) : (
              <AvatarFallback className="text-sm">
                {userPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-gray-700 dark:text-gray-200 font-semibold">
            {username}
          </span>
        </div>
        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          {fileType === "image" ? (
            <img
              src={file}
              alt="story_preview"
              className="max-w-full max-h-full object-cover"
            />
          ) : (
            <video
              src={file}
              controls
              autoPlay
              className="max-w-full max-h-full object-cover"
            />
          )}
        </div>
        {isNewStory && (
          <div className="absolute bottom-4 right-2 transform -translate-x-1/2">
            <Button
              onClick={onPost}
              className="bg-blue-500 hover:bg-orange-500 text-white">
              {isLoading ? "Saving..." : "Share"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowStoryPreview;
