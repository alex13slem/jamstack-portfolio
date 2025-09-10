import type { ComponentProps, FC, HTMLAttributes } from "react";
import Textra from "react-textra";

interface Props extends ComponentProps<FC>, HTMLAttributes<HTMLDivElement> {
  epithets: string[];
}

const HeroEpithets: FC<Props> = ({ epithets }) => {
  return (
    <Textra
      data={epithets}
      effect={"downTop"}
      className=" bg-clip-text text-transparent bg-gradient-to-b from-white to-yellowgrey"
    />
  );
};

export default HeroEpithets;
