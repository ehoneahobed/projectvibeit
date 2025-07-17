"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "./button";

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, ...props }, ref) => {
        const [show, setShow] = React.useState(false);

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={show ? "text" : "password"}
                    className={cn("pr-10", className)}
                    {...props}
                />
                <Button
                    type="button"
                    tabIndex={-1}
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-2 text-muted-foreground"
                    onClick={() => setShow((s) => !s)}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
        );
    },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput }; 