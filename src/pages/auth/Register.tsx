import SignupForm from "@/components/forms/sign-up-form.tsx";

export default function Register({className, ...props}: React.ComponentProps<"div">) {
  return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
  )
}
