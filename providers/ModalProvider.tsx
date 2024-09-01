"use client"

import Authmodal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return(
        <>
            <Authmodal/>
            <UploadModal/>
        </>
    );
}

export default ModalProvider;