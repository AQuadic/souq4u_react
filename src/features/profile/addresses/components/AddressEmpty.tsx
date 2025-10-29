import { useTranslation } from "react-i18next";

const AddressEmpty = () => {
    const {t} = useTranslation("Profile");
    return (
        <div className='flex flex-col items-center justify-center'>
            <img src='/images/profile/NoAddress.png' alt='address empty' width={303} height={302} />
            <h2 className='text-2xl font-semibold mt-8'>{t('Profile.noAddress')}</h2>
            <p className='text-[#C0C0C0] text-lg font-medium font-poppins mt-4 text-center md:w-[350px]'>{t('Profile.noAddressDes')}</p>
        </div>
    )
}

export default AddressEmpty
