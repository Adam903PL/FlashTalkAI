import React from "react";
import Lottie, { useLottie } from "lottie-react";
import NavBar from "../navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PageNotFoundAnimation from "../../assets/animations/404Anim.json";
const NotFound = () => {
  const style = { height: 700 };
  const options = {
    animationData: PageNotFoundAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  return (
    <>
      <NavBar />

      {View}
    </>
  );
};

export default NotFound;
