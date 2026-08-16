import { cn } from "@/lib/utils";

interface CodeSurfaceProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  html: string;
}

export function CodeSurface({ html, className, ...props }: CodeSurfaceProps) {
  return (
    <div
      className={cn("bg-code no-scrollbar py-4 pr-4 text-sm", className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}
