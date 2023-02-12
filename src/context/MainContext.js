import React, { useState } from 'react'

const MainContext = React.createContext()
const initialToas = {
  visible: false,
  autohide: false,
  message: '',
  color: '',
}
const intialModal = {
  visible: false,
  title: '',
  text: '',
  clickYesFunction: undefined,
  yesButtonClicked: false,
}
export const MainStore = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  const [toast, setToast] = useState(initialToas)
  const [modal, setModal] = useState(intialModal)

  const [allValue, setAllValue] = useState({
    textEditorValue: '',
    ouputValue: '',
    tableData: [],
  })

  const [userInfo, setUserInfo] = useState({
    userId: '',
  })

  const [sidebarItems, setSidebarItems] = useState([])

  const setTextEditorValue = (val) => {
    setAllValue({
      ...allValue,
      textEditorValue: val,
    })
  }

  const setOutputValue = (val) => {
    setAllValue({
      ...allValue,
      ouputValue: val,
    })
  }

  const setTableData = (param) => {
    setAllValue({
      ...allValue,
      tableData: param,
    })
  }

  const setSidebarItemsValue = (param) => {
    setSidebarItems(param)
  }

  const showSuccessToast = (message, autohide = true) => {
    setToast({
      visible: true,
      autohide: autohide,
      message: message,
      color: 'green',
    })
  }

  const showWarningToast = (message, autohide = true) => {
    setToast({
      visible: true,
      autohide: autohide,
      message: message,
      color: 'orange',
    })
  }

  const showErrorToast = (message, autohide = true) => {
    setToast({
      visible: true,
      autohide: autohide,
      message: message,
      color: 'red',
    })
  }

  const closeToast = () => {
    setToast({
      visible: false,
      autohide: false,
      message: '',
    })
  }

  const showModal = (title, text, clickYesFunction) => {
    setModal({
      visible: true,
      title: title,
      text: text,
      clickYesFunction: clickYesFunction,
    })
  }

  const closeModal = () => {
    setModal(intialModal)
  }

  const onClickModalYesButton = () => {
    setModal({
      ...modal,
      visible: false,
      yesButtonClicked: true,
    })
  }

  const onCloseModal = () => {
    if (modal.clickYesFunction && modal.yesButtonClicked) modal.clickYesFunction()
    closeModal()
  }

  return (
    <MainContext.Provider
      value={{
        allValue,
        setTextEditorValue,
        setOutputValue,
        setTableData,
        sidebarItems,
        setSidebarItemsValue,
        userInfo,
        setUserInfo,
        showLoader,
        setShowLoader,
        toast,
        showSuccessToast,
        showWarningToast,
        showErrorToast,
        closeToast,
        modal,
        showModal,
        closeModal,
        onClickModalYesButton,
        onCloseModal,
      }}
    >
      {props.children}
    </MainContext.Provider>
  )
}

export default MainContext
