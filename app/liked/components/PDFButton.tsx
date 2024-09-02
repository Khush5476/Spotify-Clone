// components/PDFButton.tsx
import { FaFilePdf } from "react-icons/fa";
import Button from "@/components/Button";

interface PDFButtonProps {
    url: string;
}

const PDFButton: React.FC<PDFButtonProps> = ({ url }) => {
    const handleClick = () => {
        window.open(url, '_blank');
    };

    return (
        <Button onClick={handleClick} className="flex items-center justify-center p-2 rounded-full bg-cyan-500 hover:bg-cyan-900 transition-colors">
            <FaFilePdf className="text-white" />
        </Button>
    );
};

export default PDFButton;
