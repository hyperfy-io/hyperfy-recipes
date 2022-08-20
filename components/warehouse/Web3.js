import React, { useMemo, useState } from 'react'
import { useEth } from 'hyperfy'

const CONTRACT = '0xf53b18570dB14C1e7DbC7DC74538c48D042f1332'
const MINT_PRICE = '0.06'
const PAYEE = '0x377aCc3717a67e2F5D8E7818c0360Bcdf0E17Af4'

export function Web3() {
  const eth = useEth('rinkeby')
  const contract = useMemo(() => eth.contract(CONTRACT), [])
  const [status, setStatus] = useState(null)

  async function getBalance(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Checking...')
    const balance = await contract.read('totalSupply')
    setStatus(`Balance: ${balance}`)
  }

  async function mint(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please confirm transaction')
    const tx = await contract.write(
      'mint', 1, { value: eth.toWei(MINT_PRICE) }
    )
    setStatus('Verifying...')
    await tx.wait()
    setStatus('Minted!')
  }

  async function sign(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please sign message')
    const signature = await eth.sign('Howdy!')
    setStatus('Signed!')
  }

  async function pay(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please confirm payment')
    const tx = await eth.pay(PAYEE, eth.toWei('0.01'))
    setStatus('Verifying...')
    await tx.wait()
    setStatus('Paid!')
  }

  return (
    <>
      {status && <text color="white" value={status} position={[0, 1.5, 0]} />}
      <box
        color="white"
        size={0.5}
        position={[-0.9, 1, 0]}
        onClick={getBalance}
      />
      <box color="blue" size={0.5} position={[-0.3, 1, 0]} onClick={mint} />
      <box color="red" size={0.5} position={[0.3, 1, 0]} onClick={sign} />
      <box color="green" size={0.5} position={[0.9, 1, 0]} onClick={pay} />
    </>
  )
}
