import React, { useMemo, useState } from 'react'
import { useEth } from 'hyperfy'

// Example - Hyperfy Worlds NFT contract
const CONTRACT = '0xf53b18570dB14C1e7DbC7DC74538c48D042f1332'
const MINT_PRICE = '0.06'

// Example - address owned by nobody
const PAYEE = '0x000000000000000000000000000000000000dEaD'

export function Web3() {
  const eth = useEth()
  const contract = useMemo(() => eth.contract(CONTRACT), [])
  const [status, setStatus] = useState(null)

  async function getBalance(e) {
    // check to see if the user is logged in
    const { address } = e.avatar
    // if there's no address, notify them via <text />
    if (!address) return setStatus('Not connected!')
    setStatus('Checking...')
    const balance = await contract.read('totalSupply')
    setStatus(`Balance: ${balance}`)
  }

  async function mint(e) {
    const { address } = e.avatar
    if (!address) return setStatus('Not connected!')
    setStatus('Please confirm transaction')

    // 'mint' is a function in the contract
    // 1 is a UINT parameter (amount to mint)
    // if there are more inputs, separate them with commas
    // { value: MINT_PRICE } is the amount of ETH to send. only usable on **payable** functions
    const tx = await contract.write('mint', 1, { value: eth.toWei(MINT_PRICE) })

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
    const tx = await eth.pay(PAYEE, eth.toWei('0.00001'))
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
