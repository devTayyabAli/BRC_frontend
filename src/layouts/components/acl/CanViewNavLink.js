// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewNavLink = props => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = [{ action: "manage", subject: "all" }];
  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    return ability ? <>{children}</> : null
  }
}

export default CanViewNavLink
