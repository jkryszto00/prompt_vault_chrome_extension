import { useEffect, useRef } from "react"
import { CheckCircle2, ArrowUp, X } from "lucide-react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginSuccess() {
    const arrowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // GSAP animation for arrow - bouncing effect
        if (arrowRef.current) {
            gsap.to(arrowRef.current, {
                y: -15,
                duration: 0.8,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true
            })
        }
    }, [])

    const handleCloseTab = () => {
        window.close()
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
            {/* Animated arrow in top right corner */}
            <div
                ref={arrowRef}
                className="absolute top-6 right-6 flex flex-col items-center gap-2 text-muted-foreground"
            >
                <ArrowUp className="h-8 w-8" />
                <span className="text-xs font-medium text-center max-w-[100px]">
                    Click here to open extension
                </span>
            </div>

            {/* Success card */}
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Successfully Logged In!</CardTitle>
                    <CardDescription>
                        You have been successfully authenticated. You can now close this tab and use the extension.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 text-sm">
                        <p className="font-medium mb-2">Next steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Click the Prompt Vault icon in your browser toolbar (top right)</li>
                            <li>Start organizing and managing your AI prompts</li>
                            <li>Close this tab when ready</li>
                        </ol>
                    </div>

                    <Button
                        onClick={handleCloseTab}
                        variant="outline"
                        className="w-full"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Close this tab
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
