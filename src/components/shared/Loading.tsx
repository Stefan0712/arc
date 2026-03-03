export default function LoadingPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin"></div>
        
        <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      
      <p className="mt-4 text-zinc-500 text-sm font-medium tracking-widest uppercase animate-pulse">
        Loading
      </p>
    </div>
  );
}