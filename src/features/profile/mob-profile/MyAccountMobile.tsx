import BackArrow from '@/features/products/icons/BackArrow'
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import React from 'react'

const MyAccountMobile = () => {
    const t = useTranslations("Profile");
    return (
        <div className='container my-4'>
            <Link
                href="/profile"
                className="flex items-center gap-2 md:hidden"
                >
                <div className='transform ltr:scale-x-100 rtl:scale-x-[-1]'>
                    <BackArrow />
                </div>
                <h1 className=" text-[32px] font-bold leading-[100%]">
                    {t("myAccount") || "My Account"}
                </h1>
            </Link>

            <Link href='/profile/account' className='w-full h-12 dark:bg-[#242529] bg-gray-200 rounded-[8px] mt-8 flex items-center justify-between px-4'>
                <p className='text-base font-semibold leading-[100%]'>{t('accountInfo')}</p>
                <div className='transform rtl:scale-x-100 ltr:scale-x-[-1]'>
                    <BackArrow />
                </div>
            </Link>

            <Link href='/profile/change-email' className='w-full h-12 dark:bg-[#242529] bg-gray-200 rounded-[8px] mt-3 flex items-center justify-between px-4'>
                <p className='text-base font-semibold leading-[100%]'>{t('changeEmail')}</p>
                <div className='transform rtl:scale-x-100 ltr:scale-x-[-1]'>
                    <BackArrow />
                </div>
            </Link>

            <Link href='/profile/addresses' className='w-full h-12 dark:bg-[#242529] bg-gray-200 rounded-[8px] mt-3 flex items-center justify-between px-4'>
                <p className='text-base font-semibold leading-[100%]'>{t('saveAddress')}</p>
                <div className='transform rtl:scale-x-100 ltr:scale-x-[-1]'>
                    <BackArrow />
                </div>
            </Link>
        </div>
    )
}

export default MyAccountMobile
