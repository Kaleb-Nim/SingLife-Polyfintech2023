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
import './test.css'
import {z} from 'zod'
// import {getVoice} from 'elevenlabs-node'
// console.log(getVoice(process.env.ELEVENLABS_API_KEY))
// import {formatted} from '../data'
import {createClient} from 'pexels'
const client = createClient(process.env.PEXELS_API_KEY)
import React from 'react'
// import {Pan} from '../Pan'
// import {LinearWipe} from '../LinearWipe'
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
				// console.log(scene)
				promises.push(
					client.videos
						.search({
							query: scene.scene,
							per_page: 1,
							max_duration: 10,
							// orientation: 'portrait',
							size: 'small',
						})
						.then((res) => {
							return res.videos[0]
						})
				)
			}
			const results = await Promise.all(promises)
			console.log(promises)
			console.log(results)
			for (let i = 0; i < results.length; i++) {
				// console.log(results[i].video_files[0].link)
				console.log(results[i])
				console.log(results[i].url.split('-'))
				results[i] = {
					// link: results[i].video_files[0].link,
					link: `${i + 1}.mp4`,
					subtitles: prompt[i].subtitles,
				}
			}
			setFormatted(results)
		}
		fetchVids()
	}, [prompt])
	const frame = useCurrentFrame()
	const {fps} = useVideoConfig()

	const frameMapper = [
		84, 206, 273, 315, 439, 547, 609, 630, 763, 803, 877, 919, 1030, 1061, 1155,
		1235, 1317, 1466, 1655, 1694, 1750, 1898, 1928, 2127, 2220,
	]


	const begin_frame = React.useRef(0)
	const formatted_with_frames = React.useMemo(() => {
		let counter = 0
		return formatted.map((vid, vidIdx) => {
			const fps = 30
			const wpm = 240
			const new_subtitles = JSON.parse(JSON.stringify(vid.subtitles))
			for (let i = 0; i < vid.subtitles.length; i++, counter++) {
				const subtitle = vid.subtitles[i]
				const word_count = subtitle.split(' ').length
				const duration = Math.ceil((word_count / wpm) * 60)
				if (counter != 0 && frameMapper[counter - 1]) {
					var starting_frame = frameMapper[counter - 1]
				} else {
					var starting_frame = 0
				}
				new_subtitles[i] = {
					text: subtitle,
					start_frame: starting_frame,
					end_frame:
						frameMapper[counter] ||
						begin_frame.current + i * fps * duration + fps * duration,
				}
				begin_frame.current += i * fps * duration + fps * duration
			}
			return {
				...vid,
				subtitles: new_subtitles,
			}
		})
	}, [formatted])
	if (!formatted_with_frames.length) {
		return null
	}

	const videoLengthArr = [
		275 / 30,
		(554 - 275) / 30,
		(791 - 554) / 30,
		(1035 - 791) / 30,
		(1376 - 1035) / 30,
		(1694 - 1376) / 30,
		(1949 - 1694) / 30,
		(2321 - 1949) / 30,
	]

	return (
		<AbsoluteFill style={{backgroundColor: '#363636'}}>
			<Audio src={staticFile('payout.mp3')} volume={4} />
			<Audio loop src={staticFile('bg2.mp3')} volume={0.1} />
			<TransitionSeries>
				{formatted_with_frames.map((vid, index) => {
					const wpm = 100
					const {link, subtitles} = vid
					const all_subtitles = subtitles
						.map((subtitle: {text: string}) => subtitle.text)
						.join(' ')
					const word_count = all_subtitles.split(' ').length
					const total_duration =
						videoLengthArr[index] || Math.ceil((word_count / wpm) * 60)
					// console.log(subtitles, total_duration)
					return (
						<>
							<TransitionSeries.Sequence
								key={index}
								durationInFrames={fps * total_duration}
							>
								<div
									style={{
										position: 'absolute',
										inset: '0px',
										width: '100%',
										height: '100%',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<Video
										key={'Video' + index}
										muted
										src={staticFile(link)}
										startFrom={50}
										loop
									/>
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
													key={'Text' + idx + index}
													style={{
														position: 'absolute',
														bottom: '5%',
														paddingInline: '10%',
														width: '100%',
														color: 'white',
														fontSize:
															subtitle.text.split(' ').length < 2 ? 50 : 30,
														display:
															frame >= subtitle.start_frame &&
															frame <= subtitle.end_frame
																? 'flex'
																: 'none',
														justifyContent: 'center',
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
								</div>
							</TransitionSeries.Sequence>
							{index < formatted_with_frames.length - 1 && (
								<TransitionSeries.Transition
									durationInFrames={10}
									transitionComponent={(props) => <SlidingDoors {...props} />}
								/>
							)}
						</>
					)
				})}
			</TransitionSeries>
			<Sequence from={fps * 75}>
				<Video src={staticFile('end.mp4')} />
			</Sequence>
		</AbsoluteFill>
	)
}
