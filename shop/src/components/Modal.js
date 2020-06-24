import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSpring, animated } from 'react-spring'

const Modal = ({ children, onClose, className, shouldClose }) => {
  const [show, setShow] = useState(false)

  const bgProps = useSpring({
    config: { duration: 150 },
    opacity: show ? 0.7 : 0
  })

  const modalProps = useSpring({
    config: { mass: 0.75, tension: 300, friction: 20 },
    opacity: show ? 1 : 0,
    transform: show ? 'translate3d(0px,0,0)' : 'translate3d(0,-100px,0)'
  })

  const el = useRef(document.createElement('div'))

  useEffect(() => {
    document.body.appendChild(el.current)
    document.getElementById('app').style.filter = 'blur(2px)'
    setShow(true)
    return () => {
      document.getElementById('app').style.filter = ''
      el.current.parentElement.removeChild(el.current)
    }
  }, [el])

  useEffect(() => {
    let timeout
    if (shouldClose) {
      setShow(false)
      timeout = setTimeout(() => onClose(), 150)
    }
    return function cleanup() {
      clearTimeout(timeout)
    }
  }, [shouldClose])

  const cmp = (
    <>
      <animated.div className="modal-backdrop" style={bgProps} />
      <animated.div
        className="modal d-block"
        tabIndex="-1"
        style={modalProps}
        onClick={() => {
          setShow(false)
          setTimeout(() => onClose(), 150)
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`modal-dialog modal-dialog-centered ${className || ''}`}
          role="document"
        >
          <div className="modal-content">{children}</div>
        </div>
      </animated.div>
    </>
  )

  return createPortal(cmp, el.current)
}

export default Modal

require('react-styl')(`
  .modal-backdrop
    background-color: #fff
  .modal-content .text-lg
    font-size: 28px
    line-height: normal
  .modal-content .actions
    margin-top: 2rem
`)
