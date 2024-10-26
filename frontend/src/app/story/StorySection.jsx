import React, { useEffect } from "react";
import StoryCard from "./StoryCard";

import { usePostStore } from "@/store/usePostStore";

const StorySection = () => {
  const { story, fetchStoryPost } = usePostStore();

  useEffect(() => {
    fetchStoryPost();
  }, [fetchStoryPost]);

  return (
    <div className="relative ">
      <div className="flex overflow-x-auto sm:py-6 py-2">
        <div className="flex space-x-2">
          {" "}
          <StoryCard isAddStory={true} />
          {/* Each StoryCard should have a fixed width */}
          {story?.map((story) => (
            <StoryCard
              story={story}
              key={story._id}
              className="w-48 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorySection;
