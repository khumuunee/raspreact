import { useContext, useEffect, useState } from 'react'
import MainContext from '../../../context/MainContext'
import './paraview.scss'
import axios from '../../../axios-blm'
import { useParams } from 'react-router-dom'

const Paraview = (props) => {
  const { blockModelId } = useParams()
  const mainContext = useContext(MainContext)

  // useEffect(() => {
  //   let isNeedClearInterval = true
  //   axios.post(`/startParaview`, { tableName: blockModelId }).then((khariu) => {
  //     var checkParaviewStatusTimer = window.setInterval(function () {
  //       axios.get('/getParaviewStatus?tableName=' + blockModelId).then((res) => {
  //         if (res.data === 'Ready') {
  //           clearInterval(checkParaviewStatusTimer)
  //           isNeedClearInterval = false
  //           setTimeout(function () {
  //             resetIframe()
  //           }, 2000)
  //         }
  //       })
  //     }, 2000)

  //     if (isNeedClearInterval)
  //       setTimeout(function () {
  //         clearInterval(checkParaviewStatusTimer)
  //       }, 300000)
  //   })
  // }, [])

  return (
    <div key={props.iframeState} className="containerDiv">
      {props.showIFrame ? (
        <iframe className="paraviewFrame" src={props.frameSrc}></iframe>
      ) : (
        <div id="app">
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              zIndex: '1000',
            }}
          >
            <div className="trame__loader"></div>
            <div className="trame__message">3D Visualization</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Paraview
