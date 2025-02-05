import { useNavigate } from "@tanstack/react-router";
import dhiwayLogo from 'src/assets/dhiway_logo_white.svg'
// import useAuthStore from "src/store/authStore";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-16 px-4 flex items-center justify-between bg-gradient-to-r from-[#38BDF8] to-[#0284C7] rounded-b-lg">
            <div onClick={() => { navigate({ to: '/' }) }} className="flex flex-row text-sky-50 ml-24">
                <img src={dhiwayLogo} className="w-[120px]" />
            </div>
        </div>
    );
}

export default Header;
