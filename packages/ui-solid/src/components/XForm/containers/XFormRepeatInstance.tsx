import type { RepeatInstanceNode } from '@odk-web-forms/xforms-engine';
import { Box, Stack, styled } from '@suid/material';
import { Show, createSignal } from 'solid-js';
import { TopLevelRepeatInstance } from '../../styled/TopLevelRepeatInstance.tsx';
import { XFormQuestionList } from '../XFormQuestionList.tsx';
import { RepeatInstanceOptionsMenu } from './RepeatInstanceOptionsMenu.tsx';
import { XFormRepeatInstanceLabel } from './XFormRepeatInstanceLabel.tsx';

const RepeatInstanceOptionsMenuContainer = styled(Box)({
	marginInlineStart: 'auto',
});

interface XFormRepeatInstanceProps {
	readonly index: number;
	readonly instance: RepeatInstanceNode;
}

export const XFormRepeatInstance = (props: XFormRepeatInstanceProps) => {
	const [isRepeatInstanceVisible, setRepeatInstanceVisible] = createSignal(true);
	const repeatLabel = () => {
		return props.instance.currentState.label;
	};

	return (
		<TopLevelRepeatInstance>
			<Stack direction="row" justifyContent="space-between">
				<Show when={repeatLabel()} keyed={true}>
					{(label) => (
						<XFormRepeatInstanceLabel
							node={props.instance}
							label={label}
							isRepeatInstanceVisible={isRepeatInstanceVisible()}
							setRepeatInstanceVisible={setRepeatInstanceVisible}
						/>
					)}
				</Show>
				<RepeatInstanceOptionsMenuContainer justifySelf="flex-end">
					<RepeatInstanceOptionsMenu index={props.index} instance={props.instance} />
				</RepeatInstanceOptionsMenuContainer>
			</Stack>
			<Show when={isRepeatInstanceVisible()}>
				<XFormQuestionList node={props.instance} />
			</Show>
		</TopLevelRepeatInstance>
	);
};
