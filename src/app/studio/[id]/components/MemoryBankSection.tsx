import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function MemoryBankSection({ memoryBankContent }: { memoryBankContent: string }) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memoryBankContent) {
      setLoading(false);
    }
  }, [memoryBankContent]);

  if (loading) {
    return (
      <div className="relative bg-zinc-900 rounded-xl border border-zinc-800 p-5 mt-4 animate-pulse">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
            <div className="text-sm text-muted-foreground">Loading memory bank...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      if (codeRef.current) {
        const text = codeRef.current.innerText;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 1500);
      }
    } catch (err) {
      // Fallback for older browsers or when clipboard API fails
      try {
        if (codeRef.current) {
          const text = codeRef.current.innerText;
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          toast.success("Copied to clipboard!");
          setTimeout(() => setCopied(false), 1500);
        }
      } catch (fallbackErr) {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  return (
    <div className="relative bg-zinc-900 rounded-xl border border-zinc-800 p-5 mt-4">
      <button
        onClick={handleCopy}
        className="mr-7 absolute top-4 right-4 flex items-center gap-2 rounded-lg border border-blue-600 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:ring-2 hover:ring-blue-500/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        {copied ? (
          <span className="text-green-400 transition-all duration-200">✔</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8M8 12h8m-6 4v4m0-16h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
          </svg>
        )}
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>


      <pre
        ref={codeRef}
        className="overflow-x-auto overflow-y-auto max-h-96 text-zinc-200 text-sm font-mono whitespace-pre-wrap pr-4"
        style={{ background: "none", border: "none" }}
      >
        {memoryBankContent}
      </pre>
    </div>
  );
}

export default MemoryBankSection;