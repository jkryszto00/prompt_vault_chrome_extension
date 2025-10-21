import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Star } from 'lucide-react'

export default function Favorites() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Favorites</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <p className="text-sm">Your favorite prompts will appear here</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">No favorites yet</CardTitle>
              <CardDescription className="text-xs">
                Mark prompts as favorites to quickly access them here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Favorite prompts coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
