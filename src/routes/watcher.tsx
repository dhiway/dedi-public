import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/watcher')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/watcher"!</div>
}
