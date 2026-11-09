import type { VariantsCss } from "./types";

export const variantsCss: VariantsCss = {
  root: {
    bordered: `
      relative z-10 p-[2px]
      overflow-hidden
      text-cyangrey
      animate-gradient__activeXs animate-gradient__rotate`,
    fill: `
      text-black
      transition-transform duration-200 hover:-translate-y-[1px]`,
    subtle: `
      text-cyangrey bg-white/[0.03] border border-white/[0.08]
      hover:bg-white/[0.07] hover:border-white/[0.16]
      transition-colors duration-200`,
  },

  text: {
    bordered: `bg-darkgrey`,
    fill: "colors__gradient",
    subtle: "",
  },
  i: {
    fill: `
      bg-black/40 transition-opacity duration-200
      opacity-0 group-hover:opacity-100 w-2/3 h-[8px] absolute
      -bottom-1 left-1/2 -z-1 -translate-x-1/2 blur-md`,
    bordered: ``,
    subtle: "",
  },
};
