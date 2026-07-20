import FaqSection from "@/components/sections/home/FaqSection"
import ContactClient from "./ContactClient"

export const dynamic = 'force-dynamic';

export default function KontakPage() {
  return (
    <>
      <ContactClient />
      <FaqSection />
    </>
  )
}