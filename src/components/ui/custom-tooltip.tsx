import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface CustomTooltipProps {
  readonly children: React.ReactNode;
  readonly content: string;
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly delayDuration?: number;
}

export function CustomTooltip({ 
  children, 
  content, 
  side = "bottom",
  delayDuration = 200 
}: CustomTooltipProps): React.ReactElement {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={5}
          className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border border-slate-600 z-[9999]"
          style={{ 
            backgroundColor: '#0f172a', 
            color: '#ffffff', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.9)'
          }}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-slate-600" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
