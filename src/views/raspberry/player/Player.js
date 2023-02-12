import React, { useContext, useEffect, useRef, useState } from 'react'
import './player.scss'
import {
  ArrowDropDown,
  Eject,
  ExpandCircleDown,
  PauseCircle,
  PlayCircle,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material'
import { CCol, CContainer, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import MainContext from 'src/context/MainContext'
import axiosInstance from 'src/axios-blm'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'
import { IconButton } from '@mui/material'

const Player = (props) => {
  const clickRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState({})
  const [progress, setProgress] = useState(0)
  const [totalDuration, settotalDuration] = useState(0)
  const [currentSoundIndex, setcurrentSoundIndex] = useState(-1)
  const mainContext = useContext(MainContext)

  const PlayPause = () => {
    // setIsPlaying(!isPlaying)
    if (isPlaying) pausePlayer()
    else playPlayer()
  }

  const pausePlayer = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/pausePlayerInRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
      })
      .then((res) => {
        handleResponse(res)
        setIsPlaying(false)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }
  const playPlayer = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/playPlayerInRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
      })
      .then((res) => {
        handleResponse(res)
        setIsPlaying(true)
        setProgress(progress + 0.001)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  useEffect(() => {
    if (!isPlaying) return
    getPlayerStatus()
  }, [progress])

  const getPlayerStatus = () => {
    axiosInstance
      .post('/getCurrentPlayerStatusFromRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
      })
      .then((res) => {
        handleResponse(res)
        if (!res.data.isPlaying) {
          //   setProgress(0)
          setIsPlaying(false)
          return
        }
        let duration = totalDuration
        const isScheduledSound = res.data.isPlayingScheduledSound
        const currentScheduledSoundName = res.data.currentSoundName
        let currentSongName = currentSong.name
        if (
          currentSoundIndex !== res.data.currentSoundIndex ||
          (isScheduledSound && currentSong.name !== currentScheduledSoundName)
        ) {
          duration = res.data.totalDuration
          settotalDuration(duration)
          if (currentSoundIndex !== res.data.currentSoundIndex) {
            if (res.data.currentSoundIndex !== -2)
              currentSongName = props.playerData.listSound[res.data.currentSoundIndex]
            setcurrentSoundIndex(res.data.currentSoundIndex)
          }
          if (isScheduledSound && currentSong.name !== currentScheduledSoundName) {
            currentSongName = currentScheduledSoundName
          }
          setCurrentSong({
            name: currentSongName,
          })
        }
        let progress = (res.data.currentTime / duration) * 100
        if (progress > 100) progress = 100
        setProgress(progress)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
  }

  useEffect(() => {
    setIsPlaying(props.playerData.isPlaying)
    if (props.playerData.listSoundName.length > 0) {
      const currentSongName = props.playerData.listSoundName[props.playerData.currentSoundIndex]
      setCurrentSong({
        name: currentSongName,
      })
    } else {
      setCurrentSong({ name: null })
    }
    const progress = (props.playerData.currentTime / props.playerData.totalDuration) * 100
    settotalDuration(props.playerData.totalDuration)
    setProgress(progress)
    setcurrentSoundIndex(props.playerData.currentSoundIndex)
  }, [props.playerData])

  const checkWidth = (e) => {
    if (!isPlaying) return
    const width = clickRef.current.clientWidth
    const offset = e.nativeEvent.offsetX
    const divprogress = (offset / width) * 100
    const time = (divprogress / 100) * totalDuration
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/setCurrentPlayerProgressInRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
        time: time,
      })
      .then((res) => {
        handleResponse(res)
        setProgress(divprogress)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const playPrev = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/playPreviousSoundInRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
      })
      .then((res) => {
        handleResponse(res)
        setIsPlaying(true)
        setProgress(0.000001)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const playNext = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/playNextSoundInRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
      })
      .then((res) => {
        handleResponse(res)
        setIsPlaying(true)
        setProgress(0.000001)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const isActiveSound = (soundName) => {
    if (currentSoundIndex === -1 || currentSoundIndex === -2) return false
    return soundName === currentSong.name
  }

  const onClickPlaySound = (soundName) => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/playSoundWithNameInRaspberry', {
        raspIpAddress: props.playerData.raspIpAddress,
        soundName: soundName,
      })
      .then((res) => {
        handleResponse(res)
        setIsPlaying(true)
        setProgress(0.000001)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  return (
    <fieldset className="player-fieldset">
      <legend className="player-fieldset-legend">
        {props.playerData.raspName}: {props.playerData.playlistName}
      </legend>
      <CContainer className="header control-header player-top-container">
        <CCol xs="7">
          <div className="player_container">
            <div className="title">
              <p>{currentSong.name}</p>
            </div>
            <div className="navigation">
              <div className="navigation_wrapper" onClick={checkWidth} ref={clickRef}>
                <div className="seek_bar" style={{ width: `${progress + '%'}` }}></div>
                {/* <div className="seek_bar" style={{ width: '50%' }}></div> */}
              </div>
            </div>
            <div className="controls">
              <SkipPrevious className="btn_action" onClick={playPrev} />
              {isPlaying ? (
                <PauseCircle className="btn_action pp" onClick={PlayPause} />
              ) : (
                <PlayCircle className="btn_action pp" onClick={PlayPause} />
              )}
              <SkipNext className="btn_action" onClick={playNext} />
              <ArrowDropDown className="btn_action" onClick={() => props.setShowPlayer(false)} />
            </div>
          </div>
        </CCol>
        <CCol xs="5">
          <CListGroup className="player-listGroup">
            {props.playerData.listSound.map((sound, idx) => (
              <CListGroupItem key={idx} className="player-list-sound-item">
                <CRow>
                  <CCol xs="9">{sound}</CCol>
                  <CCol xs="3" style={{ textAlign: 'right' }}>
                    <IconButton
                      className="player-list-sound-item"
                      onClick={() => onClickPlaySound(sound)}
                    >
                      <PlayCircle style={isActiveSound(sound) ? { color: 'green' } : {}} />
                    </IconButton>
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
      </CContainer>
    </fieldset>
  )
}

export default Player
