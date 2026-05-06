import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import Spinner from "src/@core/components/spinner";

const GuestGuard = ({ children, fallback }) => {
  const { loading, user } = useAuth()
  const router = useRouter()
  if (!router.isReady || loading) {
    return <Spinner />
  }
  if (user !== null) {
    router.replace('/dashboards/analytics')
    return null;
  }
  return <>{children}</>
}

export default GuestGuard
