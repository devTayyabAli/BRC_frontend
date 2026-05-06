// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewNavSectionTitle = props => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const ability = [{ action: "manage", subject: "all" }];
  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    return ability ? <>{children}</> : null
  }
}

export default CanViewNavSectionTitle
