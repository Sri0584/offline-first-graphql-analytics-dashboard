import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
const findUnique = vi.fn();
const compare = vi.fn();

vi.mock("@/lib/prisma", () => ({
	prisma: { user: { findUnique } },
}));

vi.mock("bcrypt", () => ({
	default: { compare },
}));

describe("auth options", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns null for missing credentials", async () => {
		const { authOptions } = await import("@/lib/auth");
		const provider = authOptions.providers[0];
		const result = await provider.options.authorize({
			email: "",
			password: "",
		});
		expect(result).toBeNull();
	});

	it("returns null when user not found", async () => {
		findUnique.mockResolvedValueOnce(null);
		const { authOptions } = await import("@/lib/auth");
		const provider = authOptions.providers[0];
		const result = await provider.options.authorize({
			email: "a@b.com",
			password: "x",
		});
		expect(result).toBeNull();
	});

	it("returns null for invalid password and user object for valid password", async () => {
		findUnique.mockResolvedValueOnce({
			id: "1",
			email: "a@b.com",
			name: "A",
			password: "hash",
		});
		compare.mockResolvedValueOnce(false);

		const { authOptions } = await import("@/lib/auth");
		const provider = authOptions.providers[0];
		expect(
			await provider.options.authorize({ email: "a@b.com", password: "bad" }),
		).toBeNull();

		findUnique.mockResolvedValueOnce({
			id: "1",
			email: "a@b.com",
			name: "A",
			password: "hash",
		});
		compare.mockResolvedValueOnce(true);
		expect(
			await provider.options.authorize({ email: "a@b.com", password: "good" }),
		).toEqual({ id: "1", email: "a@b.com", name: "A" });
	});

	it("covers jwt and session callbacks", async () => {
		const { authOptions } = await import("@/lib/auth");
		const jwt = await authOptions.callbacks!.jwt!({
			token: {},
			user: { id: "u1" } as AdapterUser,
		});
		expect(jwt).toEqual({ id: "u1" });

		const jwtNoUser = await authOptions.callbacks!.jwt!({
			token: { a: 1 },
			user: undefined as any,
		});
		expect(jwtNoUser).toEqual({ a: 1 });

		const sess = await authOptions.callbacks!.session!({
			session: { user: {} } as any,
			token: { id: "u2" } as any,
		});
		expect(sess.user.id).toBe("u2");

		const sessNoUser = await authOptions.callbacks!.session!({
			session: {} as any,
			token: { id: "u2" } as any,
		});
		expect(sessNoUser).toEqual({});
	});
});
