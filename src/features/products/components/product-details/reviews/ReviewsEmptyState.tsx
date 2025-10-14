// import { useTranslations } from 'next-intl';

const ReviewsEmptyState = () => {
    // const t = useTranslations("Products");
    return (
        <section className='flex flex-col items-center'>
            <img
                src='/images/profile/two_rates.png'
                alt='face'
                width={88}
                height={55}
            />
            <p className='text-[#FDFDFD] text-[32px] font-medium leading-[150%] mt-6'>{('noReviewsYet')}</p>
            <p className='text-[#FDFDFD] text-[32px] font-medium leading-[150%] mt-6'>{('beTheFirst')}</p>
        </section>
    )
}

export default ReviewsEmptyState
