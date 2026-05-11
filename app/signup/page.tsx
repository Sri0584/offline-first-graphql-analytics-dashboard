"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
// Category
// SSG/static shell with client hydration.
// Why
// app/signup/page.tsx starts with "use client", which means the page is a Client Component.
// However, the initial render does not need server-side data. The form is rendered with local React state, and the actual signup
// request only happens after the user submits the form using fetch("/api/signup").
// Why not SSR?
// The page does not need per-user server information to show the signup form. Every visitor sees the same initial form. The server is only contacted after submission
// through the API route.
const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong!");
			}

			toast.success("Account created successfully!");
			router.push(`/login?email=${encodeURIComponent(email)}`);
		} catch (error) {
			console.log(error, "error");

			toast.error(error instanceof Error ? error.message : "Signup failed");
		}
	};
	return (
		<main className='flex min-h-screen items-center justify-center p-6'>
			<form
				onSubmit={handleSignup}
				className='w-full max-w-sm space-y-4 rounded-lg border p-6'
			>
				<h1 className='text-2xl font-bold'>Sign Up</h1>
				<Input
					className='w-full rounded border px-3 py-2'
					placeholder='Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					className='w-full rounded border px-3 py-2'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					className='w-full rounded border px-3 py-2'
					placeholder='Password'
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button className='w-full rounded bg-primary px-4 py-2 text-primary-foreground'>
					Create Account
				</Button>
			</form>
		</main>
	);
};

export default SignUpPage;
