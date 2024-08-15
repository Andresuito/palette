import Link from "next/link";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold">404</h1>
        <p className="mt-1 mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Button size="lg" variant="default">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
