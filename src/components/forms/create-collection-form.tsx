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

interface CreateCollectionFormProps extends React.ComponentProps<"form"> {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CreateCollectionForm({
  className,
  onSuccess,
  onCancel,
  ...props
}: CreateCollectionFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema)
  })

  const onSubmit = async (data: CollectionFormData) => {
    setLoading(true)

    try {
      // TODO: Add your collection creation logic here
      // Example: await supabase.from('collections').insert({ name: data.name })
      console.log("Creating collection:", data.name)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Reset form and call success callback
      reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error creating collection:", error)
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
          {loading ? "Creating..." : "Create collection"}
        </Button>
      </div>
    </form>
  )
}
