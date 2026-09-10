import { useCallback, useState } from 'react'

export interface FileValidationOptions {
  maxSizeMB?: number
  allowedMimeTypes?: string[]
  maxFiles?: number
}

export interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  error?: string
}

const DEFAULT_OPTIONS: Required<FileValidationOptions> = {
  maxSizeMB: 5,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles: 5,
}

export function useFileUpload(options: FileValidationOptions = {}) {
  const maxSizeMB = options.maxSizeMB ?? DEFAULT_OPTIONS.maxSizeMB
  const allowedMimeTypes = options.allowedMimeTypes ?? DEFAULT_OPTIONS.allowedMimeTypes
  const maxFiles = options.maxFiles ?? DEFAULT_OPTIONS.maxFiles

  const [files, setFiles] = useState<UploadedFile[]>([])

  const validate = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File size exceeds ${maxSizeMB}MB`
      }
      if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
        return `File type ${file.type} is not allowed`
      }
      return null
    },
    [allowedMimeTypes, maxSizeMB]
  )

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming)
      setFiles((prev) => {
        const remaining = maxFiles - prev.length
        if (remaining <= 0) return prev

        const next = list.slice(0, remaining).map((file) => {
          const error = validate(file)
          const id = crypto.randomUUID()
          let preview: string | undefined
          if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file)
          }
          return { id, file, preview, progress: 0, error: error ?? undefined }
        })

        return [...prev, ...next]
      })
    },
    [maxFiles, validate]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.preview) URL.revokeObjectURL(target.preview)
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
      return []
    })
  }, [])

  const updateProgress = useCallback((id: string, progress: number) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)))
  }, [])

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    updateProgress,
    hasErrors: files.some((f) => !!f.error),
  }
}
