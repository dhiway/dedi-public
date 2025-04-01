import { createFileRoute } from '@tanstack/react-router'
import RegistryDetail from '../pages/Dashaboard/RegistryDetails';


export const Route = createFileRoute('/registries/$namespace_id')({
  component: RegistryDetail,
})

