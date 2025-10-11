import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Prompt Vault</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Prompt Vault</CardTitle>
            <CardDescription>Your secure AI prompt manager</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Main view coming soon...
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
