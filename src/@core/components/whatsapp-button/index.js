// ** MUI Imports
import Zoom from '@mui/material/Zoom'
import { styled } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { ENV } from 'src/configs/env'

const ScrollToTopStyled = styled('div')(({ theme }) => ({
  zIndex: "2000",
  position: 'fixed',
  left: theme.spacing(10),
  bottom: theme.spacing(3),
  backgroundColor: "#25D366",
  padding: "10px",
  borderRadius: "20px",
  color: "#fff",
  display: 'flex',
  alignItems: "center",
  gap: "10px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer"
}));


const WhatsAppButton = props => {
  // ** Props
  const { children, className } = props

  // ** init trigger
  const trigger = useScrollTrigger({
    threshold: 400,
    disableHysteresis: true
  })

  const handleWhatsAppClick = () => {
      const url = `https://wa.me/${ENV.whatsappUrl}`;
      window.open(url, '_blank');
    };

  return (

      <ScrollToTopStyled className={className} onClick={handleWhatsAppClick} role='presentation'>
        {children}
      </ScrollToTopStyled>

  )
}

export default WhatsAppButton
