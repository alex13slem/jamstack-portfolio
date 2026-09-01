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
      className="animated-colors__gradient bg-clip-text text-transparent"
    />
  );
};

export default HeroEpithets;
