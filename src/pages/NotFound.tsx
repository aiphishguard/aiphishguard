import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/layout/Seo";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Seo title="Not found" />
      <div className="font-display text-7xl text-cyber">404</div>
      <p className="mt-3 text-muted-foreground">This path is not in the threat graph.</p>
      <Button asChild className="mt-6" variant="glow">
        <Link to="/">Return to scanner</Link>
      </Button>
    </div>
  );
}
