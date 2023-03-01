import { useContext, useEffect } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import MyQuestionModal from 'src/components/MyQuestionModal'
import MainContext from 'src/context/MainContext'
import { AppContent, AppHeader, AppSidebar } from '../components/index'
LoadingOverlay.propTypes = undefined

const DefaultLayout = () => {
  const navigate = useNavigate()
  const mainContext = useContext(MainContext)

  useEffect(() => {
    // Check user is logged in
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!userInfo || !userInfo?.userId) {
      navigate('login')
      return
    }
  }, [])

  return (
    <div>
      <LoadingOverlay
        active={mainContext.showLoader}
        spinner={<BeatLoader color="#059d0b" size={50} />}
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'rgba(0,0,0,0.1)',
            position: 'fixed',
          }),
        }}
      >
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          {/* <AppFooter /> */}
        </div>
      </LoadingOverlay>
      <MyQuestionModal />
    </div>
  )
}

export default DefaultLayout
