"use client";
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Home, MessageCircle, User, Users, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore";
import { useRouter } from "next/navigation";
import userStore from "@/store/userStore";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const { user } = userStore();
  const handleNavigation = (path, item) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };
  const handleOutsideClick = (event) => {
    // Check if sidebar is open and the click occurred outside the sidebar
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    // Add event listener only when the sidebar is open
    if (isSidebarOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    // Cleanup event listener when component unmounts or isSidebarOpen changes
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const userPlaceHolder = user?.username
    ? user.username
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase()) // Capitalize first letter
        .join("") // Join initials
    : "U";
  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-10  left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen
          ? "translate-x-0 bg-white dark:bg-[rgb(37,38,39)] shadow-lg"
          : "-translate-x-full"
      }  ${
        isSidebarOpen ? "md:hidden " : "md:block"
      } md:bg-transparent md:shadow-none `}>
      <div className="flex flex-col h-full overflow-y-auto">
        <nav className="space-y-3 flex-grow">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation("/")}>
            <Avatar className="h-8 w-8">
              {user?.profilePicture ? (
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback className="dark:bg-gray-400">
                  {userPlaceHolder}
                </AvatarFallback>
              )}
            </Avatar>

            <span className="font-semibold">{user?.username}</span>
          </div>

          <Button
            variant="ghost"
            className="full justify-start
          "
            onClick={() => handleNavigation("/")}>
            <Home className="mr-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/friends-list")}>
            <Users className="mr-4" />
            Friends
          </Button>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/videos")}>
            <Video className="mr-4" />
            Video
          </Button>

          <Button variant="ghost" className="full justify-start">
            <MessageCircle className="mr-4" />
            Messages
          </Button>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
            <User className="mr-4" />
            Profile
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Bell className="mr-4" />
            Notification
          </Button>
        </nav>
        <div className="mb-16">
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4 cursor-pointer">
            <Avatar
              className="h-8 w-8"
              onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
              {user?.profilePicture ? (
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback className="dark:bg-gray-400">
                  {userPlaceHolder}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Privacy · Terms · Advertising </p>
            <p>Cookies · Meta © 2024</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
