import { getSettingsMap } from "@/actions/misc.actions"
import CTAFooter from "./CTAFooter"

/** Format nomor telepon Indonesia jadi format wa.me (62xxx, tanpa strip/spasi/0 depan). */
function formatWaPhone(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, "")
  if (digitsOnly.startsWith("0")) return `62${digitsOnly.slice(1)}`
  if (digitsOnly.startsWith("62")) return digitsOnly
  return digitsOnly
}

export default async function CTAFooterServer() {
  const settings = await getSettingsMap()
  const waPhone = formatWaPhone(settings.contact_phone1 || "6282320721150")

  return <CTAFooter waPhone={waPhone} />
}