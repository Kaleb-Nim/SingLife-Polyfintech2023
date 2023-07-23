import {
	AbsoluteFill,
	Video,
	Audio,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
} from 'remotion'
import TransitionSeries from 'remotion-transition-series/lib/TransitionSeries'

import {z} from 'zod'
import {formatted} from '../data'
import {createClient} from 'pexels'
const client = createClient(
	'YzJQumHiBwTeLrAlZ9UUMmOZLX9qaSxmb7o4F6F8Rlrn7IaQWnqa38TG'
)
import React from 'react'
import {Pan} from '../Pan'
import {LinearWipe} from '../LinearWipe'
import {SlidingDoors} from '../Plate'

export const myCompSchema = z.object({
	prompt: z.array(
		z.object({
			scene: z.string(),
			subtitles: z.array(z.string()),
		})
	),
})

export const TikTok: React.FC<z.infer<typeof myCompSchema>> = ({prompt}) => {
	const [formatted, setFormatted] = React.useState([])
	React.useEffect(() => {
		const fetchVids = async () => {
			const promises = []
			for (const scene of prompt) {
				promises.push(
					client.videos
						.search({
							query: scene.scene,
							per_page: 1,
							max_duration: 10,
							size: 'small',
						})
						.then((res) => {
							return res.videos[res.videos.length - 1]
						})
				)
			}
			const results = await Promise.all(promises)
			console.log(results)
			for (let i = 0; i < results.length; i++) {
				results[i] = {
					link: results[i].video_files[0].link,
					subtitles: prompt[i].subtitles,
				}
			}
			setFormatted(results)
		}
		fetchVids()
	}, [prompt])
	const frame = useCurrentFrame()
	const {fps} = useVideoConfig()

	const begin_frame = React.useRef(0)
	const formatted_with_frames = React.useMemo(
		() =>
			formatted.map((vid) => {
				const fps = 30
				const wpm = 275
				const new_subtitles = JSON.parse(JSON.stringify(vid.subtitles))
				for (let i = 0; i < vid.subtitles.length; i++) {
					const subtitle = vid.subtitles[i]
					const word_count = subtitle.split(' ').length
					const duration = Math.ceil((word_count / wpm) * 60)
					new_subtitles[i] = {
						text: subtitle,
						start_frame: begin_frame.current,
						end_frame:
							begin_frame.current + i * fps * duration + fps * duration,
					}
					begin_frame.current += i * fps * duration + fps * duration
				}
				return {
					...vid,
					subtitles: new_subtitles,
				}
			}),
		[formatted]
	)
	if (!formatted_with_frames.length) {
		return null
	}

	return (
		<AbsoluteFill style={{backgroundColor: '#363636'}}>
			<Audio src={staticFile('ski.mp3')} volume={4} />
			<Audio loop src={staticFile('bg.mp3')} volume={0.02} />
			<TransitionSeries>
				{formatted_with_frames.map((vid, index) => {
					const wpm = 145
					const {link, subtitles} = vid
					const all_subtitles = subtitles
						.map((subtitle: {text: string}) => subtitle.text)
						.join(' ')
					const word_count = all_subtitles.split(' ').length
					const total_duration = Math.ceil((word_count / wpm) * 60)
					return (
						<>
							<TransitionSeries.Sequence
								key={index}
								durationInFrames={fps * total_duration}
							>
								<>
									<Video key={index} muted src={link} />
									{subtitles.map(
										(
											subtitle: {
												text: string
												start_frame: number
												end_frame: number
											},
											idx: number
										) => {
											return (
												<div
													key={idx}
													style={{
														position: 'absolute',
														bottom: '5%',
														paddingInline: '10%',
														width: '100%',
														color: 'white',
														fontSize: 30,
														display:
															frame >= subtitle.start_frame &&
															frame <= subtitle.end_frame
																? 'block'
																: 'none',
													}}
												>
													<h1
														style={{
															textShadow: '2px 2px 20px #000000',
														}}
													>
														{subtitle.text}
													</h1>
												</div>
											)
										}
									)}
								</>
							</TransitionSeries.Sequence>
							{index < formatted_with_frames.length - 1 && (
								<TransitionSeries.Transition
									durationInFrames={30}
									transitionComponent={(props) => <SlidingDoors {...props} />}
								/>
							)}
						</>
					)
				})}
			</TransitionSeries>
			<Sequence from={fps * 41}>
				<Video src={staticFile('end.mp4')} />
			</Sequence>
		</AbsoluteFill>
	)
}
