import Watcher from '@/pages/Watcher/Watcher'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/watcher')({
    component: Watcher,
})
