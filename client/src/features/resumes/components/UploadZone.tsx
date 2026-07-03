import { useCallback, useRef, useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { Button } from '../../../components/ui/Button'

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export const UploadZone = ({ onUpload, isUploading }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed')
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File must be under 5MB')
      }
      await onUpload(file)
    },
    [onUpload],
  )

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleFile(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-8 text-center transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-slate-300 bg-white hover:border-primary/50',
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Upload your resume</h3>
      <p className="mt-1 text-sm text-slate-500">Drag & drop a PDF, or click to browse (max 5MB)</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={isUploading}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await handleFile(file)
          e.target.value = ''
        }}
      />
      <Button
        isLoading={isUploading}
        disabled={isUploading}
        type="button"
        className="mt-6"
        onClick={() => inputRef.current?.click()}
      >
        <FileText className="h-4 w-4" />
        Choose PDF
      </Button>
    </div>
  )
}
