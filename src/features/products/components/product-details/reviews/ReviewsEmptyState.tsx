import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React from 'react'

const ReviewsEmptyState = () => {
    const t = useTranslations("Products");
    return (
        <section className='flex flex-col items-center'>
            <Image
                src='/images/profile/two_rates.png'
                alt='face'
                width={88}
                height={55}
            />
            <p className='text-[#FDFDFD] text-[32px] font-medium leading-[150%] mt-6'>{t('noReviewsYet')}</p>
            <p className='text-[#FDFDFD] text-[32px] font-medium leading-[150%] mt-6'>{t('beTheFirst')}</p>
        </section>
    )
}

export default ReviewsEmptyState
