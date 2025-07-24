import { useContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import abi from '@/lib/abi.json'

const contractAddress = '0xYourContractAddress'

export function usePresaleMint() {
  const { writeAsync } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'mintPresale',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function mintPresale(amount: number, proof: string[]) {
    setLoading(true)
    setError('')
    try {
      const tx = await writeAsync({
        args: [amount, proof],
        value: parseEther((0.01 * amount).toString()),
      })
      await tx.wait()
    } catch (err: any) {
      if (err.code === 'ACTION_REJECTED' || err.code === 4001)
        setError('Benutzer hat die Transaktion abgebrochen')
      else if (err.message?.includes('reverted'))
        setError('Minting wurde vom Contract abgelehnt')
      else setError(err.message || 'Fehler beim Presale-Mint')
    } finally {
      setLoading(false)
    }
  }

  return { mintPresale, loading, error }
}
