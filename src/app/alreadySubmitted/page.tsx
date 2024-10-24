'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function SubmittedPage() {
	return (
		<div className="flex flex-col items-center justify-center h-96">
			<h1 className="text-4xl font-bold mb-4">Thank You!</h1>
			<p className="text-gray-600 mb-4">You have already submitted your response.</p>
			<Link href="/">
				<Button>
					Return Home
				</Button>
			</Link>
		</div>
	)
}

export default SubmittedPage