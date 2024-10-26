"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePostStore } from "@/store/usePostStore";
import userStore from "@/store/userStore";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import ShowStoryPreview from "./ShowStoryPreview";

const StoryCard = ({ isAddStory, story }) => {
  const { user } = userStore();
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleCreateStory } = usePostStore();
  const [showPreview, setShowPreview] = useState(false);
  const [isNewStory, setIsNewStory] = useState(false);

  const fileInputRef = useRef(null);

  const userPlaceholder = story?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleFileChnage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file),
        setFileType(file.type.startsWith("video") ? "video" : "image");
      setFilePreview(URL.createObjectURL(file));
      setIsNewStory(true);
      setShowPreview(true);
    }
    e.target.value = "";
  };

  const handleCreateStoryPost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      await handleCreateStory(formData);
      resetStoryState();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    resetStoryState();
  };

  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setIsNewStory(false);
  };

  const handleStoryClick = () => {
    setFilePreview(story?.mediaUrl);
    setFileType(story?.mediaType);
    setIsNewStory(false);
    setShowPreview(true);
  };

  return (
    <>
      <Card
        className=" h-36 md:w-40 w-20 md:h-60 relative  group cursor-pointer rounded-xl"
        onClick={isAddStory ? undefined : handleStoryClick}>
        <CardContent className="p-0 h-full rounded-xl">
          {isAddStory ? (
            <div className="w-full h-full flex flex-col">
              <div className="sm:h-3/4 h-3/5 w-full relative border-b">
                <Avatar className="w-full h-full rounded-none">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="object-cover"
                    />
                  ) : (
                    <p className="w-full h-full flex justify-center items-center text-4xl">
                      {userPlaceholder}
                    </p>
                  )}
                </Avatar>
              </div>
              <div className="sm:h-1/4  w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 min-h-6 h-6 min-w-6 w-6 rounded-full bg-blue-500 hover:bg-blue-600 "
                  onClick={() => fileInputRef.current.click()}>
                  <Plus className="min-h-4 min-w-4 text-white" />
                </Button>
                <p className="text-xs font-semibold mt-1">Create Story</p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChnage}
              />
            </div>
          ) : (
            <>
              {story?.mediaType === "image" ? (
                <img
                  src={story?.mediaUrl}
                  alt={story?.user?.username}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <video
                  src={story?.mediaUrl}
                  alt={story?.user?.username}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full ">
                <Avatar className="w-8 h-8">
                  {story?.user?.profilePicture ? (
                    <AvatarImage
                      src={story?.user?.profilePicture}
                      alt={story?.user?.username}
                    />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">
                  {story?.user?.username}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {showPreview && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[999] h-[100vh] w-[100vw]">
          <ShowStoryPreview
            file={filePreview}
            fileType={fileType}
            onClose={handleClosePreview}
            onPost={handleCreateStoryPost}
            isNewStory={isNewStory}
            username={isNewStory ? user?.username : story?.user?.username}
            avatar={
              isNewStory ? user?.profilePicture : story?.user?.profilePicture
            }
            isLoading={loading}
          />
        </div>
      )}
    </>
  );
};

export default StoryCard;
