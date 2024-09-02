"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1
}) => {
    const handleChange = (newValue: number[]) => {
        onChange(newValue[0]);
    };

    return (
        <RadixSlider.Root
            className="relative flex items-center select-none touch-none w-full h-10"
            defaultValue={[min]}
            value={[value]}
            onValueChange={handleChange}
            min={min}
            max={max}
            step={step}
            aria-label="Slider"
        >
            <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
                <RadixSlider.Range className="absolute bg-white h-full rounded-full" />
            </RadixSlider.Track>
        </RadixSlider.Root>
    );
};

export default Slider;
