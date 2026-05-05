import { describe, expect, it, vi } from 'vitest'

describe('prisma singleton', () => {
  it('sets dev logging and stores prisma globally in non-production', async () => {
    vi.resetModules()
    process.env.NODE_ENV = 'development'
    const ctor = vi.fn(function PrismaClient(this: any, options: any) { this.options = options })
    vi.doMock('@prisma/client', () => ({ PrismaClient: ctor }))

    const mod = await import('@/lib/prisma')

    expect(ctor).toHaveBeenCalledWith({ log: ['query', 'error', 'warn'] })
    expect((globalThis as any).prisma).toBe(mod.prisma)
  })

  it('uses production logging and does not set global in production', async () => {
    vi.resetModules()
    delete (globalThis as any).prisma
    process.env.NODE_ENV = 'production'
    const ctor = vi.fn(function PrismaClient(this: any, options: any) { this.options = options })
    vi.doMock('@prisma/client', () => ({ PrismaClient: ctor }))

    const mod = await import('@/lib/prisma')

    expect(ctor).toHaveBeenCalledWith({ log: ['error'] })
    expect((globalThis as any).prisma).toBeUndefined()
    expect(mod.prisma).toBeDefined()
  })
})
