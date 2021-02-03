import { CommentoEmbed } from '@components/CommentoEmbed'

interface CommentoCommentsProps {
  id: string
  url: string
}

export const CommentoComments = (props: CommentoCommentsProps) => (
  <section>
    <CommentoEmbed {...props} />
  </section>
)
