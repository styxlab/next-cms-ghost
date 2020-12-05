import { Commento } from '@components/Commento'

interface CommentsProps {
  id: string
  url: string
}

export const Comments = (props: CommentsProps) => (
  <section>
    <Commento {...props} />
  </section>
)
