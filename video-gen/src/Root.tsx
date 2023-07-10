import {Composition} from 'remotion'
import {TikTok, myCompSchema} from './TikTok/TikTok'
import {formatted} from './data'

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				width={1080}
				height={1920}
				durationInFrames={30 * 46}
				fps={30}
				id="TikTok"
				component={TikTok}
				defaultProps={{
					prompt: formatted,
				}}
				schema={myCompSchema}
			/>
		</>
	)
}
