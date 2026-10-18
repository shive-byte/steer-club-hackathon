import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";
import thali from "@/assets/thali-hook.jpg";

export function AdHook({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<"true" | "myth" | null>(null);

  useEffect(() => { setOpen(true); }, []);

  function choose(value: "true" | "myth") {
    setAnswer(value);
    track("hook_answer", { content_name: "rice_myth", answer: value }, true);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-soft max-h-[calc(100dvh-2rem)] focus:outline-none">
          <div className="relative">
            <img src={thali} alt="Indian thali with rice, roti, dal, vegetables, salad and curd" width={1024} height={768} fetchPriority="high" className="aspect-[2/1] w-full object-cover" />
            <Dialog.Close asChild>
              <Button variant="secondary" size="icon" aria-label="Close challenge" title="Close challenge" className="absolute right-3 top-3 rounded-full"><X /></Button>
            </Dialog.Close>
          </div>
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-primary"><span className="font-display text-xl">steer</span><span>TRUE OR MYTH?</span></div>
            <Dialog.Title className="font-display text-3xl font-bold leading-tight">Rice has to go for a balanced plate.</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">One food. A big assumption. What’s your guess?</Dialog.Description>
            {answer === null ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 text-base" onClick={() => choose("true")}>True</Button>
                <Button className="h-12 text-base" onClick={() => choose("myth")}>Myth</Button>
              </div>
            ) : (
              <div className="mt-4" role="status" aria-live="polite">
                <h3 className="flex items-center gap-2 font-bold text-primary"><Check className="size-5" />{answer === "myth" ? "You spotted the myth." : "Surprise — it’s a myth."}</h3>
                <p className="mt-2 text-sm leading-relaxed">Rice can be part of a balanced meal. Portions and the mix of foods matter — try pairing it with dal, vegetables and curd.</p>
                <p className="mt-2 text-xs text-muted-foreground">General nutrition guidance; individual needs vary.</p>
                <Button className="mt-4 h-12 w-full text-base" onClick={() => { setOpen(false); onStart(); }}>Check my plate <ArrowRight /></Button>
              </div>
            )}
            <p className="mt-3 text-center text-xs text-muted-foreground">60-second meal check · Free · No login</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}