// Export the engine
export { SlidingWindowEngine } from './engine/SlidingWindowEngine';

// Export components
export { default as ArrayVisualizer } from './components/ArrayVisualizer';
export { default as CharacterCountVisualizer } from './components/CharacterCountVisualizer';
export { default as CharacterFrequencyVisualizer } from './components/CharacterFrequencyVisualizer';
export { default as CodeBot } from './components/CodeBot';
export { default as ControlPanel } from './components/ControlPanel';
export { default as JarvisBot } from './components/JarvisBot';
export { default as OnesCountVisualizer } from './components/OnesCountVisualizer';
export { default as PrefixSumVisualizer } from './components/PrefixSumVisualizer';
export { default as SlidingWindowPlayground } from './components/SlidingWindowPlayground';
export { default as ZeroCountVisualizer } from './components/ZeroCountVisualizer';

// Export types
export type {
    ArrayElement,
    PlaygroundState, PlaygroundStep,
    UIState, UserAction
} from './engine/SlidingWindowEngine';

// Export global styles
export * from '../../styles/global';

