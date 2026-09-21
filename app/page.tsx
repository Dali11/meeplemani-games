import { Hero } from "@/components/Hero";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { CorporateTeaser } from "@/components/CorporateTeaser";
import { RecentGallery } from "@/components/RecentGallery";
import { GroupCta } from "@/components/GroupCta";
import { getUpcomingEvents } from "@/lib/queries";

// Refresh the events from the database at most every 5 minutes
export const revalidate = 300;

export default async function Home() {
  const events = await getUpcomingEvents();

  return (
    <>
      <Hero />
      <UpcomingEvents events={events} />
      <CorporateTeaser />
      <RecentGallery />
      <GroupCta />
    </>
  );
}