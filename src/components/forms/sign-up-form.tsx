import { useState } from "react"
import {AlertCircle, PopcornIcon, Vault} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription, FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {useNavigate} from "react-router-dom";

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupForm({className, ...props}: React.ComponentProps<"div">) {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema)
    })

    const onSubmit = async (data: SignupFormData) => {
        setLoading(true)
        setError(null)

        try {
            const { data: authData, error: signupError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password
            })

            if (signupError) {
                throw signupError
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || "An error occurred during registration")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex size-8 items-center justify-center rounded-md">
                        <Vault className="size-8" />
                    </div>
                    <h1 className="text-xl font-bold">Check your email</h1>
                    <FieldDescription>
                        We've sent you a confirmation link. Please check your email to verify your account.
                    </FieldDescription>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className={cn("gap-4")}>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <a
                            href="https://trypromptvault.com/?ref=extension-chrome"
                            className="flex flex-col items-center gap-2 font-medium"
                            target="_blank"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <Vault className="size-8" />
                            </div>
                            <span className="sr-only">Prompt Vault</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to Prompt Vault</h1>
                        <FieldDescription>
                            Already have an account? &nbsp;
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => navigate('/login')}
                                className="p-0 h-auto font-medium"
                            >
                                Sign in
                            </Button>
                        </FieldDescription>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle />
                            <AlertTitle>
                                {error}
                            </AlertTitle>
                        </Alert>
                    )}

                    <Field data-invalid={errors.email ? true : undefined}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            aria-invalid={errors.email ? true : undefined}
                            {...register("email")}
                        />
                        {errors.email && (
                            <FieldError>{errors.email.message}</FieldError>
                        )}
                    </Field>
                    <Field data-invalid={errors.password ? true : undefined}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            aria-invalid={errors.password ? true : undefined}
                            {...register("password")}
                        />
                        {errors.password && (
                            <FieldError>{errors.password.message}</FieldError>
                        )}
                    </Field>
                    <Field data-invalid={errors.confirmPassword ? true : undefined}>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            aria-invalid={errors.confirmPassword ? true : undefined}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <FieldError>{errors.confirmPassword.message}</FieldError>
                        )}
                    </Field>
                    <Field>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
