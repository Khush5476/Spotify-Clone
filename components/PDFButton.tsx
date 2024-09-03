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
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-cyan-400 bg-cyan-500 transition-colors"
        >
            <FaFilePdf className="text-white" size={20} />
        </Button>
    );
};

export default PDFButton;
