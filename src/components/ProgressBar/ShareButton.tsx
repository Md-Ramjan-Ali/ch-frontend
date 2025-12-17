import { useState } from "react";
import { Share2, Link, Twitter, Facebook, MessageCircle } from "lucide-react";

export const ShareButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = "Check out my progress on the Pro Leaderboard! 🏆";

    switch (platform) {
      case "native":
        if (navigator.share) {
          await navigator.share({ title: "Pro Leaderboard", text: shareText, url: shareUrl });
        } else {
          alert("Sharing not supported on this device.");
        }
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("🔗 Link copied to clipboard!");
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
          "_blank"
        );
        break;
      default:
        break;
    }

    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 bg-white cursor-pointer text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-semibold">Share Progress</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 animate-fade-in">
          <button
            onClick={() => handleShare("native")}
            className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Share2 className="w-4 h-4 text-blue-500" /> Native Share
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Link className="w-4 h-4 text-gray-500" /> Copy Link
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Twitter className="w-4 h-4 text-sky-500" /> Twitter
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Facebook className="w-4 h-4 text-blue-600" /> Facebook
          </button>
          <button
            onClick={() => handleShare("whatsapp")}
            className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};
