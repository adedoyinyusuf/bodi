'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Phone } from 'lucide-react'

export default function AuthPage() {
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { signIn } = useAuth()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (phone.length < 8) {
            toast.error('Please enter a valid phone number or email')
            setLoading(false)
            return
        }

        try {
            // Sign in using local AuthContext
            const userId = 'usr_' + Math.random().toString(36).substring(2, 9)
            signIn({
                id: userId,
                phone: phone,
                email: phone.includes('@') ? phone : undefined
            })
            toast.success('Successfully signed in!')
            router.push('/')
        } catch (err) {
            toast.error('Sign in failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome to Wearables</CardTitle>
                    <CardDescription>
                        Enter your phone number or email to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Phone or Email (e.g. +234... or user@example.com)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Continue'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
