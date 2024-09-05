// components/PDFButton.tsx

import { FaAddressBook, FaFilePdf, FaMusic } from "react-icons/fa";
import { MdQueueMusic } from "react-icons/md";

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
            className="flex items-center justify-center rounded-full w-9 h-9 hover:bg-cyan-400 bg-cyan-500 transition-colors"
        >
            <MdQueueMusic size={20} className="md:w-4 md:h-4 h-2 w-2 text-white"/>
        </Button>
    );
};

export default PDFButton;
