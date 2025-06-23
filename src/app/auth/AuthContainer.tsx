// components/auth/AuthContainer.tsx
export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center to-white p-4">
      {children}
    </div>
  )
}