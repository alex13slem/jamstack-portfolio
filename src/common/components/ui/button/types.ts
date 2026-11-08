export type ButtonVariant = "bordered" | "fill" | "subtle";

export interface StyleMapping {
  bordered: string;
  fill: string;
  subtle: string;
}

export interface VariantsCss {
  root: StyleMapping;
  text: StyleMapping;
  i: StyleMapping;
}
