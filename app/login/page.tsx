import LoginForm from "@/components/dashboard/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
	return (
		<main className='flex min-h-screen items-center justify-center p-6'>
			<Suspense fallback={<div>Loading...</div>}>
				{/* In the Next.js App Router, useSearchParams() is an async client-side hook that must be rendered inside a React Suspense boundary. */}
				<LoginForm />
			</Suspense>
		</main>
	);
};

export default LoginPage;
