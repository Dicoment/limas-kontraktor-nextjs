import { getWaWidgetSettings, getWaContacts } from "@/actions/wa-contact.actions"
import WaFloatingManager from "@/components/admin/WaFloatingManager"

export const dynamic = "force-dynamic"

export default async function WaFloatingPage() {
  const [settings, contacts] = await Promise.all([getWaWidgetSettings(), getWaContacts()])
  return <WaFloatingManager initialSettings={settings} initialContacts={contacts} />
}