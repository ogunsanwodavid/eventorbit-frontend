import { Dispatch, SetStateAction } from "react";

import Link from "next/link";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import useCopyToClipboard from "@/app/hooks/global/useCopyToClipboard";

import { toast } from "sonner";

import X from "../ui/icons/X";
import Facebook from "../ui/icons/Facebook";
import XTwitter from "../ui/icons/XTwitter";
import Linkedin from "../ui/icons/Linkedin";
import Whatsapp from "../ui/icons/WhatsApp";
import Pinterest from "../ui/icons/Pinterest";
import Telegram from "../ui/icons/Telegram";
import Reddit from "../ui/icons/Reddit";
import MailFilled from "../ui/icons/MailFilled";
import Copy from "../ui/icons/Copy";

interface ShareEventModalProps {
  eventName: string;
  eventDescription: string;
  url: string;
  setShowShareEventModal: Dispatch<SetStateAction<boolean>>;
}

export default function ShareEventModal({
  eventName,
  eventDescription,
  url,
  setShowShareEventModal,
}: ShareEventModalProps) {
  //Window dimensions
  const { windowHeight, windowWidth } = useWindowDimensions();

  //Copy to clipboard variables
  const { copy } = useCopyToClipboard("");

  //URL text
  const urlText = `You can now purchase tickets for ${eventName}. Sign in or create a new account on EventOrbit and purchase tickets at ${url}. ${eventDescription}`;
  const encodedUrlText = encodeURIComponent(urlText);

  //Function to copy url
  function handleCopyUrl() {
    copy(url);
    toast.success("Copied to clipboard");
  }

  return (
    <div
      className="z-90 fixed top-0 left-0 bg-blur-black flex items-center justify-center px-5 lg:px-10"
      style={{
        height: `${windowHeight}px`,
        width: `${windowWidth}px`,
      }}
    >
      <main className="w-full max-w-[400px] mx-auto bg-white rounded-[6px] p-6">
        {/** Close icon */}
        <span
          className="block w-max text-gray ml-auto cursor-pointer"
          onClick={() => setShowShareEventModal(false)}
        >
          <X size="24" />
        </span>

        <p className="text-[16px] text-black-2 font-medium">
          Share {eventName} via...
        </p>

        {/** Social media app icons */}
        <div className="flex flex-wrap gap-5 mt-3">
          {/** Facebook */}
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <Facebook size="23" />
          </Link>

          {/** Twitter */}
          <Link
            href={`https://x.com/intent/tweet?url=${url}&text=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <XTwitter size="23" />
          </Link>

          {/** Linkedin */}
          <Link
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <Linkedin size="23" color="#fff" />
          </Link>

          {/** Whatsapp */}
          <Link
            href={`https://wa.me/?text=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <Whatsapp size="23" />
          </Link>

          {/** Pinterest */}
          <Link
            href={`https://pinterest.com/pin/create/button/?url=${url}&description=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <Pinterest size="23" />
          </Link>

          {/** Telegram */}
          <Link
            href={`https://t.me/share/url?url=${url}&text=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <Telegram size="23" />
          </Link>

          {/** Reddit */}
          <Link
            href={`https://www.reddit.com/submit?url=${url}&title=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <Reddit size="23" />
          </Link>

          {/** Email */}
          <Link
            href={`mailto:?subject=${encodeURIComponent(
              `Buy tickets for ${eventName}`
            )}&body=${encodedUrlText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white"
          >
            <MailFilled size="23" />
          </Link>

          {/** Copy */}
          <div
            className="h-11.25 w-11.25 bg-teal rounded-full flex items-center justify-center text-white cursor-pointer"
            onClick={handleCopyUrl}
          >
            <Copy size="20" />
          </div>
        </div>
      </main>
    </div>
  );
}
