import { useEffect, useState } from "react";

export default function useCopyToClipboard(
  initialText: string = "",
  resetDuration: number = 2000 //Default: 2 seconds
) {
  const [text, setText] = useState<string>(initialText);
  const [copied, setCopied] = useState<boolean>(false);

  async function copy(newText: string): Promise<void> {
    setText(newText);

    try {
      await navigator.clipboard.writeText(newText);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => {
      setCopied(false);
    }, resetDuration);

    return () => clearTimeout(timer);
  }, [copied, resetDuration]);

  return { text, copied, copy };
}
