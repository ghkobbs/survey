import TakeSurvey from '@/components/take-survey'
import React from 'react'
import { PageProps } from '../../../../.next/types/app/page';

async function TakeSurveyPage(props: PageProps) {
	const { id } = await props.params;

	return (
		<TakeSurvey id={id} />
	)
}

export default TakeSurveyPage