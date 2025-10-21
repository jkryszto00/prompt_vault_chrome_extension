import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const collectionSchema = z.object({
  name: z.string()
    .min(1, "Collection name is required")
    .max(50, "Collection name must be less than 50 characters")
})

type CollectionFormData = z.infer<typeof collectionSchema>

interface EditCollectionFormProps extends React.ComponentProps<"form"> {
  collectionName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EditCollectionForm({
  className,
  collectionName,
  onSuccess,
  onCancel,
  ...props
}: EditCollectionFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: collectionName
    }
  })

  const onSubmit = async (data: CollectionFormData) => {
    setLoading(true)

    try {
      // TODO: Add your collection update logic here
      // Example: await supabase.from('collections').update({ name: data.name }).eq('id', collectionId)
      console.log("Updating collection:", collectionName, "->", data.name)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Call success callback
      onSuccess?.()
    } catch (error) {
      console.error("Error updating collection:", error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      {...props}
    >
      <FieldGroup className="gap-4">
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="collection-name">Collection name</FieldLabel>
          <Input
            id="collection-name"
            type="text"
            placeholder="Enter collection name"
            aria-invalid={errors.name ? true : undefined}
            autoFocus
            {...register("name")}
          />
          {errors.name && (
            <FieldError>{errors.name.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
