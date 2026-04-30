"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginPage = () => {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState(searchParams.get("email") ?? "");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("came here");

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			toast.error("Credentails entered are wrong!");
			router.push("/signup");
			return;
		}
		router.push("/dashboard");
	};

	return (
		<main className='flex min-h-screen items-center justify-center p-6'>
			<form
				onSubmit={handleLogin}
				className='w-full max-w-sm space-y-4 rounded-lg border p-6'
			>
				{" "}
				<h1 className='text-2xl font-bold'>Login</h1>
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
					Login
				</Button>
				<p className='text-sm text-muted-foreground'>
					Don&apos;t have an account?{" "}
					<a href='/signup' className='underline'>
						Sign up
					</a>
				</p>
			</form>
		</main>
	);
};

export default LoginPage;
