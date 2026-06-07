import { beforeAll, afterAll, afterEach, vi } from "vitest"
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

export const mockUser = {
  id: "test-user-123",
  email: "admin@limaskontraktor.com",
  password: "",
  name: "Test Admin",
  role: "admin",
  createdAt: new Date(),
}

beforeAll(async () => {
  
})

afterEach(async () => {
  vi.clearAllMocks()
})

afterAll(async () => {
  await prisma.$disconnect()
})

export const createMockSession = (overrides = {}) => ({
  user: {
    id: "test-user-123",
    email: "admin@limaskontraktor.com",
    name: "Test Admin",
    role: "admin",
    ...overrides,
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
})

export const mockAuth = () => ({
  user: { id: "test-user-123", email: "admin@limaskontraktor.com" },
})

export const createMockSetting = (overrides = {}) => ({
  id: "setting-1",
  key: "company_name",
  value: "LIMAS KONTRAKTOR",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const mockSettingsData = {
  company_name: "LIMAS KONTRAKTOR",
  company_description: "LIMAS KONTRAKTOR merupakan brand dari CV Listiya Mandiri Jaya Steel",
  company_address: "Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru, Kecamatan Medan Satria, Kota Bekasi, Jawa Barat 17183.",
  contact_phone1: "0823-2072-1150",
  contact_phone2: "0812-8767-2654",
  contact_email: "cvlistiyamandirijayasteel70a@gmail.com",
  social_instagram: "limas.kontraktor",
  social_facebook: "Limas Kontraktor",
  social_tiktok: "LIMAS KONTRAKTOR",
  social_youtube: "Limas Kontraktor",
}
