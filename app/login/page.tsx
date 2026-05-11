import LoginForm from "@/components/dashboard/LoginForm";
import { Suspense } from "react";
// Category
// SSG/static shell with client hydration.
// Why
// app/login/page.tsx is a simple page component. It does not call getServerSession(), does not read
// cookies directly, does not query the database, and does not use server-only request data.
// It renders a main wrapper and places LoginForm inside Suspense.
// Why not SSR?
// Because the login page does not need to know the logged-in user before rendering. It can show the same
// initial login form to everyone.
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
