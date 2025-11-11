import BackArrow from '@/features/products/icons/BackArrow'

import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MyAccountMobile = () => {
    const {t} = useTranslation("Profile");
    return (
        <div className='container my-4'>
            <Link
                to="/profile"
                className="flex items-center gap-2 md:hidden"
                >
                <div className='transform ltr:scale-x-100 rtl:scale-x-[-1]'>
                    <BackArrow />
                </div>
                <h1 className=" text-[32px] font-bold leading-[100%]">
                    {t("Profile.myAccount") || "My Account"}
                </h1>
            </Link>

            <Link to='/profile/account' className='w-full h-12 dark:bg-[#242529] bg-gray-200 rounded-[8px] mt-8 flex items-center justify-between px-4'>
                <p className='text-base font-semibold leading-[100%]'>{t('Profile.accountInfo')}</p>
                <div className='transform rtl:scale-x-100 ltr:scale-x-[-1]'>
                    <BackArrow />
                </div>
            </Link>

            {/* <Link to='/profile/change-email' className='w-full h-12 dark:bg-[#242529] bg-gray-200 rounded-[8px] mt-3 flex items-center justify-between px-4'>
                <p className='text-base font-semibold leading-[100%]'>{t('Profile.changeEmail')}</p>
                <div className='transform rtl:scale-x-100 ltr:scale-x-[-1]'>
                    <BackArrow />
                </div>
            </Link> */}

            <Link to='/profile/addresses' className='w-full h-12 dark:bg-[#242529] bg-gray-200 rounded-[8px] mt-3 flex items-center justify-between px-4'>
                <p className='text-base font-semibold leading-[100%]'>{t('Profile.saveAddress')}</p>
                <div className='transform rtl:scale-x-100 ltr:scale-x-[-1]'>
                    <BackArrow />
                </div>
            </Link>
        </div>
    )
}

export default MyAccountMobile
