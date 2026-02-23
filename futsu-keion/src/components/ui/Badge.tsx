interface BadgeProps {
  label: string
  variant?: 'primary' | 'secondary' | 'accent' | 'outline'
}

export const Badge = ({ label, variant = 'primary' }: BadgeProps) => {
  const styles = {
    primary: 'bg-pink-100 text-pink-700 border border-pink-200',
    secondary: 'bg-purple-100 text-purple-700 border border-purple-200',
    accent: 'bg-amber-100 text-amber-700 border border-amber-200',
    outline: 'bg-white text-gray-600 border border-gray-300',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${styles[variant]}`}>
      {label}
    </span>
  )
}
