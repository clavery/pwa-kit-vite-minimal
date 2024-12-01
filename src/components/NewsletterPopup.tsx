import {useState} from "react";
import {Loader2, Mail} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useToast} from "@/hooks/use-toast.ts";

const onClient = typeof window !== "undefined";

export default function NewsletterPopup() {
    const [open, setOpen] = useState(/* only open if session storage doesn't have a key */ () => onClient && !sessionStorage.getItem("newsletter-popup-closed"));
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem("newsletter-popup-closed", "true");
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
            title: "Success!",
            description: "You've been subscribed to our newsletter.",
        });

        setLoading(false);
        setOpen(false);
    };

    const close = () => {
        sessionStorage.setItem("newsletter-popup-closed", "true");
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center text-2xl">
                        <Mail className="h-6 w-6"/>
                        Stay Updated
                    </DialogTitle>
                    <DialogDescription>
                        Subscribe to our newsletter for the latest updates, exclusive content, and special offers. <span className="text-red-400">This is fake to demonstrate shadcn integration</span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={close}
                            className="sm:order-first"
                        >
                            Maybe later
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Subscribe
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}