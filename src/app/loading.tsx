export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <span className="relative flex h-12 w-12">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-12 w-12 bg-indigo-500"></span>
      </span>
    </div>
  );
} 