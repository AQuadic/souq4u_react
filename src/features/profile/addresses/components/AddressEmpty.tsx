import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AddressEmpty = () => {
    const {t} = useTranslation("Profile");
    return (
        <div className='flex flex-col items-center justify-center'>
            <img src='/images/profile/NoAddress.png' alt='address empty' width={303} height={302} />
            <h2 className='text-2xl font-semibold mt-8'>{t('Profile.noAddress')}</h2>
            <p className='text-[#C0C0C0] text-lg font-medium font-poppins mt-4 text-center md:w-[350px]'>{t('Profile.noAddressDes')}</p>
            <Link to="/profile/addresses/add" className="py-4 px-8 flex items-center justify-center gap-4 bg-main rounded-2xl text-white text-lg font-medium mt-10">
                <Plus />
                {t('Profile.Breadcrumbs.addAddress')}
            </Link>
        </div>
    )
}

export default AddressEmpty
