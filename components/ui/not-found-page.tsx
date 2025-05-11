import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="flex justify-center min-h-screen bg-background">
            <div className="text-center mt-[30vh]">
                <h1 className="text-6xl font-extrabold text-primary">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-muted-foreground">
                    Oops! Page Not Found
                </h2>

                <div className="mt-6">
                    <Link href="/">
                        <Button variant={"link"} size={"lg"}>Go Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
