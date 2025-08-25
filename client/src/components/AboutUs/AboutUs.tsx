import { FC } from "react";
import { aboutUs } from "../../content/about";
import { Logo, Title, Description, Thanks } from "./AboutUsComponents";

export const AboutUs: FC = () => {
  return (
    <div
      className="bg-zinc-900/90 rounded-3xl shadow-2xl max-w-[380px] md:max-w-[1220px] w-full mx-auto my-16 flex flex-col items-center justify-center p-8 border border-zinc-700"
      id="about"
    >
      <Logo />
      <Title text={aboutUs.title} />
      <Description subtitle={aboutUs.subtitle} description={aboutUs.description} />
      <Thanks text={aboutUs.thanks} />
    </div>
  );
};
