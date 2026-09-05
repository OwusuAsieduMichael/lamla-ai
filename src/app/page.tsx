import { HomePage } from "@/components/home/home-page";
import { getCapabilityStatus } from "@/lib/capabilities";

export default function Home() {
  return <HomePage capabilities={getCapabilityStatus()} />;
}
