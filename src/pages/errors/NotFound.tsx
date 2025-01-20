import React from "react";
import Lottie, { useLottie } from "lottie-react";
import NavBar from "../NavBars/navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PageNotFoundAnimation from "../../assets/animations/404Anim.json";
import { useLoged } from "../../contexts/loged/useLoged";
import { NavBarUnloged } from "../NavBars/NavBarUnloged";
const NotFound = () => {

  const {loged} = useLoged()
  const style = { height: 700 };
  const options = {
    animationData: PageNotFoundAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  if(loged){
    return (
      <>
        <NavBar />
  
        {View}
      </>
    );
  }else{
    return(
      <>
      <NavBarUnloged/>
      {View}
      </>
    )
  }


};

export default NotFound;
