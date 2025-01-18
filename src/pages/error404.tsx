import { useRef } from "react";
import LottieView, { type LottieRefCurrentProps } from "lottie-react";
import animationJson from "../assets/Error404.json"
import homeStyles from "./css/home.module.css";
import { useNavigate } from "react-router-dom";


export const error404 = () => {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);
    const navigate = useNavigate();

    return (
        <div>
            <div><LottieView animationData={animationJson} lottieRef={lottieRef} /></div>
                <button className={homeStyles.optionCard}
                        onClick={() => {
                            navigate("/home");
                        }}>Go to home page</button>
        </div>
    )
}