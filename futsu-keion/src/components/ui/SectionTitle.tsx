interface SectionTitleProps {
  en: string
  ja: string
}

export const SectionTitle = ({ en, ja }: SectionTitleProps) => {
  return (
    <div className="text-center mb-12">
      <p className="text-sm font-bold tracking-[0.3em] text-[#E8201A] uppercase mb-2">{en}</p>
      <h2 className="text-3xl md:text-4xl font-black text-gray-900">
        {ja}
      </h2>
      <div className="mt-4 mx-auto w-16 h-1.5 rounded-full bg-[#E8201A]" />
    </div>
  )
}
