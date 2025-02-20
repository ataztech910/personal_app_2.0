"use client";
import FsLightbox from "fslightbox-react";
import Image from "next/image";
import { useState } from "react";
import * as Icon from "react-feather";

export default function MainImage(information: any) {
    const [toggler, setToggler] = useState(false);
    const handleToggler = (event: boolean) => {
         setToggler(!toggler);
    };

    return (
        <>
        {information.information.aboutImage && (
                    <Image
                        src={information.information.aboutImage}
                        alt="aboutimage"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                        onClick={() => handleToggler(!toggler)}
                    />
                    )}
                    <span className="mi-about-image-icon">
                    <Icon.ZoomIn />
                    </span>
        <FsLightbox toggler={toggler} sources={[information.information.aboutImageLg]} />
        </>
    )
    }