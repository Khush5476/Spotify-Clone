// components/PDFButton.tsx

import { FaFilePdf } from "react-icons/fa";
import Button from "./Button";

interface PDFButtonProps {
    url: string;
}

const PDFButton: React.FC<PDFButtonProps> = ({ url }) => {
    const handleClick = () => {
        window.open(url, '_blank');
    };

    return (
        <Button 
            onClick={handleClick} 
            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full hover:bg-cyan-400 bg-cyan-500 transition-colors"
        >
            <FaFilePdf className="text-white text-sm md:text-base lg:text-lg" />
        </Button>
    );
};

export default PDFButton;
