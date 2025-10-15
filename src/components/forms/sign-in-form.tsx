import { useState } from "react"
import { AlertCircle, Vault } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { Alert, AlertTitle } from "@/components/ui/alert.tsx"
import SocialLoginButton from "@/components/auth/SocialLoginButton"

const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type SigninFormData = z.infer<typeof signinSchema>

export default function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema)
    })

    const onSubmit = async (data: SigninFormData) => {
        setLoading(true)
        setError(null)

        try {
            const { data: authData, error: signinError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password
            })

            if (signinError) {
                throw signinError
            }

            // Navigate to success page after successful login
            navigate('/login-success')
        } catch (err: any) {
            setError(err.message || "An error occurred during sign in")
        } finally {
            setLoading(false)
        }
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
                        <h1 className="text-xl font-bold">Welcome back</h1>
                        <FieldDescription>
                            Don't have an account? &nbsp;
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => navigate('/register')}
                                className="p-0 h-auto font-medium"
                            >
                                Sign up
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
                    <Field>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <SocialLoginButton
                provider="google"
                onError={(errorMsg) => setError(errorMsg)}
                disabled={loading}
                className="w-full"
            />
        </div>
    )
}
