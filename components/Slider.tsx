"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    isProgressBar?: boolean; // Add this to differentiate between progress bar and volume slider
}

const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    isProgressBar = false // Determine if it's a progress bar
}) => {
    const handleChange = (newValue: number[]) => {
        onChange(newValue[0]);
    };

    return (
        <RadixSlider.Root
            className={`relative flex items-center select-none touch-none w-full ${isProgressBar ? 'h-2' : 'h-4'}`}
            defaultValue={[min]}
            value={[value]}
            onValueChange={handleChange}
            min={min}
            max={max}
            step={step}
            aria-label="Slider"
        >
            <RadixSlider.Track className={`bg-neutral-600 relative grow rounded-full ${isProgressBar ? 'h-1' : 'h-2'}`}>
                <RadixSlider.Range className={`absolute rounded-full h-full ${isProgressBar ? 'bg-white' : 'bg-white'}`} />
            </RadixSlider.Track>
        </RadixSlider.Root>
    );
};

export default Slider;
