'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Phone, KeyRound } from 'lucide-react'

export default function AuthPage() {
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = getSupabaseClient()

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Basic validation
        if (phone.length < 10) {
            toast.error('Please enter a valid phone number')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: phone,
            })

            if (error) {
                console.error(error)
                toast.error(error.message)
            } else {
                toast.success(`OTP sent to ${phone}`)
                setStep('otp')
            }
        } catch (err) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms',
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Successfully signed in')
                router.push('/')
            }
        } catch (err) {
            toast.error('Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        {step === 'phone'
                            ? 'Enter your phone number to sign in or create an account'
                            : `Enter the code sent to ${phone}`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="tel"
                                        placeholder="+234 800 000 0000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Send Code'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="pl-10 text-center tracking-widest text-lg"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Verify Code'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep('phone')}
                                disabled={loading}
                            >
                                Change Phone Number
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
