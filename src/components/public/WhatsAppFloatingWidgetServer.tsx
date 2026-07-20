import { getWaWidgetSettings, getWaContacts } from "@/actions/wa-contact.actions"
import WhatsAppFloatingWidget from "./WhatsAppFloatingWidget"


export default async function WhatsAppFloatingWidgetServer() {
  const [settings, allContacts] = await Promise.all([getWaWidgetSettings(), getWaContacts()])

  if (!settings.enabled) return null

  const activeContacts = allContacts.filter((c) => c.active)

  return (
    <WhatsAppFloatingWidget
      title={settings.title}
      hours={settings.hours}
      tooltip={settings.tooltip}
      message={settings.message}
      contacts={activeContacts}
    />
  )
}