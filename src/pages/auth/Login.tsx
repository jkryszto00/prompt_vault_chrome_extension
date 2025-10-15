import SigninForm from "@/components/forms/sign-in-form.tsx"

export default function Login({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SigninForm />
            </div>
        </div>
    )
}
