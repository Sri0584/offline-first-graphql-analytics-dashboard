import LoginForm from "@/components/dashboard/LoginForm";

type LoginPageProps = {
	searchParams: Promise<{
		email?: string | string[];
	}>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
	const params = await searchParams;
	const initialEmail =
		typeof params.email === "string" ? params.email : params.email?.[0] ?? "";

	return (
		<main className='flex min-h-screen items-center justify-center p-6'>
			<LoginForm initialEmail={initialEmail} />
		</main>
	);
};

export default LoginPage;
