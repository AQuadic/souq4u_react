"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface GuideImageProps {
  guideImage?: {
    id: number;
    url: string;
    responsive_urls: string[];
  };
}

const GuideImage: React.FC<GuideImageProps> = ({ guideImage }) => {
    const {t} = useTranslation("Products");
    return (
        <Dialog>
        <DialogTrigger asChild>
            <section className="w-full h-14 rounded-[8px] flex items-center justify-around bg-popover text-popover-foreground border border-input mt-5 cursor-pointer">
                {t('Products.guideImage')}
            </section>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle className="ltr:text-left rtl:text-right">{t('Products.guideImage')}</DialogTitle>
            </DialogHeader>

            <div className="flex justify-center items-center">
            {guideImage ? (
                <img
                src={guideImage.responsive_urls?.[0] || guideImage.url}
                alt="Guide"
                className="rounded-lg max-h-[500px] object-contain"
                />
            ) : (
                <p className="text-sm text-muted-foreground">
                    {('noImage')}
                </p>
            )}
            </div>

            <DialogClose asChild>
            <button className="mt-4 px-4 py-2 rounded-lg bg-main text-white">
                {t('Products.close')}
            </button>
            </DialogClose>
        </DialogContent>
        </Dialog>
    );
};

export default GuideImage;
