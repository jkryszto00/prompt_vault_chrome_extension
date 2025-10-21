"use client"

import { useState } from "react"
import {
  Folder,
  Plus,
  Share,
  Trash2,
  MoreHorizontal,
  type LucideIcon
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import CreateCollectionForm from "@/components/forms/create-collection-form"
import EditCollectionForm from "@/components/forms/edit-collection-form"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<{
    name: string
    url: string
    icon: LucideIcon
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateSuccess = () => {
    setCreateOpen(false)
  }

  const handleCreateCancel = () => {
    setCreateOpen(false)
  }

  const handleEditSuccess = () => {
    setEditOpen(false)
    setSelectedCollection(null)
  }

  const handleEditCancel = () => {
    setEditOpen(false)
    setSelectedCollection(null)
  }

  const handleDelete = async () => {
    if (!selectedCollection) return

    setIsDeleting(true)

    try {
      // TODO: Add your collection deletion logic here
      // Example: await supabase.from('collections').delete().eq('id', collectionId)
      console.log("Deleting collection:", selectedCollection.name)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Close dialog and clear selection
      setDeleteOpen(false)
      setSelectedCollection(null)
    } catch (error) {
      console.error("Error deleting collection:", error)
      // TODO: Show error message to user
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteOpen(false)
    setSelectedCollection(null)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between gap-2">
        Collections
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Plus />
              <span className="sr-only">Create collection</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create collection</DialogTitle>
            </DialogHeader>
            <CreateCollectionForm
              onSuccess={handleCreateSuccess}
              onCancel={handleCreateCancel}
            />
          </DialogContent>
        </Dialog>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedCollection(item)
                    setEditOpen(true)
                  }}
                >
                  <Folder className="text-muted-foreground" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedCollection(item)
                    setDeleteOpen(true)
                  }}
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Edit Collection Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit collection</DialogTitle>
          </DialogHeader>
          {selectedCollection && (
            <EditCollectionForm
              collectionName={selectedCollection.name}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Collection Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the collection "{selectedCollection?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarGroup>
  )
}
