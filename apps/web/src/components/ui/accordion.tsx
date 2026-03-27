// Minimal accordion stub — scaffold placeholder (no @radix-ui/react-accordion installed)

// eslint-disable-next-line ts/no-explicit-any
function Accordion({ children, className, ...rest }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return <div className={className} {...rest}>{children}</div>;
}

// eslint-disable-next-line ts/no-explicit-any
function AccordionItem({ children, ...rest }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...rest}>{children}</div>;
}

function AccordionTrigger({ children, ...props }: React.ComponentProps<"button">) {
  return <button type="button" className="flex w-full items-center justify-between py-4 font-medium" {...props}>{children}</button>;
}

function AccordionContent({ children, ...props }: React.ComponentProps<"div">) {
  return <div className="pb-4 text-sm text-muted-foreground" {...props}>{children}</div>;
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
