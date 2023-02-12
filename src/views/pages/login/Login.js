import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'src/axios-blm'
import MainContext from 'src/context/MainContext'

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [warningText, setWarningText] = useState('')
  const [showWarningText, setShowWarningText] = useState(false)
  const navigate = useNavigate()
  const mainContext = useContext(MainContext)

  const changeUserName = (e) => {
    setShowWarningText(false)
    setUserName(e.target.value)
  }

  const changePassword = (e) => {
    setShowWarningText(false)
    setPassword(e.target.value)
  }

  const login = (e) => {
    e.preventDefault()
    axios.post('/login', { userId: userName, password: password }).then((res) => {
      console.log(res.data)
      if (res.data === 'EmptyUserInfo') {
        setShowWarningText(true)
        setWarningText('Please enter username and password')
        return
      }
      if (res.data === 'WrongInfo') {
        setShowWarningText(true)
        setWarningText('Username or password invalid')
        return
      }
      mainContext.setUserInfo({ ...mainContext.userInfo, userId: userName })
      navigate('/dashboard')
    })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={changeUserName}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={changePassword}
                        required
                      />
                    </CInputGroup>
                    {showWarningText && (
                      <div className="mb-4" style={{ color: 'red' }}>
                        {warningText}
                      </div>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" onClick={login}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
