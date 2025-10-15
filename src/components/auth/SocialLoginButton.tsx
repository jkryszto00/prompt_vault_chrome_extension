import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface SocialLoginButtonProps {
    provider: "google"
    redirectTo?: string
    onError?: (error: string) => void
    disabled?: boolean
    className?: string
}

export default function SocialLoginButton({
    provider,
    redirectTo = `${window.location.origin}/login-success`,
    onError,
    disabled = false,
    className
}: SocialLoginButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleSocialSignIn = async () => {
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: redirectTo
                }
            })

            if (error) {
                if (onError) {
                    onError(error.message)
                }
            }
        } catch (err: any) {
            if (onError) {
                onError(err.message || "An error occurred during sign in")
            }
        } finally {
            setLoading(false)
        }
    }

    const getProviderIcon = () => {
        switch (provider) {
            case "google":
                return <FcGoogle className="mr-2 h-4 w-4" />
            default:
                return null
        }
    }

    const getProviderName = () => {
        switch (provider) {
            case "google":
                return "Google"
            default:
                return provider
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleSocialSignIn}
            disabled={disabled || loading}
            className={className}
        >
            {getProviderIcon()}
            {loading ? "Signing in..." : `Sign in with ${getProviderName()}`}
        </Button>
    )
}
